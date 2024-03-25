"use strict";
import  gulp from 'gulp'
import taskListing from "gulp-task-listing";
import paths from './config/paths.js';

// Gulp sub-tasks
import clean from "./tasks/gulp/clean.js";
import {scssComplile,jsCompile} from "./tasks/gulp/compile-assets.js";
import nodemonTask from "./tasks/gulp/nodemon.js";
import watchTask from "./tasks/gulp/watch.js";
// new tasks
import {copy3rdParties, copyFiles} from "./tasks/gulp/copy-to-destination.js";// fnc
import updateAssetVersion from "./tasks/gulp/asset-version.js";
import sassdocTask from "./tasks/gulp/sassdoc.js";


// Umbrella styles tasks for preview ----
// Runs scss compilation
// --------------------------------------
gulp.task("styles", gulp.series("scss:compile"));

// Umbrella scripts tasks for preview ---
// Runs js compilation
// --------------------------------------
gulp.task("scripts", gulp.series("js:compile"));

// Copy assets task ----------------------
// Copies assets to dist
// --------------------------------------
gulp.task("copy:assets", () => {
  return gulp
    .src(paths.src + "assets/**/*")
    .pipe(gulp.dest("dist/assets/"));
});

// All test combined --------------------
// Runs js, scss and accessibility tests
// --------------------------------------
gulp.task("test", gulp.series("scss:compile"));

// Copy assets task for local & heroku --
// Copies files to dist
// --------------------------------------
gulp.task("copy-assets", gulp.series("styles", "scripts", "copy-3rd-parties"));

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------
gulp.task("serve", gulp.parallel("watch", "nodemon"));

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task("dev", gulp.series("clean", "copy-assets", "sassdoc", "serve"));

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task("build:package", gulp.series("clean", "copy-files", "js:compile"));
gulp.task(
  "build:dist",
  gulp.series("clean", "copy-assets", "copy:assets", "update-assets-version")
);

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
gulp.task("default", taskListing);
