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

gulp.task('default', ['dev']);

gulp.task('dev', ['index-dev']);
gulp.task('beta', ['index-beta']);

gulp.task('index-dev', ['sass','config_dev'], function(){
  return gulp.src('./www/index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}),{ name: 'bower', relative: true}))
    .pipe(inject(gulp.src('./www/modules/**/*.js', {read: false}), {name:'components', relative: true}))
    .pipe(inject(gulp.src('./www/js/**/*.js', {read: false}), {relative: true}))
    .pipe(inject(gulp.src('./www/css/**/*.css', {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('index-beta', ['sass','config_beta'], function(){
  return gulp.src('./www/index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}),{ name: 'bower', relative: true}))
    .pipe(inject(gulp.src('./www/modules/**/*.js', {read: false}), {name:'components', relative: true}))
    .pipe(inject(gulp.src('./www/js/**/*.js', {read: false}), {relative: true}))
    .pipe(inject(gulp.src('./www/css/**/*.css', {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
});

////////////////////
// serve
////////////////////
gulp.task('serve', ['dev', 'browser-sync', 'watch']);

gulp.task('watch',function(){
  gulp.watch([
    __dirname + '/www/**/*.{js,html,css,svg,png,gif,jpg,jpeg}',
  ], {
    debounceDelay: 400
  }, function() {
    browserSync.reload();
  });
  
  gulp.watch(__dirname + '/scss/*.scss', ['sass']);  
});

////////////////////
// browser-sync
////////////////////
gulp.task('browser-sync', function() {
  return browserSync({
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

});

gulp.task('sass', ['clean'], function(done) {
  // gulp.src('./scss/ionic.app.scss')
  //   .pipe(sass())
  //   .pipe(gulp.dest('./www/css/'))
  //   .pipe(minifyCss({
  //     keepSpecialComments: 0
  //   }))
  //   .pipe(rename({ extname: '.min.css' }))
  //   .pipe(gulp.dest('./www/css/'))
  //   .on('end', done);
  return gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css'));
});



var APP_VERSION = {
  MAJOR: 1,
  MINOR: 0,
  DETAIL: 0
};


gulp.task('config_dev', function () {
  var constants = {
    ENV: {
      FIREBASE_URI:"https://doresol-dev.firebaseio.com/",
      HOST:"http://doresol.net:8000",
      MEMORIAL_KEY:"-J_yaUS2gsgyLbDtgzQA",
      APP_VERSION:APP_VERSION
    }
  }

  return gulp.src('config.json')
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
      MEMORIAL_KEY:"-J_yaUS2gsgyLbDtgzQA",
      APP_VERSION:APP_VERSION
    }
  }

  return gulp.src('config.json')
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

gulp.task('index', function(){
  return gulp.src('./www/index.html')
    // .pipe(inject(gulp.src(bowerFiles(), {read: false}),{
    //   name: 'bower',
    //   relative: true,
    //   transform: function (filepath) {
    //     // if (filepath.indexOf("angular.js")  > -1) {
    //     //   return null;
    //     // }
    //     // Use the default transform as fallback:
    //     return inject.transform.apply(inject.transform, arguments);
    //   }
    //  }))
    .pipe(inject(gulp.src(bowerFiles(), {read: false}),{ name: 'bower', relative: true}))
    .pipe(inject(gulp.src('./www/modules/**/*.js', {read: false}), {name:'components', relative: true}))
    .pipe(inject(gulp.src('./www/js/**/*.js', {read: false}), {relative: true}))
    .pipe(inject(gulp.src('./www/css/**/*.css', {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
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
