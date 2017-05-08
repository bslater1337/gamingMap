//modules used
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('travis', ['build', 'testServerJS'], function({
}));
