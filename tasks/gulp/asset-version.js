"use strict";

import  gulp from 'gulp'
import  configPaths from "../../config/paths.js";
import * as fs from 'node:fs';
import gulpif from "gulp-if";
import rename from "gulp-rename";
import * as del from 'del'
import vinylPaths from "vinyl-paths";

// check for the flag passed by the task

const isDist = true;

//const isDist = false;

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
const updateAssetVersion = gulp.task("update-assets-version", () => {
  const pkg = require("../../" + configPaths.package + "package.json");
  fs.writeFileSync(
    "dist/VERSION.txt",
    pkg.version + "\r\n"
  );
  return gulp
    .src([
      "dist/lbh-webmap.min.css",
      "dist/lbh-webmap-ie8.min.css",
      "dist/lbh-webmap.min.js"
    ])
    .pipe(vinylPaths(del))
    .pipe(
      gulpif(
        isDist,
        rename(obj => {
          obj.basename = obj.basename.replace(
            /(lbh.*)(?=\.min)/g,
            "$1-" + pkg.version
          );
          return obj;
        })
      )
    )
    .pipe(gulp.dest("dist/"));
});


export default updateAssetVersion;