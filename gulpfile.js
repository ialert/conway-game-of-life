const gulp = require('gulp'),
    browserify = require('browserify'),
    rename = require('gulp-rename'),
    es = require('event-stream'),
    minifyCss = require('gulp-minify-css'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    environments = require('gulp-environments');

const SRC_DIR = "src/";
const BUILD_DIR = "build/";

gulp.task('build', ['html', 'css', 'js', 'images']);

gulp.task('html', function() {

    return gulp.src(SRC_DIR + "/*.html")
        .pipe(gulp.dest(BUILD_DIR));
});


gulp.task('css', function() {

    const userFiles = [
        SRC_DIR + '/css/main.css',
    ];

    const tasks = userFiles.map(function(entry) {

        return gulp.src(entry)
            .pipe(minifyCss())
            .pipe(rename({
                dirname: '',
                extname: '.min.css',
            }))
            .pipe(gulp.dest(BUILD_DIR + '/css'));
    });

    return es.merge.apply(null, tasks);

});

gulp.task('img', function() {

    var userFiles = [SRC_DIR + '/img/**/*.*'];

    return gulp.src(userFiles)
        .pipe(gulp.dest(BUILD_DIR + '/img/'));
});

gulp.task('js', function() {

    const userFiles = [
        SRC_DIR + '/js/main.js',
    ];

    const tasks = userFiles.map(function(entry) {

        return browserify(entry, {
                debug: environments.development(),
                paths: ['./node_modules', SRC_DIR],
            })
            .transform("babelify", {
                presets: ["babel-preset-es2015"],
            })
            .transform("uglifyify")
            .bundle()
            .pipe(source(entry))
            .pipe(rename({
                dirname: '',
                extname: '.min.js',
            }))
            .pipe(gulp.dest(BUILD_DIR + '/js/'));
    });

    return es.merge.apply(null, tasks);
});


gulp.task('watch', function() {

    gulp.watch(SRC_DIR + '/*.html', ['html']);
    gulp.watch(SRC_DIR + '/css/**/*.css', ['css']);
    gulp.watch(SRC_DIR + '/js/**/*.js', ['js']);
    gulp.watch(SRC_DIR + '/img/**/*.*', ['img']);

});

gulp.task('build', ['css', 'js', 'img']);

gulp.task('default', ['build', 'watch']);