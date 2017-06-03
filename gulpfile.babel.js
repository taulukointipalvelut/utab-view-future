
import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import pug from 'gulp-pug'
import stylus from 'gulp-stylus'
import autoprefixer from 'gulp-autoprefixer'
import eslint from 'gulp-eslint'
import uglify from 'gulp-uglify'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webserver from 'gulp-webserver'
import rename from 'gulp-rename'
import run from 'run-sequence'
import del from 'del'

const src = {
  root: 'src/',
  stylus: 'src/**/!(_)*.@(styl|stylus)',
  es: 'src/**/!(_)*.@(js|es6|es|es6.js|es.js)',
  pug: 'src/**/!(_)*.@(pug|jade)',
  assets: 'src/assets/**/*'
}
const dest = {
  root: 'build/',
  stylus: 'build/css/',
  es: 'build/js/',
  pug: 'build/',
  assets: 'build/assets/'
}

const config = {
  stylus: {
    'include css': true,
    compress: true
  },
  autoprefixer: {
    browsers: ['last 2 versions']
  },
  webpack: {
    entry: ['babel-polyfill', './src/main.js'],
    output: {
      filename: '[name].js'
    },
    resolve: {
        extenstions: ['', '.js', '.json']
    },
    /*plugins: [
      new webpack.optimize.AggressiveMergingPlugin()
    ],*/
    module: {
      loaders: [
        {
          test: /\.(js|es6|es|es6\.js|es\.js)$/,
          include: /\/src\/*/,
          loader: 'babel-loader',
          query: {
            presets: ['latest'],
            plugins: [
              ['transform-runtime', {
                polyfill: false,
                regenerator: true }]
            ]
          }
        }
      ]
    }
  },
  uglify: {
    /* none */
  },
  pug: {
    verbose: true
  },
  htmlmin: {
    caseSensitive: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkAttributes: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    sortAttributes: true,
    sortClassName: true
  },
  eslint: {
    extends: ['standard'],
    parserOptions: {
      ecmaVersion: '2017',
      sourceType: 'module'
    },
    plugins: ['promise'],
    rules: {
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow snake case
      'camelcase': 0,
      // allow trailing comma
      'comma-dangle': 0
    }
  },
  webserver: {
    livereload: true,
    directryListing: true,
    open: true
  }
}

gulp.task('build:css', ['build:stylus'])
gulp.task('build:stylus', () => gulp
  .src(src.stylus)
  .pipe(stylus(config.stylus))
  .pipe(autoprefixer(config.autoprefixer))
  .pipe(rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest(dest.stylus))
)

gulp.task('build:js', ['build:es'])
gulp.task('build:es', ['lint:es'], () => gulp
  .src(src.es)
  .pipe(webpackStream(config.webpack))
  /*.pipe(uglify(config.uglify))*/
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(gulp.dest(dest.es))
)

gulp.task('build:html', ['build:pug'])
gulp.task('build:pug', () => gulp
  .src(src.pug)
  .pipe(pug(config.pug))
  .pipe(htmlmin(config.htmlmin))
  .pipe(gulp.dest(dest.pug))
)

gulp.task('build:asset', ['build:assets'])
gulp.task('build:assets', () => gulp
  .src(src.assets)
  .pipe(gulp.dest(dest.assets))
)

gulp.task('lint:js', ['lint:es'])
gulp.task('lint:es', () => gulp
  .src(src.es)
  .pipe(eslint(config.eslint))
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
)

gulp.task('serve', () => gulp
  .src(dest.root)
  .pipe(webserver(config.webserver))
)

gulp.task('watch', () => {
  gulp.watch(src.stylus, ['build:stylus'])
  gulp.watch(src.pug, ['build:pug'])
  gulp.watch(src.es, ['build:es'])
  gulp.watch(src.assets, ['build:assets'])
})

gulp.task('clean', del.bind(null, [dest.root]))
gulp.task('lint', ['lint:js'])
gulp.task('build', ['lint'], (cb) => run('clean', ['build:css', 'build:js', 'build:html', 'build:assets'], cb))

gulp.task('default', ['build'], (cb) => run('serve', 'watch', cb))
