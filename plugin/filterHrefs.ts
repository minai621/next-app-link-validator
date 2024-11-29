export const filterHrefs = (hrefs: string[]): string[] => {
  return hrefs.filter((href) => {
      if (href.includes("${")) return false;

      // 특정 외부 URL 제외
      if (href === "https://cdn.ampproject.org/v0.js") return false;

      return true;
  });
};
