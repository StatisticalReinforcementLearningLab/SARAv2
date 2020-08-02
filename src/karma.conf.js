// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

//https://medium.com/@marcozuccaroli/perform-single-tests-using-karma-and-angular-cli-when-tests-slow-down-the-development-of-large-8d6a8013f4fc

// HACK to read additional params and test a single component
const argv = require('minimist')(process.argv.slice(2));
const components = (argv.components !== true) && argv.components;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      components: components,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
