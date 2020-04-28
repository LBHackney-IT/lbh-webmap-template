"use strict";

const configPaths = require("../../config/paths.json");
const gulp = require("gulp");
const fs = require("fs");
const gulpif = require("gulp-if");
const rename = require("gulp-rename");
const del = require("del");
const vinylPaths = require("vinyl-paths");

// check for the flag passed by the task

//const isDist = true;
const isDist = false;

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
gulp.task("update-assets-version", () => {
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
