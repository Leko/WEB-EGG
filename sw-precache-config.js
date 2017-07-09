/**
 * https://github.com/GoogleChrome/sw-precache#command-line-interface
 */
module.exports = {
  root: 'build',
  staticFileGlobs: [
    'build/javascripts/main.js',
    'build/stylesheets/**.css',
    'build/images/**/*.*',
  ],
  stripPrefix: 'build/'
}
