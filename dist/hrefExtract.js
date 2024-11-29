"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractHrefs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const extractHrefs = (folderPath) => {
    const files = fs_1.default.readdirSync(folderPath, { withFileTypes: true });
    let hrefs = [];
    files.forEach((file) => {
        const filePath = path_1.default.join(folderPath, file.name);
        if (file.isFile()) {
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            const regex = /href:\s*['"`](.*?)['"`]/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                if (match[1])
                    hrefs.push(match[1]);
            }
        }
        else if (file.isDirectory()) {
            hrefs = hrefs.concat((0, exports.extractHrefs)(filePath));
        }
    });
    return hrefs;
};
exports.extractHrefs = extractHrefs;
