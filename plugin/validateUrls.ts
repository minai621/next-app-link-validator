import { exec } from '@actions/exec';

export interface ValidationResult {
    url: string;
    status: number;
    isValid: boolean;
}

export const validateUrls = async (urls: string[], baseUrl: string): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    for (const url of urls) {
        const targetUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;

        try {
            const { stdout } = await execCommand(`curl -o /dev/null -s -w "%{http_code}" "${targetUrl}"`);

            const status = parseInt(stdout.trim(), 10);
            const isValid = status >= 200 && status < 400;

            results.push({ url: targetUrl, status, isValid });
        } catch (error: any) {
            console.error(`Error fetching ${targetUrl}:`, error);
            results.push({ url: targetUrl, status: 500, isValid: false });
        }
    }

    return results;
};

const execCommand = (cmd: string): Promise<{ stdout: string; stderr: string }> => {
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
                resolve({ stdout, stderr });
            })
            .catch((error) => {
                reject(error);
            });
    });
};
