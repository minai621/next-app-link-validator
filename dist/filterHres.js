"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHrefs = void 0;
const filterHrefs = (hrefs) => {
    return hrefs.filter((href) => {
        if (href.includes("${"))
            return false;
        if (href === "https://cdn.ampproject.org/v0.js")
            return false;
        return true;
    });
};
exports.filterHrefs = filterHrefs;
