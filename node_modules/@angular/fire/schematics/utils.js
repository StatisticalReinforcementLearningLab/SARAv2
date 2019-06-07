"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function listProjects() {
    const firebase = require('firebase-tools');
    return firebase.list().catch(() => firebase.login().then(() => firebase.list()));
}
exports.listProjects = listProjects;
const isProject = (elem) => {
    return elem.original === undefined;
};
const ɵ0 = isProject;
exports.ɵ0 = ɵ0;
const searchProjects = (projects) => {
    return (_, input) => {
        return Promise.resolve(require('fuzzy')
            .filter(input, projects, {
            extract(el) {
                return `${el.id} ${el.name} ${el.permission}`;
            }
        })
            .map((result) => {
            let original;
            if (isProject(result)) {
                original = result;
            }
            else {
                original = result.original;
            }
            return {
                name: `${original.id} (${original.name})`,
                title: original.name,
                value: original.id
            };
        }));
    };
};
const ɵ1 = searchProjects;
exports.ɵ1 = ɵ1;
exports.projectPrompt = (projects) => {
    const inquirer = require('inquirer');
    inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));
    return inquirer.prompt({
        type: "autocomplete",
        name: "firebaseProject",
        source: searchProjects(projects),
        message: "Please select a project:"
    });
};
function getFirebaseProjectName(projectRoot, target) {
    const { targets } = JSON.parse(fs_1.readFileSync(path_1.join(projectRoot, ".firebaserc"), "UTF-8"));
    const projects = Object.keys(targets);
    return projects.find(project => !!Object.keys(targets[project].hosting).find(t => t === target));
}
exports.getFirebaseProjectName = getFirebaseProjectName;
//# sourceMappingURL=utils.js.map