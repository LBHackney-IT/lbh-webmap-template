"use strict";

import  gulp from 'gulp'
import  configPaths from "../../config/paths.js";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import filter from "gulp-filter";

const scssFiles = filter([configPaths.src + "**/*.scss"], { restore: true });



export const copyFiles = gulp.task("copy-files", () => {
  return gulp
    .src([
      configPaths.src + "**/*",
      "!**/.DS_Store",
      "!**/*.test.js",
      "!" + configPaths.src + "README.md", // Don't override the existing README in /package
      "!" + configPaths.components + "**/__snapshots__/**",
      "!" + configPaths.components + "**/__snapshots__/"
    ])
    .pipe(scssFiles)
    .pipe(postcss([autoprefixer], { syntax: require("postcss-scss") }))
    .pipe(scssFiles.restore)
    .pipe(gulp.dest("dist/"));
});

export const copy3rdParties = gulp.task("copy-3rd-parties", () => {
  return gulp
    .src([
      "node_modules/iframe-resizer/js/iframeResizer.contentWindow.{min.js,map}" // Needed to support iframe auto resizing when embedded
    ])
    .pipe(gulp.dest("dist/"))
  })



