"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUrls = void 0;
const exec_1 = require("@actions/exec");
const validateUrls = async (urls, baseUrl) => {
    const results = [];
    for (const url of urls) {
        const targetUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;
        try {
            const { stdout } = await execCommand(`curl -o /dev/null -s -w "%{http_code}" "${targetUrl}"`);
            const status = parseInt(stdout.trim(), 10);
            const isValid = status >= 200 && status < 400;
            results.push({ url: targetUrl, status, isValid });
        }
        catch (error) {
            console.error(`Error fetching ${targetUrl}:`, error);
            results.push({ url: targetUrl, status: 500, isValid: false });
        }
    }
    return results;
};
exports.validateUrls = validateUrls;
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
            resolve({ stdout, stderr });
        })
            .catch((error) => {
            reject(error);
        });
    });
};
