![Icon](images/icon.png)

# Lua to Luac Compiler!

An extension that allows you to convert your MTA:SA source files (.lua) into Lua bytecode files (.luac) easily!

---

## Why?

Client scripts are downloaded and executed on players’ computers, giving them access to the source code. This can lead to misuse or theft of your scripts. Compiling these scripts adds an extra layer of security, making it harder for others to reverse-engineer your code, though it won’t completely prevent it.

---

## Disclaimer

We do not store users resource source codes. When you compile your Lua scripts, the source code is uploaded directly to the official Multi Theft Auto (MTA) compiler website and downloaded back after processing. For more details, please refer to the [MTA Lua Compilation API Wiki](https://wiki.multitheftauto.com/wiki/Lua_compilation_API).

---

## Installation

Launch VS Code Quick Open (Ctrl+P), paste the following command and press enter.
```
ext install ihaswn.mtasa-lua-compiler
```

---

## Usage

### Method 1: Compile Individual Lua Files
1. Open a `.lua` file in the editor or select a `.lua` file in the Explorer.
2. Right-click on the file and select **Compile (.luac)** from the context menu *OR* use the key bind **CTRL+SHIFT+B** when the script is open and is on the active editor.
3. Once the conversion is complete, a `.luac` file will be generated in the same directory.

### Method 2: Compile All Client Files Using `meta.xml`
1. Ensure you have a `meta.xml` file that lists all the client scripts you want to compile.
2. Right-click on the meta.xml and select **Compile All Client Scripts (.luac)** from the context menu.
3. The proccess will read the `meta.xml` file, compile all specified client scripts (client/shared), and generate corresponding `.luac` files in their respective directories. You can also choose to update meta.xml to include the .luac files instead of .lua at the end of the process, for scripts that are already are included as `.luac` extension will look for their .lua file and re-compile them aswell.

---

## Configuration and Key Bindings

---

### Key Bindings

You can use the following key bindings to quickly access the commands:

- **Compile (.luac)**: 
  - **Key Binding**: `Ctrl + Shift + B`
  - **Condition**: When the editor text is focused and the file extension is `.lua`.

---

## Requirements

- Visual Studio Code (version 1.50.0 or later)
- Internet connection (for API access)

---

### Configuration Settings

You can customize the following settings in your extension settings:

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

---

## Known Issues

- The conversion relies on an external API. If the API is down or unreachable, the conversion will fail.

---
