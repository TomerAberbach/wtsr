const path = require('path')
const fs = require('fs')
const del = require('del')

const gulp = require('gulp')
const favicon = require('gulp-real-favicon')
const htmlmin = require('gulp-htmlmin')
const markdown = require('gulp-markdownit')
const markdownsup = require('markdown-it-sup')
const markdownsub = require('markdown-it-sub')
const markdownkbd = require('markdown-it-kbd')
const markdownhighlight = require('markdown-it-highlightjs')
const markdownvideo = require('markdown-it-video')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify-es').default

const clean = () => del(['./public'])
gulp.task('clean', clean)

const html = () =>
  gulp.src('./prepublic/**/*.html')
    .pipe(favicon.injectFaviconMarkups(JSON.parse(fs.readFileSync('./favicon.json')).favicon.html_code))
    .pipe(htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./public'))

const md = () =>
  gulp.src('./prepublic/**/*.md')
    .pipe(markdown({
      options: {
        html: true,
        typographer: true
      },
      plugins: [
        markdownsup,
        markdownsub,
        markdownkbd,
        {
          plugin: markdownhighlight,
          options: {autofill: true}
        },
        {
          plugin: markdownvideo,
          options: {youtube: {width: 640, height: 390}}
        }
      ]
    }))
    .pipe(favicon.injectFaviconMarkups(JSON.parse(fs.readFileSync('./favicon.json')).favicon.html_code))
    .pipe(htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./public'))

const css = () =>
  gulp.src('./prepublic/**/*.css')
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(gulp.dest('./public'))

const img = () =>
  gulp.src('./prepublic/**/*.{gif,jpg,jpeg,png,svg}')
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo({plugins: [{removeTitle: false}]})
    ]))
    .pipe(gulp.dest('./public'))

const favicons = cb =>
  favicon.generateFavicon({
    masterPicture: './prepublic/img/wtsr.jpg',
    dest: './public/favicon',
    iconsPath: 'favicon/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '14%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: '#ffffff',
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: './favicon.json'
  }, cb)
  
const js = () =>
  gulp.src('./prepublic/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public'))

gulp.task('default', gulp.series(clean, gulp.parallel(gulp.series(favicons, gulp.parallel(html, md)), css, img, js)))
