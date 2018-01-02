const path = require('path');
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
  const pathToEntry = path.join(process.cwd(), 'src/entry.js');
  console.log('custom webpack settings');
  if(typeof config.entry.bundle === 'string') {
    config.entry.bundle = pathToEntry;
  } else {
    config.entry.bundle[0] = pathToEntry;
  }
}
