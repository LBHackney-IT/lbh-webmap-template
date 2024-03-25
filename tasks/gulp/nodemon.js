'use strict'
import  gulp from 'gulp'
import  nodemon from 'nodemon'

// Nodemon task --------------------------
// Restarts node app for changes affecting
// js and json files
// ---------------------------------------
 const nodemonTask = gulp.task('nodemon', () => {
  return nodemon({
    script: 'app/app.js'
  })
})

export default nodemonTask;