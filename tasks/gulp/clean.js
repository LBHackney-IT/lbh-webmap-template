'use strict'

import  gulp from 'gulp'
import {deleteAsync} from 'del'

// Clean task for a specified folder --------------------
// Removes all old files, except for package.json
// and README in all package
// ------------------------------------------------------

const clean = gulp.task('clean', () => {
  const destination = "dist"

  return deleteAsync([
    `${destination}/**/*`
  ])
})


export default clean;