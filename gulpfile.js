/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver');

var webroot = "./app/";

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
};

gulp.task('less', function () {
    return gulp.src(bootstrap.less)
        .pipe(plumber(function (error) {
            gutil.log(gutil.colors.red(error.message));
            gutil.beep();
            this.emit('end');
        }))
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest(bootstrap.lessoutput));
});

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], {base: "."})
        .pipe(rename({suffix: '.min'}))
        //.pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(rename({suffix: '.min'}))
        //.pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task('webserver', function () {
    gulp.src(webroot)
        .pipe(webserver({
            fallback: '/',
            livereload: false,
            port: 7999,
            directoryListing: false,
            open: true
        }));
});

gulp.task('default', function () {
    //gulp.run('min:js');
    gulp.run('webserver');

    gulp.watch('doc/*.md', function () {
        gulp.run('md');
    });
});