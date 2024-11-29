import { exec } from '@actions/exec';
import { spawn } from "child_process";

export const runCommand = (command: string, cwd: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(" ");
        const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: true });

        child.on("error", (err) => {
            reject(err);
        });

        child.on("exit", (code) => {
            if (code !== 0) {
                reject(new Error(`Command "${command}" exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
};

export const waitForServer = async (url: string, timeout: number = 30000): Promise<void> => {
    const interval = 2000; 
    const maxAttempts = Math.ceil(timeout / interval);
    let attempt = 0;

    while (attempt < maxAttempts) {
        try {
            await execCommand(`curl -o /dev/null -s -w "%{http_code}" "${url}"`);
            console.log("Server is up and running.");
            return;
        } catch (error) {
            console.log("Waiting for server to start...");
            await delay(interval);
            attempt++;
        }
    }

    throw new Error(`Server did not start within ${timeout / 1000} seconds.`);
};

const execCommand = (cmd: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        const options = {
            listeners: {
                stdout: (data: Buffer) => {
                    stdout += data.toString();
                },
                stderr: (data: Buffer) => {
                    stderr += data.toString();
                }
            }
        };

        exec(cmd, [], options)
            .then(() => {
                const status = parseInt(stdout.trim(), 10);
                if (status >= 200 && status < 400) {
                    resolve();
                } else {
                    reject(new Error(`Status code: ${status}`));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
