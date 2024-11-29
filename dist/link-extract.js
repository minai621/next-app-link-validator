"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// .next/server에서 모든 href 추출
const extractHrefs = (folderPath) => {
    const files = fs_1.default.readdirSync(folderPath, { withFileTypes: true });
    let hrefs = [];
    files.forEach((file) => {
        const filePath = path_1.default.join(folderPath, file.name);
        if (file.isFile()) {
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            // 정규식으로 href 속성 추출
            const matches = [...content.matchAll(/href:\s*['"`](.*?)['"`]/g)];
            matches.forEach((match) => {
                if (match[1])
                    hrefs.push(match[1]);
            });
        }
        else if (file.isDirectory()) {
            // 하위 디렉토리 탐색
            hrefs = hrefs.concat(extractHrefs(filePath));
        }
    });
    return hrefs;
};
// 필터링 로직 추가
const filterHrefs = (hrefs) => {
    return hrefs.filter((href) => {
        // 동적 URL 제외
        if (href.includes("${"))
            return false;
        // 특정 URL 제외
        if (href === "https://cdn.ampproject.org/v0.js")
            return false;
        // 유효한 URL만 포함
        return true;
    });
};
// 실행
const projectRoot = process.cwd();
const serverFolder = path_1.default.join(projectRoot, "test-next/.next/server");
const extractedHrefs = extractHrefs(serverFolder);
// 필터링 적용
const filteredHrefs = filterHrefs(extractedHrefs);
// 중복 제거
const uniqueHrefs = Array.from(new Set(filteredHrefs));
console.log(uniqueHrefs);
