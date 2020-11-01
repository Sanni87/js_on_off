var gulp =require('gulp');
var babel =require('gulp-babel');
var rename = require('gulp-rename');

gulp.task('default', () =>
    gulp.src('src/on_off.js')
        .pipe(babel())
        .pipe(rename('on_off.min.js'))
        .pipe(gulp.dest('dist'))
);
