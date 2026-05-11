# dui-cli

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PawaJS](https://img.shields.io/badge/Framework-PawaJS-orange.svg)](https://pawajs.vercel.app)

A Command Line Interface (CLI) tool designed to streamline the process of adding Dui components to your PawaJS projects.

## Table of Contents

*   [Features](#features)
*   [Installation](#installation)
*   [Usage](#usage)
    *   [dui init](#dui-init)
    *   [dui add](#dui-add)
*   [Adding New Component Templates](#adding-new-component-templates)
*   [Contributing](#contributing)
*   [License](#license)

## Features

*   **Easy Initialization**: Set up the necessary directory structure (`src/components`, `src/assets`) and core utility files (`utils.js`, `style.css`, `dprovider.js`) for Dui components in your PawaJS project.
*   **Component Scaffolding**: Quickly add pre-defined Dui components from the CLI's templates to your project.
*   **Multiple Component Support**: Add one or more components with a single command.
*   **Path-aware Component Addition**: Supports nested component paths (e.g., `form/dinput`).

## Installation

To use `dui-cli`, you typically install it globally or use `npx`.

```bash
npm install -g dui-cli
```

Alternatively, using yarn:

```bash
yarn global add dui-cli
```

## Usage

### `dui init`

Initializes the Dui component setup in your PawaJS project. This command performs the following actions:

1.  Ensures `src/components` and `src/assets` directories exist.
2.  Copies `utils.js` into `src/components`.
3.  Copies `dprovider.js` into `src/components`.
4.  Copies `style.css` into `src/assets`.
5.  Provides a reminder to import `style.css` in your main entry file.

```bash
dui init
```

### `dui add <component-paths...>`

Adds one or more Dui components to your project from the CLI's templates. You can specify components by their name or their path within the templates.

**Examples:**

*   Add a single component:
    ```bash
    dui add dbutton
    ```
*   Add multiple components:
    ```bash
    dui add dbutton dinput
    ```
*   Add a component from a nested path:
    ```bash
    dui add form/dinput
    ```

The command will copy the specified component(s) into your `src/components` directory. If a component is not found in the templates, it will log an error and continue with other components.

**Important:** Remember to ensure Tailwind CSS (if used) is configured to scan your new component files (e.g., in `tailwind.config.js`).

## Example Workflow

1.  **Initialize your PawaJS project with Dui setup:**
    ```bash
    dui init
    ```
2.  **Add a Dui button component:**
    ```bash
    dui add dbutton
    ```
3.  **Use the component in your PawaJS application:**
    ```html
    <!-- src/index.html or similar -->
    <d-button on-click="myFunction()">Click Me</d-button>
    ```
    ```javascript
    // src/main.js or similar
    import { RegisterComponent } from 'pawajs';
    import { Dbutton } from './components/dbutton.js';

    RegisterComponent(Dbutton);

    // ... your PawaJS app setup
    ```

## Contributing

Contributions are welcome! If you have suggestions for new features, bug reports, or want to improve the CLI, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
