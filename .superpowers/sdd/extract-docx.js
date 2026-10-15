const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const docx = String.raw`d:\Projects\Inventure Communications.docx`;
if (!fs.existsSync(docx)) {
  console.error("MISSING", docx);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "docx-"));
const zip = path.join(tmp, "doc.zip");
const outDir = path.join(tmp, "out");
fs.copyFileSync(docx, zip);
fs.mkdirSync(outDir, { recursive: true });

execFileSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    `Expand-Archive -LiteralPath '${zip.replace(/'/g, "''")}' -DestinationPath '${outDir.replace(/'/g, "''")}' -Force`,
  ],
  { stdio: "inherit" },
);

const xmlPath = path.join(outDir, "word", "document.xml");
const xml = fs.readFileSync(xmlPath, "utf8");
const text = xml
  .replace(/<w:tab\/>/g, "\t")
  .replace(/<w:br\/>/g, "\n")
  .replace(/<\/w:p>/g, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const dest = path.join(
  "D:",
  "Projects",
  "inv-project",
  ".superpowers",
  "sdd",
  "inventure-profile.txt",
);
fs.writeFileSync(dest, text, "utf8");
console.log("wrote", dest, "chars", text.length);
console.log("---");
console.log(text);
