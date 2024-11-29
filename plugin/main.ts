import * as core from '@actions/core';
import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { filterHrefs } from './filterHrefs';
import { extractHrefs } from './hrefExtract';
import { runCommand, waitForServer } from './runCommand';
import { validateUrls, ValidationResult } from './validateUrls';

async function run() {
    let serverProcess: ChildProcess | null = null;
    try {
        const baseUrl = core.getInput('base_url', { required: true });
        const startCommand = core.getInput('start_command', { required: true });
        const workingDir = core.getInput('working_dir', { required: true });

        if (!baseUrl || !startCommand || !workingDir) {
            core.setFailed('base_url, start_command, and working_dir inputs are required.');
            return;
        }

        console.log(`Installing dependencies in ${workingDir}`);
        await runCommand(`pnpm install`, workingDir);
        console.log(`Building Next.js application in ${workingDir}`);
        await runCommand(`pnpm run build`, workingDir);

        const serverFolder = path.join(workingDir, '.next/server');
        console.log("Extracting hrefs from the application...");
        const hrefs = extractHrefs(serverFolder);
        const filteredHrefs = filterHrefs(hrefs);

        console.log("Filtered Hrefs:", filteredHrefs);

        if (filteredHrefs.length === 0) {
            console.log("No hrefs found to validate.");
            return;
        }

        console.log("Starting Next.js server...");
        serverProcess = spawnProcess(startCommand, workingDir);

        await waitForServer(baseUrl, 30000);

        console.log("Validating URLs...");
        const validationResults: ValidationResult[] = await validateUrls(filteredHrefs, baseUrl);

        core.info(`Validation Results: ${JSON.stringify(validationResults, null, 2)}`);

        const invalidUrls = validationResults.filter(result => !result.isValid);
        if (invalidUrls.length > 0) {
            core.setFailed(`Invalid URLs found: ${JSON.stringify(invalidUrls, null, 2)}`);
        } else {
            core.info("All URLs are valid!");
        }

        console.log("Stopping server...");
    } catch (error: any) {
        core.setFailed(error.message);
    } finally {
        if (serverProcess) {
            serverProcess.kill();
            console.log("Server process terminated.");
        }
    }
}

function spawnProcess(command: string, cwd: string) {
    const [cmd, ...args] = command.split(" ");
    const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: true });

    child.on('exit', (code, signal) => {
        if (code !== null) {
            console.log(`Server process exited with code ${code}`);
        } else {
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
