"use strict";
import  gulp from 'gulp'
import  configPaths from "../../config/paths.js";

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
const watchTask = gulp.task("watch", () => {
  gulp.watch(
    [configPaths.src + "**/**/*.scss"],
    gulp.parallel("styles", "sassdoc")
  );
  gulp.watch([configPaths.src + "**/**/*.js"], gulp.task("scripts"));
});


export default watchTask