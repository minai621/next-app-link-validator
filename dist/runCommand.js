"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForServer = exports.runCommand = void 0;
const exec_1 = require("@actions/exec");
const child_process_1 = require("child_process");
const runCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(" ");
        const child = (0, child_process_1.spawn)(cmd, args, { cwd, stdio: "inherit", shell: true });
        child.on("error", (err) => {
            reject(err);
        });
        child.on("exit", (code) => {
            if (code !== 0) {
                reject(new Error(`Command "${command}" exited with code ${code}`));
            }
            else {
                resolve();
            }
        });
    });
};
exports.runCommand = runCommand;
const waitForServer = async (url, timeout = 30000) => {
    const interval = 2000;
    const maxAttempts = Math.ceil(timeout / interval);
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            await execCommand(`curl -o /dev/null -s -w "%{http_code}" "${url}"`);
            console.log("Server is up and running.");
            return;
        }
        catch (error) {
            console.log("Waiting for server to start...");
            await delay(interval);
            attempt++;
        }
    }
    throw new Error(`Server did not start within ${timeout / 1000} seconds.`);
};
exports.waitForServer = waitForServer;
const execCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const options = {
            listeners: {
                stdout: (data) => {
                    stdout += data.toString();
                },
                stderr: (data) => {
                    stderr += data.toString();
                }
            }
        };
        (0, exec_1.exec)(cmd, [], options)
            .then(() => {
            const status = parseInt(stdout.trim(), 10);
            if (status >= 200 && status < 400) {
                resolve();
            }
            else {
                reject(new Error(`Status code: ${status}`));
            }
        })
            .catch((error) => {
            reject(error);
        });
    });
};
const delay = (ms) => new Promise(res => setTimeout(res, ms));
