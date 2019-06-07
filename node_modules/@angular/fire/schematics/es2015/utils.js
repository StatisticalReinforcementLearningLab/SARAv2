import { readFileSync } from "fs";
import { join } from "path";
export function listProjects() {
    const firebase = require('firebase-tools');
    return firebase.list().catch(() => firebase.login().then(() => firebase.list()));
}
const isProject = (elem) => {
    return elem.original === undefined;
};
const ɵ0 = isProject;
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
export const projectPrompt = (projects) => {
    const inquirer = require('inquirer');
    inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));
    return inquirer.prompt({
        type: "autocomplete",
        name: "firebaseProject",
        source: searchProjects(projects),
        message: "Please select a project:"
    });
};
export function getFirebaseProjectName(projectRoot, target) {
    const { targets } = JSON.parse(readFileSync(join(projectRoot, ".firebaserc"), "UTF-8"));
    const projects = Object.keys(targets);
    return projects.find(project => !!Object.keys(targets[project].hosting).find(t => t === target));
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=utils.js.map