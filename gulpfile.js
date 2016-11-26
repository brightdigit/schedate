var gulp = require('gulp');
var gulpBrowser = require('gulp-browser');
var sass = require('gulp-sass');
var jscs = require('gulp-jscs');
var bump = require('gulp-bump');
var prettify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');
var util = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var bump = require('gulp-bump');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var del = require('del');
var ghPages = require('gulp-gh-pages');
var gittags = require('git-tags');
var htmlreplace = require('gulp-html-replace');

var async = require('async');
var yaml = require('js-yaml');
var fs = require('fs-extra');

var jsSrc = ['./static/**/*.js', './*.js'];
var src = jsSrc.concat(['./static/**/*.html', './static/**/*.scss']);
var gls = require('gulp-live-server');


gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});

gulp.task('serve', function() {
  //1. serve with default settings
  var server = gls.static('public'); //Equals to gls.static('public', 3000);
  server.start();

  //Use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch(['static/**/*.css', 'static/**/*.html'], function(file) {
    server.notify.apply(server, [file]);
  });
});

gulp.task('clean', function() {
  return del([
    'public',
  ]);
});

gulp.task('html', function(cb) {


  gittags.latest(function(err, latest) {

    var versionHtml = ['<a class="version-tag" href="https://github.com/brightdigit/schedate/archive/', null, '.zip">', null, '</a>'].map(
      function(item) {
        return item ? item : latest;
      }).join('');
    gulp.src('./static/**/*.html')
      .pipe(htmlreplace({
        'tag-link': versionHtml,
      }))
      .pipe(gulp.dest('./public'))
      .on('end', cb);
  });
});

gulp.task('sass', function() {
  return gulp.src('./static/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('browserify', function() {
  return gulp.src('./static/js/*.js')
    .pipe(gulpBrowser.browserify()) // Gulp.browserify() accepts an optional array of tansforms
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('jscs', function() {
  return gulp.src(jsSrc, {
    base: '.',
  }).pipe(jscs({
    fix: true,
  })).pipe(gulp.dest('.'));
});

gulp.task('bump', function() {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'prerelease',
  })).pipe(gulp.dest('./'));
});

gulp.task('prettify', gulp.series('jscs', function() {
  return gulp.src(src, {
    base: '.',
  }).pipe(prettify({
    indent_size: 2,
  })).pipe(gulp.dest('.'));
}));

gulp.task('lint', gulp.series('prettify', function() {
  return gulp.src(jsSrc).pipe(jshint()).pipe(jshint.reporter('default')).pipe(jshint.reporter('fail'));
}));

gulp.task('appveyor', gulp.series('bump', function(done) {
  async.parallel({
    package: function(cb) {
      fs.readJSON('package.json', cb);
    },
    appveyor: function(cb) {
      fs.readFile('appveyor.yml', 'utf8', cb);
    },
  }, function(error, results) {
    if (error) return done(error);
    var appveyor = yaml.safeLoad(results.appveyor);
    appveyor.version = results.package.version;
    fs.writeFile('appveyor.yml', yaml.safeDump(appveyor), done);
  });
}));

gulp.task('prep', gulp.parallel('lint', 'jscs', 'prettify'));

gulp.task('js', gulp.series('browserify'));

gulp.task('build', gulp.parallel('html', 'sass', 'js'));

gulp.task('public', gulp.series('clean', 'prep', 'build'));

gulp.task('publish', gulp.series('public', 'deploy'));

gulp.task('default', gulp.parallel('public', 'bump', 'appveyor'));