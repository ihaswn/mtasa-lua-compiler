import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import * as xml2js from "xml2js";

// Main command function for converting Lua files to Luac
async function compileScript(
	uris: vscode.Uri | vscode.Uri[],
	options: { forceReplace?: boolean } = {}
) {
	// Ensure uris is an array
	const urisArray = Array.isArray(uris) ? uris : [uris];

	// Filter invalid files
	const validUris = urisArray.filter(
		(uri) => uri.fsPath.endsWith(".lua") && fs.existsSync(uri.fsPath)
	);

	if (validUris.length === 0) {
		vscode.window.showErrorMessage("No valid .lua files to compile.");
		return; // Exit if no valid files
	}

	const totalFiles = validUris.length;
	let processedFiles = 0;

	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: "Compiling Scripts",
			cancellable: true,
		},
		async (progress, token) => {
			token.onCancellationRequested(() => {
				vscode.window.showInformationMessage(
					"Compile process canceled."
				);
			});

			for (const fileUri of validUris) {
				const luacFilePath = fileUri.fsPath.replace(/\.lua$/, ".luac");

				// Handle replacement logic
				if (fs.existsSync(luacFilePath)) {
					if (options.forceReplace !== true) {
						const replace = await vscode.window.showWarningMessage(
							`The file ${path.basename(
								luacFilePath
							)} already exists. Do you want to replace it?`,
							{ modal: true },
							"Yes"
						);

						if (replace !== "Yes") {
							processedFiles++;
							progress.report({
								message: `Skipping ${path.basename(
									fileUri.fsPath
								)}`,
								increment: Math.round((1 / totalFiles) * 100),
							});
							continue; // Skip this file
						}
					}
				}

				const luaSource = fs.readFileSync(fileUri.fsPath);
				try {
					const config =
						vscode.workspace.getConfiguration("mtasa_luac");
					const obfuscateLevel =
						config.get<string>("obfuscate") || "0"; // Ensure type is string
					const useProxy = config.get<boolean>(
						"mtasa_luac.use_proxy"
					);
					const axiosProxy = useProxy === true ? undefined : false;

					const response = await axios.post(
						"https://luac.mtasa.com/index.php",
						{
							luasource: luaSource,
							compile: 1,
							debug: 1,
							obfuscate: obfuscateLevel,
						},
						{
							headers: { "Content-Type": "multipart/form-data" },
							proxy: axiosProxy,
							onUploadProgress: (progressEvent) => {
								const total = progressEvent.total || 0;
								const current = progressEvent.loaded || 0;
								const percentCompleted = Math.round(
									(current / total) * 100
								);
								progress.report({
									message: `Compiling (${
										processedFiles + 1
									}/${totalFiles}): ${path.basename(
										fileUri.fsPath
									)} - ${percentCompleted}%`,
									increment: Math.round(
										(1 / totalFiles) * 100
									),
								});
							},
						}
					);

					fs.writeFileSync(luacFilePath, response.data);
					processedFiles++;
				} catch (error) {
					if (axios.isAxiosError(error)) {
						vscode.window.showErrorMessage(
							`Failed to compile ${path.basename(
								fileUri.fsPath
							)}: ${error.message}`
						);
					} else {
						vscode.window.showErrorMessage(
							`An unexpected error occurred while compiling ${path.basename(
								fileUri.fsPath
							)}: ${String(error)}`
						);
					}
				}
			}

			// Final message after processing all files
			vscode.window.showInformationMessage(
				`Compiled ${processedFiles} Lua script(s) successfully.`
			);
		}
	);
}

