const gulp = require('gulp');
const stripDebug = require('gulp-strip-debug');

gulp.task('default', () =>
    gulp.src('./dist/**/**.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('dist'))
);
