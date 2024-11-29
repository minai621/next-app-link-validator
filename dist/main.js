"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const filterHrefs_1 = require("./filterHrefs");
const hrefExtract_1 = require("./hrefExtract");
const runCommand_1 = require("./runCommand");
const validateUrls_1 = require("./validateUrls");
async function run() {
    let serverProcess = null;
    try {
        const baseUrl = core.getInput('base_url', { required: true });
        const startCommand = core.getInput('start_command', { required: true });
        const workingDir = core.getInput('working_dir', { required: true });
        if (!baseUrl || !startCommand || !workingDir) {
            core.setFailed('base_url, start_command, and working_dir inputs are required.');
            return;
        }
        console.log(`Installing dependencies in ${workingDir}`);
        await (0, runCommand_1.runCommand)(`pnpm install`, workingDir);
        console.log(`Building Next.js application in ${workingDir}`);
        await (0, runCommand_1.runCommand)(`pnpm run build`, workingDir);
        const serverFolder = path_1.default.join(workingDir, '.next/server');
        console.log("Extracting hrefs from the application...");
        const hrefs = (0, hrefExtract_1.extractHrefs)(serverFolder);
        const filteredHrefs = (0, filterHrefs_1.filterHrefs)(hrefs);
        console.log("Filtered Hrefs:", filteredHrefs);
        if (filteredHrefs.length === 0) {
            console.log("No hrefs found to validate.");
            return;
        }
        console.log("Starting Next.js server...");
        serverProcess = spawnProcess(startCommand, workingDir);
        await (0, runCommand_1.waitForServer)(baseUrl, 30000);
        console.log("Validating URLs...");
        const validationResults = await (0, validateUrls_1.validateUrls)(filteredHrefs, baseUrl);
        core.info(`Validation Results: ${JSON.stringify(validationResults, null, 2)}`);
        const invalidUrls = validationResults.filter(result => !result.isValid);
        if (invalidUrls.length > 0) {
            core.setFailed(`Invalid URLs found: ${JSON.stringify(invalidUrls, null, 2)}`);
        }
        else {
            core.info("All URLs are valid!");
        }
        console.log("Stopping server...");
    }
    catch (error) {
        core.setFailed(error.message);
    }
    finally {
        if (serverProcess) {
            serverProcess.kill();
            console.log("Server process terminated.");
        }
    }
}
function spawnProcess(command, cwd) {
    const [cmd, ...args] = command.split(" ");
    const child = (0, child_process_1.spawn)(cmd, args, { cwd, stdio: "inherit", shell: true });
    child.on('exit', (code, signal) => {
        if (code !== null) {
            console.log(`Server process exited with code ${code}`);
        }
        else {
            console.log(`Server process killed with signal ${signal}`);
        }
    });
    return child;
}
run()
    .then(() => {
    process.exit(0);
})
    .catch(error => {
    core.setFailed(error.message);
    process.exit(1);
});
