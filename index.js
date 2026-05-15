#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { red, green, yellow, blue } from 'kolorist';

const program = new Command();

program
  .name('dui')
  .description('CLI to add Dui components to your PawaJS project')
  .version('0.1.0');

// Helper to find all available components in templates recursively
async function getAvailableComponents(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let list = [];
  for (const entry of entries) {
    const relPath = base ? path.join(base, entry.name) : entry.name;
    if (entry.isDirectory()) {
      list = list.concat(await getAvailableComponents(path.join(dir, entry.name), relPath));
    } else if (entry.name.endsWith('.js') && entry.name !== 'utils.js') {
      list.push(relPath.replace(/\.js$/, '').replace(/\\/g, '/'));
    }
  }
  return list;
}

program
  .command('list')
  .description('List all available Dui components')
  .action(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const cliDir = path.dirname(__filename);
    const templatesDir = path.join(cliDir, 'templates', 'components');
    
    const available = await getAvailableComponents(templatesDir);
    console.log(blue('\nAvailable Dui components:'));
    available.forEach(c => console.log(green(` - ${c}`)));
    console.log(yellow('\nUse "dui add <name>" to install any of these.\n'));
  });

program
  .command('init')
  .description('Initialize Dui components setup in your project (creates src/components, adds utils.js, dprovider.js, and style.css)')
  .action(async () => {
    console.log(blue('Initializing Dui setup...'));

    const projectRoot = process.cwd();
    const srcDir = path.join(projectRoot, 'src');
    const componentsDir = path.join(srcDir, 'components');
    const assetsDir = path.join(srcDir, 'assets');
    const duiCssPath = path.join(assetsDir, 'style.css');
    const utilsJsPath = path.join(componentsDir, 'utils.js');

    const __filename = fileURLToPath(import.meta.url);
    const cliDir = path.dirname(__filename);
    const templatesDir = path.join(cliDir, 'templates');
    const utilsSource = path.join(templatesDir, 'components', 'utils.js');
    const dproviderSource = path.join(templatesDir, 'components', 'dprovider.js');
    const duiCssSource = path.join(templatesDir, 'assets', 'style.css');

    try {
      // 1. Ensure src/components directory exists
      await fs.ensureDir(componentsDir);
      console.log(green(`Created directory: ${path.relative(projectRoot, componentsDir)}`));

      // 2. Ensure src/assets directory exists
      await fs.ensureDir(assetsDir);
      console.log(green(`Created directory: ${path.relative(projectRoot, assetsDir)}`));

      // 3. Copy utils.js
      if (!await fs.pathExists(utilsJsPath)) {
        await fs.copy(utilsSource, utilsJsPath);
        console.log(green(`Added ${path.relative(projectRoot, utilsJsPath)}`));
      } else {
        console.log(yellow(`${path.relative(projectRoot, utilsJsPath)} already exists. Skipping.`));
      }

      // 4. Copy dprovider.js
      const dproviderTargetPath = path.join(componentsDir, 'dprovider.js');
      if (!await fs.pathExists(dproviderTargetPath)) {
        await fs.copy(dproviderSource, dproviderTargetPath);
        console.log(green(`Added ${path.relative(projectRoot, dproviderTargetPath)}`));
      } else {
        console.log(yellow(`${path.relative(projectRoot, dproviderTargetPath)} already exists. Skipping.`));
      }
      // 4. Copy style.css
      if (!await fs.pathExists(duiCssPath)) {
        await fs.copy(duiCssSource, duiCssPath);
        console.log(green(`Added ${path.relative(projectRoot, duiCssPath)}`));
        console.log(yellow(`\nDon't forget to import your Dui CSS in your main entry file (e.g., src/main.js or index.html):`));
        console.log(yellow(`  import './assets/style.css';`));
      } else {
        console.log(yellow(`${path.relative(projectRoot, duiCssPath)} already exists. Skipping.`));
      }

      console.log(green('\nDui setup initialized successfully!'));

    } catch (error) {
      console.error(red(`Failed to initialize Dui setup:`), error);
      process.exit(1);
    }
  });

program
  .command('add <component-paths...>')
  .description('Add a Dui component to your project (e.g., dbutton or form/dinput)')
  .action(async (componentPaths) => {
    for (const componentPath of componentPaths) {
      console.log(blue(`Adding component: ${componentPath}...`));

      const componentsDir = path.join(process.cwd(), 'src', 'components');
      const componentFileName = `${componentPath.replace(/\//g, path.sep)}.js`;
      const targetFilePath = path.join(componentsDir, componentFileName);

      // Resolve the path to the CLI's own directory
      const __filename = fileURLToPath(import.meta.url);
      const cliDir = path.dirname(__filename);
      const templatesDir = path.join(cliDir, 'templates', 'components');
      const sourceComponentPath = path.join(templatesDir, componentFileName);

      try {
        // 1. Check if component exists in CLI's templates
        if (!await fs.pathExists(sourceComponentPath)) {
          console.error(red(`Error: Component '${componentPath}' not found in Dui templates.`));
          const available = await getAvailableComponents(templatesDir);
          console.log(yellow('\nAvailable components:'));
          available.forEach(c => console.log(` - ${c}`));
          // Continue to the next component if one is not found, instead of exiting
          continue;
        }

        // 2. Copy component file (fs-extra creates parent subdirectories automatically)
        await fs.copy(sourceComponentPath, targetFilePath);
        console.log(green(`Successfully added ${componentPath} to ${targetFilePath}`));
        console.log(yellow('some components uses other components context, so you need to add them to your project'));
        // 3. Ensure utils.js exists in src/components/ (common dependency for many Dui components)
        const utilsSource = path.join(templatesDir, 'utils.js');
        const utilsTarget = path.join(componentsDir, 'utils.js');
        if (await fs.pathExists(utilsSource) && !await fs.pathExists(utilsTarget)) {
          await fs.copy(utilsSource, utilsTarget);
          console.log(yellow('Added required utils.js to src/components/'));
        }

        // 5. Tailwind CSS integration reminder (conceptual)
        console.log(yellow('Remember to ensure Tailwind CSS is configured to scan your new component files (e.g., in tailwind.config.js).'));

      } catch (error) {
        console.error(red(`Failed to add component ${componentPath}:`), error);
        // Continue to the next component even if one fails
      }
    }
  });

program.parse(process.argv);