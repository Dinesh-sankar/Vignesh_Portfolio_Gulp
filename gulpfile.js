const {src, dest, watch, series, parallel} = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const minifyCSS = require('gulp-csso');
const rename = require('gulp-rename');
const sourceMaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

const normalizeCSSPaths = [
    'node_modules/normalize.css/normalize.css'
];

const webfontsPaths = [
    'node_modules/@fortawesome/fontawesome-free/webfonts/**'
];

const htmlPaths = [
    'src/**.html'
];

const sassPaths = [
    'src/css/style.scss'
];

const jsPaths = [
    'src/js/**.js'
];

const cssPaths = [
    'src/css/**.css',
    '!src/css/style.scss'
];

const fontsPaths = [
    'src/fonts/**'
];

const imagesPaths = [
    'src/assets/**'
];

function clean() {
    return del('dist/**');
}

function copyHTML() {
    return src(htmlPaths)
    .pipe(dest('dist'))
    .pipe(connect.reload());
}

function copyJS() {
    return src(jsPaths)
    .pipe(dest('dist/js'))
    .pipe(connect.reload());
}

function copyCSS() {
    return src(cssPaths)
    .pipe(dest('dist/css'))
    .pipe(connect.reload());
}

function copyNormalizeCSS() {
    return src(normalizeCSSPaths)
    .pipe(dest('dist/css'));
}

function copyDependentCSSFiles() {
    return src([
        'node_modules/@fortawesome/fontawesome-free/css/all.css',
        'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
        'node_modules/owl.carousel/dist/assets/owl.theme.default.min.css',
        'node_modules/aos/dist/aos.css'
    ])
    .pipe(dest('dist/css'));
}

function copyDependentJSFiles() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/owl.carousel/dist/owl.carousel.min.js',
        'node_modules/aos/dist/aos.js'
    ])
    .pipe(dest('dist/js'));
}

function copyFonts() {
    return src(fontsPaths)
    .pipe(dest('dist/fonts'))
    .pipe(connect.reload());
}

function copyImages() {
    return src(imagesPaths)
    .pipe(dest('dist/assets'))
    .pipe(connect.reload());
}

function copyWebFonts() {
    return src(webfontsPaths)
    .pipe(dest('dist/webfonts'));
}

function sassToCSS() {
    return src(sassPaths)
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(dest('dist/css'))
    .pipe(minifyCSS())
    .pipe(rename({
        extname :'.min.css'
    }))
    .pipe(sourceMaps.write())
    .pipe(dest('dist/css'))
    .pipe(connect.reload());
}

function allCSS() {
    return src([
        'dist/css/aos.css',
        'dist/css/all.css',
        'dist/css/fonts.css',
        'dist/css/normalize.css',
        'dist/css/owl.carousel.min.css',
        'dist/css/owl.theme.default.min.css',
        'dist/css/style.min.css'
    ])
    .pipe(concat('combined.css'))
    .pipe(minifyCSS())
    .pipe(rename({
        extname :'.min.css'
    }))
    .pipe(dest('dist/css/'));
}

function watchFiles() {
    watch(sassPaths, sassToCSS);
    watch(jsPaths, copyJS);
    watch(htmlPaths, copyHTML);
    watch(cssPaths, copyCSS);
    watch(fontsPaths, copyFonts);
    watch(imagesPaths, copyImages);
}

function server() {
    connect.server({
        root: 'dist',
        livereload:'true'
    });
}

exports.default = series( clean, 
                          parallel(copyHTML, copyJS, copyCSS, copyDependentCSSFiles, copyNormalizeCSS,
                                  copyWebFonts, copyDependentJSFiles, copyFonts, copyImages, sassToCSS), 
                          allCSS, 
                          parallel(server, watchFiles)
                        );