"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceProjectRoots = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const path_1 = tslib_1.__importDefault(require("path"));
function getSourceProjectRoots(target, availableProjects) {
    const projectGraph = (0, devkit_1.readCachedProjectGraph)();
    const nodes = new Set(availableProjects);
    const outNodes = new Set();
    traverseDepsGraph(projectGraph.dependencies, target, nodes, outNodes);
    const projects = Array.from(outNodes);
    const projectRoots = projects.map((project) => projectGraph.nodes[project].data.root);
    const projectJsons = availableProjects
        .filter((project) => !outNodes.has(project))
        .map((project) => projectGraph.nodes[project].data.root)
        .map((projectRoot) => path_1.default.join(projectRoot, 'project.json'));
    return [...projectRoots, ...projectJsons];
}
exports.getSourceProjectRoots = getSourceProjectRoots;
function traverseDepsGraph(allDeps, currentNode, allowedNodes, outNodes) {
    outNodes.add(currentNode);
    const deps = allDeps[currentNode] || [];
    for (const dep of deps) {
        const nextNode = dep.target;
        if (!allowedNodes.has(nextNode))
            continue;
        if (outNodes.has(nextNode))
            continue;
        traverseDepsGraph(allDeps, nextNode, allowedNodes, outNodes);
    }
}
//# sourceMappingURL=getSourceProjectRoots.js.map