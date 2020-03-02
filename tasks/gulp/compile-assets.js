"use strict";

const gulp = require("gulp");
const configPaths = require("../../config/paths.json");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const gulpif = require("gulp-if");
const terser = require("gulp-terser");
const babel = require('gulp-babel');
const eol = require("gulp-eol");
const rename = require("gulp-rename");
const cssnano = require("cssnano");
const webpack = require("webpack-stream");
const named = require("vinyl-named-with-path");
const postcsspseudoclasses = require("postcss-pseudo-classes")({
  // Work around a bug in pseudo classes plugin that badly transforms
  // :not(:whatever) pseudo selectors
  blacklist: [
    ":not(",
    ":disabled)",
    ":last-child)",
    ":focus)",
    ":active)",
    ":hover)"
  ]
});

// Compile CSS and JS task --------------
// --------------------------------------

// Set this to false to help with debugging, set to true for production
const isDist = false;

const errorHandler = function(error) {
  // Log the error to the console
  console.error(error.message);

  // Ensure the task we're running exits with an error code
  this.once("finish", () => process.exit(1));
  this.emit("end");
};
// different entry points for both streams below and depending on destination flag
const compileStyleshet = configPaths.src + "scss/all.scss";

gulp.task("scss:compile", () => {
  const compile = gulp
    .src(compileStyleshet)
    .pipe(plumber(errorHandler))
    .pipe(sass())
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([autoprefixer, cssnano])))
    .pipe(
      rename({
        basename: "lbh-webmap",
        extname: ".min.css"
      })
    )
    .pipe(gulp.dest("dist/"));

  return compile;
});

// Compile js task for preview ----------
// --------------------------------------
gulp.task("js:compile", () => {
  // for dist/ folder we only want compiled 'all.js' file
  // const srcFiles = isDist ? configPaths.src + 'all.js' : configPaths.src + '**/*.js'
  const srcFiles = configPaths.src + "/js/main.js";
  return gulp
    .src([srcFiles, "!" + configPaths.src + "**/*.test.js"])
    .pipe(babel({presets: [["@babel/preset-env"]]}))
    .pipe(named())
    .pipe(
      webpack({
        mode: isDist ? "production" : "development",
        output: {
          library: "LBHWebmap",
          libraryTarget: "umd"
        }
      })
    )
    .pipe(
      gulpif(
        isDist,
        terser()
      )
    )
    .pipe(
      rename({
        basename: "lbh-webmap",
        extname: ".min.js"
      })
    )
    .pipe(eol())
    .pipe(gulp.dest("dist/"));
});