// Command function for compiling client scripts from meta.xml
async function compileToLuacFromMetaFromMeta(uri?: vscode.Uri) {
	const fileUri = uri || vscode.window.activeTextEditor?.document.uri;

	if (!fileUri || !fileUri.fsPath.endsWith("meta.xml")) {
		vscode.window.showErrorMessage(
			"Please open or select a meta.xml file."
		);
		return;
	}

	const metaFilePath = fileUri.fsPath;
	const metaContent = fs.readFileSync(metaFilePath, "utf8");

	// Parse the XML
	xml2js.parseString(metaContent, async (err: Error | null, result: any) => {
		if (err) {
			vscode.window.showErrorMessage(
				"Error parsing meta.xml: " + err.message
			);
			return;
		}

		if (!result || !result.meta || !result.meta.script) {
			vscode.window.showErrorMessage(
				"Invalid meta.xml structure: 'meta' or 'script' not found."
			);
			return;
		}
		const scripts = result.meta.script; // Access script elements from the parsed XML

		// Filter to find client or shared scripts
		const clientScripts = scripts.filter((script: any) => {
			const type = script.$.type; // Access the type attribute
			return type === "client" || type === "shared"; // Adjust based on actual types
		});

		// If no client/shared scripts are found
		if (clientScripts.length === 0) {
			vscode.window.showErrorMessage(
				"No client or shared scripts found."
			);
			return;
		}

		// Collect valid Lua files from the scripts
		// Collect valid Lua files from the scripts
		const luaFiles = clientScripts
			.map((script: any) => {
				const scriptPath = script.$.src; // Get the src attribute
				const fullScriptPath = path.join(
					path.dirname(metaFilePath),
					scriptPath
				);

				// Return as vscode.Uri
				return fullScriptPath.endsWith(".luac")
					? vscode.Uri.file(fullScriptPath.replace(/\.luac$/, ".lua"))
					: vscode.Uri.file(fullScriptPath);
			})
			.filter((uri: vscode.Uri) => fs.existsSync(uri.fsPath)); // Filter out non-existent files

		if (luaFiles.length === 0) {
			vscode.window.showErrorMessage(
				"No valid .lua files found to compile."
			);
			return;
		}

		// Call compileScript with the array of valid Lua files
		await compileScript(luaFiles, { forceReplace: true });

		// Ask user if they want to update the meta.xml
		const updateMeta = await vscode.window.showWarningMessage(
			"Do you want to update the script paths in meta.xml to .luac?",
			{ modal: true },
			"Yes",
			"No"
		);

		if (updateMeta === "Yes") {
			// Update the paths in the meta.xml
			clientScripts.forEach((script: any) => {
				if (script.$.src.endsWith(".lua")) {
					script.$.src = script.$.src.replace(/\.lua$/, ".luac");
				}
			});

			// Convert back to XML without declaration
			const builder = new xml2js.Builder({
				xmldec: {
					version: null, // Suppress the XML declaration
					encoding: null,
					standalone: null,
				},
			});

			let updatedXml = builder.buildObject(result);
			updatedXml = updatedXml
				.replace(/<\?xml version="1\.0"\?>/, "")
				.trim();

			// Write back to meta.xml
			fs.writeFileSync(metaFilePath, updatedXml);
			vscode.window.showInformationMessage(
				"meta.xml updated successfully."
			);
		}
	});
}

// Command registration
export function activate(context: vscode.ExtensionContext) {
	let disposableCompile = vscode.commands.registerCommand(
		"extension.compileToLuac",
		compileScript
	);
	context.subscriptions.push(disposableCompile);

	let disposableCompileClient = vscode.commands.registerCommand(
		"extension.compileToLuacFromMeta",
		compileToLuacFromMetaFromMeta
	);
	context.subscriptions.push(disposableCompileClient);

	// Add the command to the context menu for .lua files
	context.subscriptions.push(
		vscode.commands.registerCommand("extension.addContextMenu", () => {
			const luaFiles = vscode.workspace.findFiles("**/*.lua");
			luaFiles.then((files) => {
				files.forEach((file) => {
					context.subscriptions.push(
						vscode.commands.registerCommand(
							`extension.contextMenu.${file.fsPath}`,
							() => {
								// Call the compileScript command directly
								vscode.commands.executeCommand(
									"extension.compileToLuac",
									file
								);
							}
						)
					);
				});
			});
		})
	);

	// Add the context menu for meta.xml files
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"extension.contextMenuMeta",
			(uri: vscode.Uri) => {
				compileToLuacFromMetaFromMeta(uri);
			}
		)
	);
}

export function deactivate() {}