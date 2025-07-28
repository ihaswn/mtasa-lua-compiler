# Lua to Luac Compiler!

An extension that allows you to convert your MTA:SA source files (.lua) into Lua bytecode files (.luac) easily!

---

## Why?

Client scripts are downloaded and executed on players’ computers, giving them access to the source code. This can lead to misuse or theft of your scripts. Compiling these scripts adds an extra layer of security, making it harder for others to reverse-engineer your code, though it won’t completely prevent it.

---

## Features

- **Easy to use**: Right-click on any `.lua` file in the editor or Explorer to convert it to `.luac`, this method wont automaticly update the meta.xml to include `.luac` file.
- **Auto Detect From meta.xml**: You can Right-click on a meta.xml file to auto-detect all client files and convert them into `.luac` and even update the meta.xml automaticly!
- **Config**: You can modify the extension settings to match your prefrences on compile!

---

## Installation

You can install the extension using one of the following methods:

1. Visual Studio Code Marketplace: The easiest way to install the extension is to search for it directly in the Visual Studio Code Marketplace. Open VS Code, go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side, and search for the extension name. Click on “Install” to add it to your setup.

2. Manual Installation: If you prefer to install the extension manually, you can download the .vsix file from the project’s repository or release page. Once downloaded, open Visual Studio Code, go to the Extensions view, click on the ellipsis (three dots) in the top right corner, and select “Install from VSIX…”. Then, locate the downloaded .vsix file and click “Open” to install the extension.

---

## Usage

### Method 1: Compile Individual Lua Files
1. Open a `.lua` file in the editor or select a `.lua` file in the Explorer.
2. Right-click on the file and select **Compile (.luac)** from the context menu.
3. Once the conversion is complete, a `.luac` file will be generated in the same directory.

### Method 2: Compile All Client Files Using `meta.xml`
1. Ensure you have a `meta.xml` file that lists all the client scripts you want to compile.
2. Open the Command Palette in Visual Studio Code by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).
3. Type **Compile All Client Scripts (.luac)** and select the command from the list.
4. The extension will read the `meta.xml` file, compile all specified client scripts (client/shared), and generate corresponding `.luac` files in their respective directories. This method allows for batch processing, saving you time when compiling multiple scripts at once.

---

## Configuration and Key Bindings

### Commands

This extension provides the following commands for compiling Lua scripts:

- **Compile (.luac)**: 
  - **Command**: `extension.compileToLuac`
  - **Description**: Compiles the currently open Lua script into a .luac file.

- **Compile All Client Scripts (.luac)**: 
  - **Command**: `extension.compileToLuacFromMeta`
  - **Description**: Compiles all client scripts listed in the meta file into .luac files.

### Key Bindings

You can use the following key bindings to quickly access the commands:

- **Compile (.luac)**: 
  - **Key Binding**: `Ctrl + Shift + B`
  - **Condition**: When the editor text is focused and the file extension is `.lua`.

### Context Menu Options

The following commands are also available in the context menus for easy access:

- **In the Editor Context Menu**:
  - **Compile (.luac)**: Available when the resource extension is `.lua`.
  - **Compile All Client Scripts (.luac)**: Available when the resource extension is `.xml`.

- **In the Explorer Context Menu**:
  - **Compile (.luac)**: Available when the resource extension is `.lua`.
  - **Compile All Client Scripts (.luac)**: Available when the resource extension is `.xml`.

### Configuration Settings

You can customize the following settings in your configuration file:

- **Lua Compiler Settings**:
  - **Obfuscation Level**:
    - **Key**: `mtasa_luac.obfuscate`
    - **Type**: String
    - **Options**: 
      - `0`: No obfuscation
      - `1`: Some obfuscation
      - `2`: More obfuscation
      - `3`: Even more obfuscation
    - **Default**: `0`
    - **Description**: Select the level of obfuscation to apply to your compiled Lua scripts.

  - **Use Proxy**:
    - **Key**: `mtasa_luac.use_proxy`
    - **Type**: Boolean
    - **Default**: `true`
    - **Description**: Use machine proxy for Axios requests.

## Requirements

- Visual Studio Code (version 1.50.0 or later)
- Internet connection (for API access)

## Known Issues

- Ensure that the Lua file is syntactically correct to avoid compilation errors.
- The conversion relies on an external API. If the API is down or unreachable, the conversion will fail.

## Contribution

Feel free to submit issues or pull requests if you find any bugs or have suggestions for improvements.

## Disclaimer

We do not store users resource source codes. When you compile your Lua scripts, the source code is uploaded directly to the official Multi Theft Auto (MTA) compiler website and downloaded back after processing. For more details, please refer to the MTA Lua Compilation API Wiki.