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
            whitelist: [
                'h2',
                'h3',
                'p',
                'blockquote',
                'cta-primary',
                'cta-secondary'
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
 * Minify the CSS
 * 
 * @since 1.0.0
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
 */
gulp.task('js:minify', function() {
    return gulp.src('assets/scripts/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./js'))
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
 * 
 * @since 1.0.0
 */
gulp.task('dev', ['css', 'js'], function() {
    gulp.watch('./tailwind.config.js', ['css']);
    gulp.watch('./assets/styles/**/*.scss', ['css']);
    gulp.watch('./assets/scripts/**/*.js', ['js']);
});