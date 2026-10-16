const fs = require('fs');
const path = require('path');
const vm = require('vm');

const utilsSource = fs.readFileSync(path.join(__dirname, '../js/libs/utils.js'), 'utf8');
const interfaceSource = fs.readFileSync(path.join(__dirname, '../js/libs/interface.js'), 'utf8');

/**
 * Loads js/libs/utils.js into a vm context, as it is a browser script that
 * assigns to window
 * @param {Object} [context] - Globals for the context
 * @returns {Object} The context, with window.FlipletInteractiveMapUtils set
 */
function loadUtils(context) {
  context = context || {};
  context.window = context;
  vm.createContext(context);
  vm.runInContext(utilsSource, context);
  context.FlipletInteractiveMapUtils = context.window.FlipletInteractiveMapUtils;

  return context;
}

/**
 * Cuts the method that starts at `marker` (method shorthand, e.g.
 * "saveData(stopComplete, imageSaved) {") out of interface.js by
 * brace-counting, as interface.js needs Fliplet/Vue globals and can't be
 * required here
 * @param {String} marker - The start of the method
 * @returns {String} The method source
 */
function extractMethod(marker) {
  const startIndex = interfaceSource.indexOf(marker);

  if (startIndex === -1) {
    throw new Error(`Could not find ${marker} in interface.js`);
  }

  let depth = 0;

  for (let i = interfaceSource.indexOf('{', startIndex); i < interfaceSource.length; i++) {
    if (interfaceSource[i] === '{') {
      depth++;
    } else if (interfaceSource[i] === '}') {
      depth--;

      if (depth === 0) {
        return interfaceSource.slice(startIndex, i + 1);
      }
    }
  }

  throw new Error(`Could not find the end of ${marker}`);
}

/**
 * Builds an object with the given interface.js methods, run in a context with
 * the real utils and the given globals
 * @param {Object} globals - Globals such as Fliplet and widgetId
 * @param {String[]} markers - Method start markers
 * @returns {Object} An object with the methods; use it as the Vue `this`
 */
function loadMethods(globals, markers) {
  const context = loadUtils(globals);
  const methods = markers.map(extractMethod).join(',\n');

  return vm.runInContext(`({\n${methods}\n})`, context);
}

module.exports = { loadUtils, loadMethods };
