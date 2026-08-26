import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = path.join(__dirname, "..", "dist");

function renameFile(oldFile, newFile) {
    const oldPath = path.join(distDir, oldFile);
    const newPath = path.join(distDir, newFile);

    if (!fs.existsSync(oldPath)) {
        console.error(`❌ File not found: ${oldPath}`);
        process.exit(1);
    }

    fs.renameSync(oldPath, newPath);

    console.log(`✅ Renamed ${oldFile} → ${newFile}`);
}

function updateTextFile(file, search, replacement) {
    const filePath = path.join(distDir, file);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        // process.exit(1);
    }else{

        let content = fs.readFileSync(filePath, "utf8");
    
        if (!content.includes(search)) {
            console.warn(`⚠️ Could not find "${search}" in ${file}`);
            return;
        }
    
        content = content.replace(search, replacement);
    
        fs.writeFileSync(filePath, content);
    
        console.log(`✅ Updated ${file}`);
    }

}


// --------------------------------------------------
// JavaScript
// --------------------------------------------------

const jsFile = "main.js";
const jsMapFile = "main.js.map";

const newJsFile = "lbh-webmap.min.js";
const newJsMapFile = "lbh-webmap.min.js.map";

// Update sourceMappingURL inside main.js
updateTextFile(
    jsFile,
    "sourceMappingURL=main.js.map",
    `sourceMappingURL=${newJsMapFile}`
);

// Update the "file" property inside main.js.map
const jsMapPath = path.join(distDir, jsMapFile);

if (fs.existsSync(jsMapPath)) {
    const jsMap = JSON.parse(fs.readFileSync(jsMapPath, "utf8"));

    jsMap.file = newJsFile;

    fs.writeFileSync(
        jsMapPath,
        JSON.stringify(jsMap)
    );

    console.log(`✅ Updated ${jsMapFile} file property`);
}

// Rename JS and source map
renameFile(jsFile, newJsFile);
renameFile(jsMapFile, newJsMapFile);


// --------------------------------------------------
// CSS
// --------------------------------------------------

const cssFile = "all.css";
const cssMapFile = "all.css.map";

const newCssFile = "lbh-webmap.min.css";
const newCssMapFile = "lbh-webmap.min.css.map";

// Update sourceMappingURL inside all.css
updateTextFile(
    cssFile,
    "sourceMappingURL=all.css.map",
    `sourceMappingURL=${newCssMapFile}`
);

// Update the "file" property inside all.css.map
const cssMapPath = path.join(distDir, cssMapFile);

if (fs.existsSync(cssMapPath)) {
    const cssMap = JSON.parse(fs.readFileSync(cssMapPath, "utf8"));

    cssMap.file = newCssFile;

    fs.writeFileSync(
        cssMapPath,
        JSON.stringify(cssMap)
    );

    console.log(`✅ Updated ${cssMapFile} file property`);
}

// Rename CSS and source map
renameFile(cssFile, newCssFile);

if (fs.existsSync(cssMapPath)) {
    renameFile(cssMapFile, newCssMapFile);
}
