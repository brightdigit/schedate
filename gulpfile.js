var gulp = require('gulp');
var jscs = require('gulp-jscs');
var bump = require('gulp-bump');
var prettify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');
var util = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var bump = require('gulp-bump');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var async = require('async');
var yaml = require('js-yaml');
var fs = require('fs-extra');

var jsSrc = ['./*.js', 'lib/**/*.js', 'test/**/*.js*'];
var src = jsSrc.concat(['test/**/*.html']);

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

gulp.task('pre-test', function() {
  return gulp.src(['lib/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('lint', gulp.series('prettify', function() {
  return gulp.src(jsSrc).pipe(jshint()).pipe(jshint.reporter('default')).pipe(jshint.reporter('fail'));
}));

gulp.task('node-test', gulp.series(gulp.parallel('lint', 'pre-test'), function() {
  return gulp.src(['test/**/*.js'], {
      read: false,
    })
    .pipe(mocha({
      reporter: 'spec',
    }))
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 90,
      },
    }))
    .on('error', util.log);
}));

gulp.task('browser-test', gulp.series(gulp.parallel('lint', 'pre-test'), function() {
  return gulp
    .src('test/runner.html')
    .pipe(mochaPhantomJS());
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

gulp.task('test', gulp.parallel('browser-test', 'node-test'));

gulp.task('javascript', gulp.parallel('lint', 'jscs', 'prettify'));

gulp.task('default', gulp.parallel('javascript', 'test', 'bump', 'appveyor'));