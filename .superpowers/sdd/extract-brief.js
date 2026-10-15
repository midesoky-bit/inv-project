const fs = require("fs");
const path = require("path");
const n = process.argv[2];
if (!n) {
  console.error("usage: node extract-brief.js N");
  process.exit(2);
}
const plan = fs.readFileSync(
  "docs/superpowers/plans/2026-10-15-inventure-communications-website.md",
  "utf8",
);
const lines = plan.split(/\r?\n/);
let infence = false;
let intask = false;
const out = [];
const re = new RegExp("^#+[ \\t]+Task[ \\t]+" + n + "([^0-9]|$)");
const any = /^#+[ \t]+Task[ \t]+[0-9]+/;
for (const line of lines) {
  if (/^```/.test(line)) infence = !infence;
  if (!infence && any.test(line)) intask = re.test(line);
  if (intask) out.push(line);
}
const file = path.join(".superpowers/sdd", "task-" + n + "-brief.md");
fs.writeFileSync(file, out.join("\n") + "\n");
if (!out.length) {
  console.error("task not found");
  process.exit(3);
}
console.log("wrote " + file + ": " + out.length + " lines");
