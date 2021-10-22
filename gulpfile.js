"use strict";
var gulp = require("gulp"),
    del = require("del"),
    sass = require('gulp-sass')(require('sass')),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    jsmin = require("gulp-terser"),
    runSequence = require('gulp4-run-sequence'),
    bundleconfig = require("./bundleconfig.json"),
    imagemin = require('gulp-imagemin'),
	merge = require("merge-stream");


/* Gulp to convert all scss to css*/
gulp.task('sass-to-css', async function () {
    return gulp.src('./wwwroot/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./wwwroot/css'));
});


/* Bundling JS and CSS minification*/
const regex = { css: /\.css$/, js: /\.js$/ };
gulp.task('bundle-min', async function () {
    runSequence("min:js", "min:css");
});

/* Gulp to minify JS files */
gulp.task("min:js", function () {
    var tasks = getBundles(regex.js).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: ".", allowEmpty: true })
            .pipe(concat(bundle.outputFileName))
            .pipe(jsmin())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

/* Gulp to minify CSS files */
gulp.task("min:css", function () {
    var tasks = getBundles(regex.css).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: ".", allowEmpty: true })
            .pipe(concat(bundle.outputFileName))
            .pipe(cssmin())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}


/* Clean bundling files*/
gulp.task("clean-bundle", function () {
    var files = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });
    return del(files);
});


/* Bundling JS and CSS minification*/
gulp.task('image-min', async function () {
    gulp.src('./wwwroot/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./wwwroot/dist/images'));
});

