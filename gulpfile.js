/**
 * BrowserSync config
 * 
 * In order to ensure that BrowserSync works with your site, add your local URL here.
 */
var localUrl = 'http://gust.localhost';

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
    run = require('gulp-run-command').default,
    webpack = require('webpack-stream'),
    tailwindcss = require('tailwindcss'),
    purgecss = require('@fullhuman/postcss-purgecss');
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
 * Compile Tailwind
 * 
 * @since 1.0.0
 */
gulp.task('css:compile', function() {
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
 * Minify the CSS
 * 
 * @since 1.0.0
 * @version 1.1.0
 */
gulp.task('css:minify', ['css:compile'], function() {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
    .pipe(notify(
        {
            message: 'CSS minified'
        }
    ));
});

/**
 * Run all CSS tasks
 * 
 * @since 1.0.0
 */
gulp.task('css', ['css:minify']);

/**
 * Minify JS
 * 
 * @since 1.0.0
 * @version 1.1.0
 */
gulp.task('js:minify', function() {
    return gulp.src('assets/scripts/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Scripts task complete' }));
});

/**
 * Run all JS tasks
 * 
 * @since 1.0.0
 */
gulp.task('js', ['js:minify']);

/**
 * Compress images
 * 
 * @since 1.0.0
 * @version 1.1.0
 */
gulp.task('images', function() {
    return gulp.src('assets/images/**/*')
    .pipe(cache(imagemin({
        optimisationLevel: 3,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest('images'))
    .pipe(notify({ message: 'Images compressed' }));
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
gulp.task('dev', ['css', 'js'], function() {
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
        proxy: localUrl
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
 */
gulp.task('css:compile:preflight', function() {
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
 * @version 1.1.0
 */
gulp.task('css:minify:preflight', ['css:compile:preflight'], function() {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
    .pipe(notify(
        {
            message: 'CSS minified'
        }
    ));
});

/**
 * Run all CSS tasks
 * 
 * @since 1.0.0
 */
gulp.task('css:preflight', ['css:minify:preflight']);

/**
 * Preflight task
 * Run this once you're happy with your site and you want to prep the files for production.
 * This will run the CSS and JS functions, as well as pass the CSS through purgecss to remove any unused CSS.
 * 
 * Always double check that everything is still working. If something isn't displaying correctly, it may be
 * because you need to add it to the purgeCSS whitelist.
 * 
 * @since 1.1.0
 */
gulp.task('preflight', ['css:preflight', 'js'])