# Utilities

A collection of utilities for my Node.js project.

## How to Install

1. Clone the GitHub repository.
2. Navigate to the project directory in your terminal.
3. Run `yarn install` to install the project dependencies.
4. Use `tsc` to build the package.

## How to Link the Package to Your Project

1. Run `yarn link` in the Utilities project directory and wait until it shows "success".
2. Navigate to your project directory.
3. Run `yarn link utilities` to link this package to your project.

## How to Use the Package

1. Import the package using:
   - CommonJS: `const { Utilities } = require('utilities');`
   - ES6 modules: `import { Utilities } from 'utilities';`
   
2. Set the configuration in your `index.js` file:
   ```js
   new Utilities({
       databaseName: 'DatabaseNameHere',
       databaseLocation: `${__dirname}`,
   })
   ```