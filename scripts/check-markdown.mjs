import fs from "fs";
import path from "path";

function checkMarkdownFile(filePath) {
  console.log(`\n----------------------------------------`);
  console.log(`Checking file: ${filePath}`);
  const content = fs.readFileSync(filePath, "utf8");

  // Collect headings
  const headings = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^#{1,6}\s+(.+)$/);
    if (match) {
      let title = match[1].trim();
      // Remove inline code
      title = title.replace(/`([^`]+)`/g, "$1");
      // Remove bold/italic
      title = title.replace(/\*\*([^*]+)\*\*/g, "$1");
      title = title.replace(/\*([^*]+)\*/g, "$1");
      // Remove markdown links from title if any
      title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

      // GitHub slugify:
      // In GitHub: characters other than [a-zA-Z0-9 _-] are stripped.
      // Spaces become hyphens. Consecutive spaces become multiple hyphens if not collapsed,
      // but usually GitHub collapses or keeps them depending on stripped punctuation.
      // E.g. "State Management & Persistence":
      // "State Management  Persistence" -> "state-management--persistence"
      // If replaced with "and": "state-management-and-persistence"
      let slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      headings.push({ title: match[1], slug });
    }
  }

  const slugSet = new Set(headings.map((h) => h.slug));

  // Find all markdown links: [text](<url>) or [text](url)
  // We match [text](...) carefully accounting for <...> syntax
  const linkRegex = /\[([^\]]+)\]\((<[^>]+>|[^)\s]+)\)/g;
  let match;
  const issues = [];

  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1];
    let target = match[2].trim();
    if (target.startsWith("<") && target.endsWith(">")) {
      target = target.slice(1, -1);
    }

    // Skip external links or placeholders
    if (
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:") ||
      target.includes("TODO(")
    ) {
      continue;
    }

    if (target.startsWith("#")) {
      const anchor = target.slice(1);
      if (!slugSet.has(anchor)) {
        issues.push({
          type: "broken-anchor",
          text,
          target,
          anchor,
          suggested: headings.find((h) => h.slug.includes(anchor) || anchor.includes(h.slug))?.slug,
        });
      }
    } else {
      const [relPath, anchor] = target.split("#");
      const absPath = path.resolve(path.dirname(filePath), relPath);
      if (!fs.existsSync(absPath)) {
        issues.push({
          type: "missing-file",
          text,
          target,
          absPath,
        });
      }
    }
  }

  console.log(`Total headings: ${headings.length}`);
  console.log(`Issues found: ${issues.length}`);
  if (issues.length > 0) {
    console.error(JSON.stringify(issues, null, 2));
    return false;
  }
  return true;
}

const files = [
  "README.md",
  "CONTRIBUTING.md",
  "docs/ARCHITECTURE.md",
  "docs/REQUIREMENTS_TRACEABILITY.md",
];

let allPassed = true;
for (const file of files) {
  if (fs.existsSync(file)) {
    const passed = checkMarkdownFile(file);
    if (!passed) allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log("\nAll markdown files, anchors, and file references verified successfully!");
}
