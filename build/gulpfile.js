
console.log('start build');

var jshint = require('gulp-jshint');
var Q = require('q');
var gulp = require('gulp');
var path = require('path');
var Stream = require('stream');


var jmbuild = require('gulp-jmbuild');

//配置文件
var config = {
    "debug": false,//如果是true,则不全合并和压缩文件，也不会打md5码
    //项目根路径，后面的路径基本都是相对于它的。
    "root": path.resolve('../'),   
    //构建目标目录，相对于root
    "dest": "dist",
    //js文件构建目标目录，相对于dest,,,如果你想把它放在不同的地方，可以用类似于../这种改变根路径的方法。
    "jsDest": "",
    //html文件构建目标目录，相对于dest
    "htmlDest": "example",
    "fileDest": "example",
    //css文件构建目标目录，相对于dest
    "cssDest": "",
    //JS文件基础路径段，主要用于模块化提取模块id用处，比例在static/js/test/a.js  构建时就会取static/js后的test/a做为模块id
    //如果js文件配置中有配置base，则用文件配置中的base为准 
    "jsBase": "src",
    //文件md5后缀的分隔符，例如：a.{md5}.js
    "separator": ".",
    //md5码取多少位，
    "md5Size": 8,
    //JS需要构建的配置
    "js": [
        {
            //构建源，跟gulp的source方法保持一致，可以是单个文件/目录*.js/数组
            //以下所有类同
            "source": [
                "src/jmGraph.js",
                "src/models/*.js",
                "src/common/jmUtils.js",                 
                "src/common/jmEvents.js",   
                "src/common/jmObject.js",  
                "src/common/jmProperty.js",  
                "src/common/jmControl.js",               
                "src/shapes/jmShape.js",  
                "src/shapes/jmPath.js", 
                "src/shapes/jmArc.js", 
                "src/shapes/jmArraw.js", 
                "src/shapes/jmBezier.js", 
                "src/shapes/jmCircle.js", 
                "src/shapes/jmHArc.js", 
                "src/shapes/jmLine.js", 
                "src/shapes/jmPrismatic.js", 
                "src/shapes/jmRect.js", 
                "src/controls/*.js"         
            ],
            "expand": 'min',
            "concat": "jmgraph.js"
        }
    ],
    "css": [       
    ],
    "html": [
        //{
        //    "source": "example/*.html",
            //当有inline模块化js文件时，理否把它依赖的模块一同内嵌进来，默认为false
        //    "includeModule": true
        //}
    ],
    //普通文件构建，可以用于图片拷贝和打md5码
    "files": [
        //{
        //    "source": "example/images/*.*",            
        //    "dest": "images",
        //    //false表示以流的方式处理，否则表示直接读取到contents中
            //二级进制文件最好设为false
       //     "buffer": false
        //}
    ]
};

//如果指定了debug参数
if(Array.prototype.indexOf.call(process.argv, '-debug') > 0) {
    config.debug = true;
}

//语法检测
gulp.task('jshint', function () { 
    var sources = [];
    if(config.js && config.js.length) {
        for(var i=0;i<config.js.length;i++) {
            if(typeof config.js[i] == 'string') {
                sources.push(config.js[i]);
            }
            else {
                if(Array.isArray(config.js[i].source)) {
                    sources = sources.concat(config.js[i].source);
                }
                else {                   
                    sources.push(config.js[i].source); 
                }
            }
        }
    }
    //console.log('jshint:');
    return gulp.src(sources, {cwd:config.root})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//生成压缩JS任务
var jstasks = jmbuild.jsTask(gulp, config, ['jshint'], function(stream){
    return stream.pipe(startFun('js'));
},function(stream){
    return stream.pipe(startFun('js'));
});
//创建任务，用于执行前面创建的任务
gulp.task('build-js', jstasks,function (){
    console.log('js-start');
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
});

//一般文件处理
var filetasks = jmbuild.fileTask(gulp, config, [], function(stream){
    return stream.pipe(startFun('file'));
},function(stream){
    return stream.pipe(startFun('file'));
});
gulp.task('build-file', filetasks,function (){
    console.log('file-start');
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
});

//压缩css,依赖file拷贝
var csstasks = jmbuild.cssTask(gulp, config, ['build-file'], function(stream){ 
    //此处可以自定加使用一些gulp插件来预处理文件
    //比如cssbase64这个就是使用的gulp-base64来把css听图片换成base64串
    //return stream.pipe(cssbase64({extensions:['svg','png',/\.jpg#datauri$/i]}));
    return stream;
},function(stream){
    return stream.pipe(startFun('css'));
});
//构建css任务
gulp.task('build-style', csstasks,function (){
    console.log('minifyCSS-start');
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
});



//html解析主任务
var htmlTasks = jmbuild.htmlTask(gulp, config, ['build-js', 'build-style'], function(stream){
    return stream.pipe(startFun('html'));
},function(stream){
    return stream.pipe(startFun('html'));
});
gulp.task('build-html', htmlTasks, function (){
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
});

var tasks = ['build-js','build-html'];


gulp.task('default', tasks);  


//下面二个函数只是测试，你可以在里面做你想要的预处理或结束后处理事情
//我是一个测试start
function startFun(msg) {
    var stream = new Stream.Transform({objectMode: true});    
    stream._transform = function(file, unused, callback) {  
        console.log("start Fun["+msg+"]:" + file.path);
        callback(null, file);
      };
    return stream;   
}
//我是一个测试end
function endFun(msg) {
    var stream = new Stream.Transform({objectMode: true});    
    stream._transform = function(file, unused, callback) {  
        console.log("end Fun["+msg+"]:" + file.path);
        callback(null, file);
      };
    return stream;   
}
