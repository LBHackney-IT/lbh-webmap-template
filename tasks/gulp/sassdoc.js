import  sassdoc from 'sassdoc'
import  gulp from 'gulp'
import  paths from "../../config/paths.js";

const sassdocTask  = gulp.task('sassdoc', function () {
  return gulp.src([paths.src + '**/**/*.scss', `!${paths.src}/vendor/*`])
    .pipe(sassdoc({
      dest: paths.sassdoc,
      groups: {
        'settings/assets': 'Settings / Assets',
        'settings/colours': 'Settings / Colours',
        'settings/compatibility': 'Settings / Compatibility',
        'settings/global-styles': 'Settings / Global Styles',
        'settings/ie8': 'Settings / IE8',
        'settings/measurements': 'Settings / Measurements',
        'settings/media-queries': 'Settings / Media Queries',
        'settings/spacing': 'Settings / Spacing',
        'settings/typography': 'Settings / Typography',
        tools: 'Tools',
        helpers: 'Helpers',
        overrides: 'Overrides'
      }
    }))
    .resume()
})


export default sassdocTask;