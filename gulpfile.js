const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();



// Пути к файлам
const paths = {
    src: {
        html: 'src/index.html',
        scss: 'src/scss/**/*.scss',
    },
    dist: {
        root: 'dist',
        html: 'dist/index.html',
    },
};

// Обработка SCSS
function styles() {
    return src(paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(dest(paths.dist.root));
}

// Перенос HTML
function html() {
    return src(paths.src.html)
        .pipe(dest(paths.dist.root));
}

// BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: paths.dist.root,
        },
    });

    watch(paths.src.scss, styles).on('change', browserSync.reload);
    watch(paths.src.html, html).on('change', browserSync.reload);
}

// Задачи
const build = parallel(styles, html);
const dev = series(build, serve);

exports.build = build;
exports.dev = dev;