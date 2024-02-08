"use strict";

import  gulp from 'gulp';
import configPaths  from "../../config/paths.js";
import  plumber from "gulp-plumber";
import sass from 'gulp-sass'
import * as sassPackage from 'sass'
const sassCompiler = sass(sassPackage)
import  postcss from "gulp-postcss";
import  autoprefixer from "autoprefixer";
import  gulpif from "gulp-if";
import  terser from "gulp-terser";
import  babel from 'gulp-babel';
import  eol from "gulp-eol";
import  rename from "gulp-rename";
import  cssnano from "cssnano";
import  webpack from "webpack-stream";
import  named from "vinyl-named-with-path";
import  plugin from "postcss-pseudo-classes"
plugin({
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
const isDist = true;

const errorHandler = function(error) {
  // Log the error to the console
  console.error(error.message);

  // Ensure the task we're running exits with an error code
  this.once("finish", () => process.exit(1));
  this.emit("end");
};
// different entry points for both streams below and depending on destination flag
const compileStylesheet = configPaths.src + "scss/all.scss";






export const scssComplile  = gulp.task("scss:compile", () => {
  // const compile = gulp
  //   .src(compileStylesheet)
  //   .pipe(plumber(errorHandler))
  //   .pipe(sassCompiler()) //@FIXME
  //   // minify css add vendor prefixes and normalize to compiled css
  //   .pipe(gulpif(isDist, postcss([autoprefixer, cssnano])))
  //   .pipe(
  //     rename({
  //       basename: "lbh-webmap",
  //       extname: ".min.css"
  //     })
  //   )
  //   .pipe(gulp.dest("dist/"));

  // return compile;
  console.log('scss compile skipped')
});

// Compile js task for preview ----------
// --------------------------------------
export const jsCompile = gulp.task("js:compile", () => {
  // for dist/ folder we only want compiled 'all.js' file
  // const srcFiles = isDist ? configPaths.src + 'all.js' : configPaths.src + '**/*.js'
  const srcFiles = configPaths.src + "/js/main.js";
  return gulp
    .src([srcFiles, "!" + configPaths.src + "**/*.test.js"])
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
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
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

