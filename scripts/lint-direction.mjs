import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const PATTERN =
  /\b(ml|mr|pl|pr|left|right|text-left|text-right|border-l|border-r)-/g;
const EXT = new Set([".ts", ".tsx", ".css"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (EXT.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const files = await walk(ROOT);
const violations = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (PATTERN.test(line)) {
      violations.push(`${path.relative(process.cwd(), file)}:${index + 1}:${line.trim()}`);
    }
    PATTERN.lastIndex = 0;
  });
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("lint:direction OK — no physical direction utilities in src/");
