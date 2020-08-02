// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// const context = require.context('./', true, /award-dollar.service.spec\.spec\.ts$/);
// And load the modules.
// context.keys().map(context);

// then we find all the tests.
/*
const filterRegExp = (tags) ? new RegExp(tags, 'g') : /\.spec\.ts$/,
context = require.context('./', true, /\.spec\.ts$/),
specFiles = context.keys().filter(path => filterRegExp.test(path));
// and load the modules.
specFiles.map(context);
*/