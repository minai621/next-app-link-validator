import fs from "fs";
import path from "path";

export const extractHrefs = (folderPath: string): string[] => {
    const files = fs.readdirSync(folderPath, { withFileTypes: true });
    let hrefs: string[] = [];

    files.forEach((file) => {
        const filePath = path.join(folderPath, file.name);

        if (file.isFile()) {
            const content = fs.readFileSync(filePath, "utf-8");
            const regex = /href:\s*['"`](.*?)['"`]/g;
            
            let match;
            while ((match = regex.exec(content)) !== null) {
                if (match[1]) hrefs.push(match[1]);
            }
        } else if (file.isDirectory()) {
            hrefs = hrefs.concat(extractHrefs(filePath));
        }
    });

    return hrefs;
};
