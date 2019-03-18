
console.log('start build');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const gulp = require('gulp');

const jsSources = [
    "../src/common/*.js",
    "../src/models/*.js",
    "../src/shapes/*.js",
    "../src/controls/*.js",
    "../src/jmGraph.js"
   ];

//语法检测
gulp.task('jshint', function () { 
    
    //console.log('jshint:');
    return gulp.src(jsSources)
        .pipe(jshint({
            "esversion": 6
        }))
        .pipe(jshint.reporter('default'));
});

//创建任务，用于执行前面创建的任务
gulp.task('build-js-es6', [], function () {     
    return browserify({
        entries: [
            '../src/jmGraph.js'
        ]
      }) 
    .transform("babelify", {
        presets: ['@babel/preset-env']
    })  //使用babel转换es6代码
    .bundle()  //合并打包
    .pipe(source('jmgraph.js'))
    .pipe(buffer())
    .pipe(gulp.dest('../dist'));
});

//创建任务，用于执行前面创建的任务
gulp.task('build-js-cmd', function () {
    return browserify({
        entries: [
            '../src/jmGraph.js'
        ]
      }) 
    .transform("babelify", {
        presets: ['@babel/preset-env']
    })  //使用babel转换es6代码
    .bundle()  //合并打包
    .pipe(source('jmgraph.js'))
    .pipe(buffer())
    .pipe(gulp.dest('../dist'));
});

let tasks = ['build-js-cmd'];

gulp.task('default', tasks);  