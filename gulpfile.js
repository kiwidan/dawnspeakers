var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');

var cssDest = './css';
var sassSource = './sass/**/*.scss';

gulp.task('styles', function() {
    return gulp.src(sassSource)
               .pipe(sass({ errLogToConsole: true }))
               .pipe(autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
               .pipe(gulp.dest(cssDest))
               .pipe(rename({ suffix: '.min' }))
               .pipe(minifycss())
               .pipe(gulp.dest(cssDest));
});

gulp.task('watch', function() {
    return gulp.watch([sassSource], ['styles']);
});

gulp.task('default', ['styles']);
