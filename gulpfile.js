var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var clean = require('gulp-clean');
var inject = require("gulp-inject");
var bowerFiles = require('main-bower-files');
var ngConstant = require('gulp-ng-constant');
var browserSync = require('browser-sync');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['dev']);

gulp.task('dev', ['clean','sass','config_dev','index']);
gulp.task('beta', ['clean','sass','config_beta','index']);

////////////////////
// serve
////////////////////
gulp.task('serve', ['dev', 'browser-sync']);

////////////////////
// browser-sync
////////////////////
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: __dirname + '/www/',
      directory: true
    },
    ghostMode: false,
    notify: false,
    debounce: 200,
    port: 8901,
    startPath: 'index.html'
  });

  gulp.watch([
    __dirname + '/www/**/*.{js,html,css,svg,png,gif,jpg,jpeg}'
  ], {
    debounceDelay: 400
  }, function() {
    browserSync.reload();
  });
});

gulp.task('config_dev', function () {
  var constants = {
    ENV: {
      FIREBASE_URI:"https://doresol-dev.firebaseio.com/",
      HOST:"http://doresol.net:8000",
      MEMORIAL_KEY:"-J_yaUS2gsgyLbDtgzQA"
    }
  }

  gulp.src('config.json')
    .pipe(ngConstant({
      name: 'env',
      // deps: ['ngAnimate'],
      constants: constants,
      // wrap: 'amd',
      wrap:'\'use strict\';\n\n <%= __ngModule %>',
    }))
    // Writes config.js to dist/ folder
    .pipe(gulp.dest('./www/js'));
});

gulp.task('config_beta', function () {
  var constants = {
    ENV: {
      FIREBASE_URI:"https://doresol-beta.firebaseio.com/",
      HOST:"http://doresol.net",
      MEMORIAL_KEY:"-J_yaUS2gsgyLbDtgzQA"
    }
  }

  gulp.src('config.json')
    .pipe(ngConstant({
      name: 'env',
      // deps: ['ngAnimate'],
      constants: constants,
      wrap:'\'use strict\';\n\n <%= __ngModule %>',
    }))
    // Writes config.js to dist/ folder
    .pipe(gulp.dest('./www/js'));
});

gulp.task('clean', function () {
  return gulp.src('./www/css', {read: false})
    .pipe(clean());
});

gulp.task('sass', function(done) {
  // gulp.src('./scss/ionic.app.scss')
  //   .pipe(sass())
  //   .pipe(gulp.dest('./www/css/'))
  //   .pipe(minifyCss({
  //     keepSpecialComments: 0
  //   }))
  //   .pipe(rename({ extname: '.min.css' }))
  //   .pipe(gulp.dest('./www/css/'))
  //   .on('end', done);
  gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css'));
});

// gulp.task('bower-install', function(){
//   gulp.src('./www/index.html')
//     .pipe(inject(gulp.src(bowerFiles(), { base: './www/lib' }, {read: false}), {name: 'bower'}))
//     .pipe(gulp.dest('./www'))
// })

gulp.task('index', function(){
  return gulp.src('./www/index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}),{
      name: 'bower',
      relative: true,
      transform: function (filepath) {
        // if (filepath.indexOf("angular.js")  > -1) {
        //   return null;
        // }
        // Use the default transform as fallback:
        return inject.transform.apply(inject.transform, arguments);
      }
     }))
    .pipe(inject(gulp.src('./www/modules/**/*.js', {read: false}), {relative: true, name:'components'}))
    .pipe(inject(gulp.src('./www/js/**/*.js', {read: false}), {relative: true}))
    .pipe(inject(gulp.src('./www/css/**/*.css', {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
