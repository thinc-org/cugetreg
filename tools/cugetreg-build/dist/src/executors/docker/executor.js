"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const promises_1 = tslib_1.__importDefault(require("fs/promises"));
const tar_1 = require("tar");
const getSourceProjectRoots_1 = require("../../utils/getSourceProjectRoots");
const excludedPaths = new Set([
    '.git',
    'node_modules',
    'build',
    'apps',
    'dist',
    'libs',
    'tmp',
    'tools',
]);
function dockerExecutor(_options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.info(`Starting build...`);
        const availableProjects = Object.keys(context.workspace.projects);
        const target = context.projectName;
        const targetRoot = context.workspace.projects[target].root;
        const projectRoots = (0, getSourceProjectRoots_1.getSourceProjectRoots)(target, availableProjects);
        const allPaths = yield promises_1.default.readdir(context.root);
        const filteredPaths = allPaths.filter((path) => !excludedPaths.has(path));
        const paths = [...filteredPaths, ...projectRoots];
        const tar = (0, tar_1.create)({ gzip: true }, paths);
        const dockerfile = `${targetRoot}/Dockerfile`;
        yield exec(`docker buildx build --load -f "${dockerfile}" --tag "${context.projectName}:latest" -`, tar);
        return { success: true };
    });
}
exports.default = dockerExecutor;
function exec(command, stdin) {
    console.log(`Running ${command}`);
    return new Promise((resolve, reject) => {
        const child = child_process_1.default.exec(command);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command ${command} exited with code ${code}`));
            }
        });
        stdin === null || stdin === void 0 ? void 0 : stdin.pipe(child.stdin);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    });
}
//# sourceMappingURL=executor.js.map