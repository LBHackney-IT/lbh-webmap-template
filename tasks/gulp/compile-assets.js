"use strict";

import gulp from 'gulp';
import exec from "gulp-exec"
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
import GulpUglify from 'gulp-uglify';
import  eol from "gulp-eol";
import  rename from "gulp-rename";
import  cssnano from "cssnano";
import  webpack from "webpack-stream";
import  named from "vinyl-named-with-path";
import  plugin from "postcss-pseudo-classes"
import {pipeline} from 'readable-stream'
import concat from 'gulp-concat'

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
  
    return gulp.src(compileStylesheet)
    .pipe(plumber(errorHandler))
    .pipe(sassCompiler()) //@FIXME
    // minify css add vendor prefixes and normalize to compiled css
    .pipe( postcss([autoprefixer, cssnano]))
    .pipe(
      rename({
        basename: "lbh-webmap",
        extname: ".min.css"
      })
    )
    .pipe(gulp.dest("dist/"));

    
});

// Compile js task for preview ----------
// --------------------------------------
export const jsCompile = gulp.task("js:compile", () => {
  return gulp.src("src/js/map/*js")
        .pipe(exec("npx webpack --config webpack.config.js"))
        .pipe(exec.reporter())
});

