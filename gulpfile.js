"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");

const makePaths = distPath => ({
  dist: distPath,

  static: {
    src: './src/static/**',
    dest: distPath
  },
  
  sass: {
    entry: './src/styles/styles.scss',
    watch: './src/styles/**/*',
    dest: distPath + '/css'
  }
});

const paths = makePaths('./dist');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: { baseDir: paths.dist },
    port: 3000
  });
  done();
}

// Clean assets
const clean = () => del(paths.dist);

// Styles
function processSass() {
  return gulp
    .src(paths.sass.entry)
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(browsersync.stream());
}

// Copy static
function copyStatic() {
  return gulp
    .src(paths.static.src)
    .pipe(gulp.dest(paths.static.dest))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch(paths.static.src, copyStatic);   // Static
  gulp.watch(paths.sass.watch, processSass);  // Sass (styles)
}

// define complex tasks
const build = gulp.series(
  clean,
  gulp.parallel(copyStatic, processSass)
);

const watch = gulp.series(
  build,
  gulp.parallel(watchFiles, browserSync)
);

// export tasks
exports.default = build;
exports.watch = watch;
