/**
 * BrowserSync config
 *
 * In order to ensure that BrowserSync works with your site, add your local URL here.
 */
var localUrl = 'http://gust.localhost';
var browsers = [
    "google chrome",
];

/**
 * Required Packages
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminZopfli = require('imagemin-zopfli'),
    imageminMozjpeg = require('imagemin-mozjpeg'), // install with homebrew, run: brew install libpng
    imageminGiflossy = require('imagemin-giflossy'),
    run = require('gulp-run-command').default,
    webpack = require('webpack-stream'),
    tailwindcss = require('tailwindcss'),
    purgecss = require('@fullhuman/postcss-purgecss'),
    browserSync = require('browser-sync').create();


class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}

/**
 * Create the tailwind.config.js file.
 *
 * @since 1.0.0
 */
gulp.task('tailwind:init', run('./node_modules/.bin/tailwind init tailwind.config.js'));

/**
 * Compile Tailwind [DEV]
 *
 * @since 1.0.0
 */
gulp.task('css:compile', function () {
    return gulp.src('./assets/styles/app.scss')
        .pipe(sass())
        .pipe(postcss([
            tailwindcss('./tailwind.config.js')
        ]))
        .pipe(rename({
            extname: '.css'
        }))
        .pipe(gulp.dest('css/'))
        .pipe(notify(
            {
                message: 'Tailwind compiled'
            }
        ));
});

/**
 * Run all CSS tasks [DEV]
 *
 * @since 1.0.0
 */
gulp.task('css', ['css:compile']);

/**
 * Process JS [DEV]
 *
 * @since 1.0.0
 * @version 1.1.0
 * @version 1.1.1: only process js in development, no minifying
 */
gulp.task('js:process', function () {
    return gulp.src('assets/scripts/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream())
        .pipe(notify({message: 'Scripts task complete'}));
});

/**
 * Run all JS tasks [DEV]
 *
 * @since 1.0.0
 * @version 1.1.1: renamed js:minify task to js:process as it's for development only
 */
gulp.task('js', ['js:process']);

/**
 * Compress images
 *
 * @since 1.0.0
 * @version 1.1.0
 * @version 1.1.1: added lossy optimizers and improved settings to make Google Pagespeed happy
 */
gulp.task('images', function () {
    return gulp.src('assets/images/**/*')
        .pipe(cache(imagemin([
            // png
            imageminPngquant({
                speed: 1,
                quality: 60 // lossy settings
            }),
            imageminZopfli({
                more: true,
            }),
            /*
            // gif lossless, much bigger filesize
             imagemin.gifsicle({
                 interlaced: true,
                 optimizationLevel: 3
            }),
            */
            // gif very light lossy, use vs  gifsicle
            imageminGiflossy({
                optimizationLevel: 3,
                optimize: 3, // keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            // svg
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
            /*
            //jpg lossless, much bigger filesize
            imagemin.jpegtran({
                progressive: true
            }),
            */
            // jpg very light lossy, use vs jpegtran
            imageminMozjpeg({
                quality: 50
            })
        ])))
        .pipe(gulp.dest('images'))
        .pipe(notify({message: 'Images compressed'}));
});

/**
 * Default Gulp task
 *
 * @since 1.0.0
 */
gulp.task('default', ['css', 'js']);

/**
 * Dev task
 * This will run while you're building the theme and automatically compile any changes.
 * This includes any html changes you make so that the purgecss file will be updated.
 *
 * @since 1.0.0
 * @version 1.1.0
 */
gulp.task('dev', ['css', 'js'], function () {

    // Configure watch files.
    gulp.watch([
        'layouts/**/*.html',
        'templates/**/*.html',
        'partials/**/*.html',
    ], ['css']).on('change', browserSync.reload);
    gulp.watch('./tailwind.config.js', ['css']).on('change', browserSync.reload);
    gulp.watch('./assets/styles/**/*.scss', ['css']).on('change', browserSync.reload);
    gulp.watch('./assets/scripts/**/*.js', ['js']).on('change', browserSync.reload);

    // Configure BrowserSync to run in dev
    browserSync.init({
        proxy: localUrl,
        browser: browsers,
    });
});

/**
 * CSS Preflight
 * Unfortunately, it isn't possible to pass in parameters to gulp tasks.
 * As such, we need to replicate the code.
 *
 * Compile CSS [PREFLIGHT]
 *
 * @since 1.0.0
 * @version 1.1.1: rename file immediately to .min.css instead of creating an additional .css first
 */
gulp.task('css:compile:preflight', function () {
    return gulp.src('./assets/styles/app.scss')
        .pipe(sass())
        .pipe(postcss([
            tailwindcss('./tailwind.config.js'),
            purgecss({
                content: [
                    'layouts/**/*.html',
                    'templates/**/*.html',
                    'partials/**/*.html',
                ],
                extractors: [
                    {
                        extractor: TailwindExtractor,
                        extensions: ['html', 'js', 'php', 'vue'],
                    }
                ],
                /**
                 * You can whitelist selectors to stop purgecss from removing them from your CSS.
                 * see: https://www.purgecss.com/whitelisting
                 *
                 * Any selectors defined below will not be stripped from the min.css file.
                 * PurgeCSS will not purge the standard app.css file as this is useful for development.
                 *
                 * @since 1.0.0
                 */
                whitelist: [
                    'h2',
                    'h3',
                    'p',
                    'blockquote',
                ],
            })
        ]))
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(gulp.dest('css/'))
        .pipe(notify(
            {
                message: 'Tailwind compiled'
            }
        ));
});

/**
 * Minify the CSS [PREFLIGHT]
 *
 * @since 1.0.0
 * @version 1.1.1: use .min.css file right away instead of renaming and leaving .css in folder
 */
gulp.task('css:minify:preflight', ['css:compile:preflight'], function () {
    return gulp.src('./css/*.min.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())
        .pipe(notify(
            {
                message: 'CSS minified'
            }
        ));
});

/**
 * Minify JS [PREFLIGHT]
 *
 * @since 1.1.1
 * @version 1.1.1
 */
gulp.task('js:minify:preflight', function () {
    return gulp.src('assets/scripts/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream())
        .pipe(notify({message: 'Scripts task complete'}));
});

/**
 * Run all CSS tasks
 *
 * @since 1.0.0
 */
gulp.task('css:preflight', ['css:minify:preflight']);

/**
 * Run all JS tasks
 *
 * @since 1.1.1
 * @version 1.1.1
 */
gulp.task('js:preflight', ['js:minify:preflight']);

/**
 * Preflight task
 * Run this once you're happy with your site and you want to prep the files for production.
 * This will run the CSS and JS functions, as well as pass the CSS through purgecss to remove any unused CSS.
 *
 * Always double check that everything is still working. If something isn't displaying correctly, it may be
 * because you need to add it to the purgeCSS whitelist.
 *
 * @since 1.1.0
 * @version 1.1.1: run js:preflight task
 */
gulp.task('preflight', ['css:preflight', 'js:preflight']);


/**
 * Clear Gulp Cache Manually
 *
 * @since 1.1.1
 * @version 1.1.1
 */
gulp.task('cache:clear', () =>
    cache.clearAll()
);