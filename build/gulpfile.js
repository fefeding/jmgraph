
console.log('start build');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const uglifyes = require('gulp-terser');
const babelify = require('babelify');
const standalonify = require('standalonify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const gulp = require('gulp');
const rollup = require('rollup');
const rollupugify = require('rollup-plugin-uglify');
const rollupbabel = require('rollup-plugin-babel');
const cleanimport = require('gulp-clean-import');
const gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
const glob = require('glob');
const path = require('path');

/**
 * 从配置文件动态生成 jsSources 数组
 * 
 * 配置结构见 build.sources.json，按依赖分层组织核心模块：
 * - foundation: 基础工具层（无外部依赖）
 * - object-model: 对象模型层（依赖 foundation）
 * - style: 样式层（依赖 object-model）
 * - control: 控件基类层（依赖 style）
 * - architecture: 架构优化层（依赖 control）
 * - shapes: 图形组件（自动扫描目录）
 * - entry: 入口文件（jmGraph.js，最后加载）
 */
function loadJsSources() {
  const configPath = path.join(__dirname, 'build.sources.json');
  const config = require(configPath);
  const sources = [];

  // 按层顺序添加核心模块
  for (const layer of config.core.layers) {
    for (const file of layer.files) {
      sources.push(path.join('..', file));
    }
  }

  // 添加 shapes 目录（glob 模式，按文件名排序保证构建稳定性）
  const shapesPattern = path.join(__dirname, '..', config.shapes.pattern);
  const shapeFiles = glob.sync(shapesPattern).sort();
  for (const file of shapeFiles) {
    // 转换为相对于 build 目录的路径（如 ../src/shapes/jmRect.js）
    const relPath = '../' + path.relative(path.join(__dirname, '..'), file).split(path.sep).join('/');
    sources.push(relPath);
  }

  // 添加入口文件
  sources.push(path.join('..', config.core.entry));

  return sources;
}

const jsSources = loadJsSources();

//语法检测
gulp.task('jshint', function () { 
    
    //console.log('jshint:');
    return gulp.src(jsSources)
        .pipe(jshint({
            "esversion": 6
        }))
        .pipe(jshint.reporter('default'));
});

//生成文档
gulp.task('docs', function () { 
    return gulp.src(jsSources)
        .pipe(concat('jmGraph.md'))
        .pipe(gulpJsdoc2md({}))
        .on('error', function (err) {
            console.error('jsdoc2md failed', err.message);
        })
        .pipe(rename(function (path) {
        path.extname = '.md'
        }))
        .pipe(gulp.dest('../docs/api'));
});

//编译成es6版本
gulp.task('build-js-es6', function () {     
    return gulp.src(jsSources) 
    .pipe(cleanimport())
    .pipe(concat('jmgraph.es6.js'))
    .pipe(gulp.dest('../dist'))
    .pipe(uglifyes())
    .pipe(rename('jmgraph.es6.min.js'))
    .pipe(gulp.dest('../dist'));
});

//编译core成es5版本
gulp.task('build-js-core', function () {
    /*return browserify({
        entries: [
            '../src/core/jmGraph.js'
        ]
      })//.plugin(standalonify, {
        //  name: 'jmGraph'   //转为umd规范
      //})
    .transform("babelify", {
        presets: ['@babel/preset-env'],
        //plugins: ['transform-runtime'] 
    })  //使用babel转换es6代码
    .bundle()  //合并打包
    .on('error', function(err) {
        console.log(err);
    })
    .pipe(source('jmgraph.core.js'))
    .pipe(buffer())
    .pipe(gulp.dest('../dist'))
    .pipe(rename('jmgraph.core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../dist'));*/

    return rollup.rollup({
        input: '../src/core/jmGraph.js',
        plugins: [
            rollupbabel({
                babelrc: false,                        //不设置.babelrc文件;
                exclude: 'node_modules/**',            //排除node_modules文件夹;
                presets: [['@babel/env', { modules: false }]],
                //plugins: ['transform-class-properties']//转换静态类属性以及属性声明的属性初始化语法
            }),
            rollupugify.uglify({
                sourcemap: true
            })
        ]
      }).then(bundle => {
        
        return bundle.write({
          file: '../dist/jmgraph.core.min.js',
          format: 'umd',
          name: 'jmGraph',
          sourcemap: true
        });
      });
});

//编译成es5版本
gulp.task('build-js-cmd', function () {
    return browserify({
        entries: [
            '../index.js'
        ]
      }).plugin(standalonify, {
          name: 'jmGraph'   //转为umd规范
      })
    .transform("babelify", {
        presets: ['@babel/preset-env']
    })  //使用babel转换es6代码
    .bundle()  //合并打包
    .pipe(source('jmgraph.js'))
    .pipe(buffer())
    .pipe(gulp.dest('../dist'))
    .pipe(rename('jmgraph.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../dist'));
});

let tasks = ['build-js-core', 'build-js-cmd'];// 'docs', 'build-js-core', 'build-js-cmd'

gulp.task('default', gulp.parallel(tasks, function(done) {
    done();
}));  