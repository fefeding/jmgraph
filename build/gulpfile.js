
console.log('start build');

const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const gulp = require('gulp');

//语法检测
gulp.task('jshint', function () { 
    
    //console.log('jshint:');
    return gulp.src(jssources, {cwd:config.root})
        .pipe(jshint({
            "esversion": 6
        }))
        .pipe(jshint.reporter('default'));
});

//创建任务，用于执行前面创建的任务
gulp.task('build-js', [], function (){
     
     return gulp.src([
         "../src/common/*.js",
         "../src/models/*.js",
         "../src/shapes/*.js",
         "../src/controls/*.js",
         "../src/jmGraph.js"
        ])
        
     .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(concat('jmgraph.js'))
    .pipe(gulp.dest('../dist'))
    .pipe(uglify({}))
    .pipe(rename('jmgraph.min.js'))
    .pipe(gulp.dest('../dist'));
});

let tasks = ['build-js'];

gulp.task('default', tasks);  