

//游戏主体文件
//要注册交互事件前，一定要把显示对象的interactive和buttonMode属性设为true。
(function(win, doc){
    var width = win.innerWidth;
    var height = win.innerHeight;
    var gameState = 'init';//游戏状态，init=等待开始，play=进行中,pause=暂停, end=已结束
    var maxScore = 520;//最高得分
    var startButton = null;
    var tempSprites = [];//临时的精灵，很快就会消失的   
    var resources = new resourcesLoader(); 
    
    resources.add('love', "img/love.json", {
            crossOrigin: true
        }).load(function(){
            //初始化jmgraph
			var g = jmGraph.create('mycanvas', {
                width: width,
                height: height,
                style: {
                    fill: '#fff'
                }
            })			
            init(g);
            
            var lastUpdateTime = Date.now();
            var stepTime = 1000 / 60;
            //实时更新画布
            function update() {
                var delta = Date.now() - lastUpdateTime - stepTime;
                lastUpdateTime = Date.now();
                gameLoop(delta);
                if(g.needUpdate) g.redraw();
                requestAnimationFrame(update);
                
            }
            update();
			
        });

    //游戏渲染逻辑
    function gameLoop(delta) {
        play(delta);
    }

    //更新游戏状态
    function play(delta) {
        map.update(delta);
    }

    function start() {
        gameState = 'play';
        map.start();
        heart.start();
    }

    function end() {
        gameState = 'end';
        startButton.visible = true;
        map.endText.visible = true;
        heart.end();
    }

    //初始化游戏，游戏界页，开始按钮等初始
    function init(g) {
        var loveRes = resources.cache['love'].textures;
        if(!startButton) {
            startButton = new sprite(g, loveRes['start.png']);
            
            startButton.position = {x:(width-startButton.width)/2, y: (height-startButton.height)/2};

            startButton.on('touchend', function(e){
                start();
                this.visible = false;
            });
            g.children.add(startButton);
        }
        startButton.visible = true;

        map.init(g, loveRes); //初始化地图
        heart.init(g, loveRes); //初始化心气球
    }

    //心形对象
    var heart = (function(){
        return {
            vy: 6,
            init: function(g, res){
                if(!this.sprite) {                    
                    this.sprite = new sprite(g, res['heart.png']);
                    g.children.add(this.sprite);
                }
                this.sprite.position = {x: (width - this.sprite.width)/2, y:height - this.sprite.height};
            },
            start: function() {
                this.sprite.position = {x: (width - this.sprite.width)/2, y:height - this.sprite.height};
                this.sprite.canMove(true);
            },
            end: function() {
                this.sprite.canMove(false);
            },
            //碰撞检测
            hitTest: function(role) {
                return this.sprite && hitTestRectangle(this.sprite, role);
            }
        };
    })();

    //当前游戏地图
    //我们把整个地图画成一个大图
    //屏幕和角色相对于地图移动
    var map = (function(){
        var h = height * 5;
        return {
            width: width,
            height: h,
            //地图当前的偏移量，当画布在地图上移动时会修改此值
            offsetPosition: {
                x: 0,
                y: 0
            },
            sprites: [], //所有地图精灵
            init: function(g, res){
                if(!this.endText) {
                    //放置碗
                    for(var i=0;i<6;i++) {
                        var p = new wan(g, res, 50*i+25, height * 3 + 400 + 10*i);
                        this.sprites.push(p);
                        g.children.add(p.sprite);
                    }
                    //放置花
                    for(var i=0;i<6;i++) {
                        var p = new flower(g, res, 40*i+25, height * 2 + 10*i);
                        this.sprites.push(p);
                        g.children.add(p.sprite);
                    }
                    //放置bob
                    for(var i=0;i<6;i++) {
                        var p = new bob(g, res, 45*i+25, height + 10*i);
                        this.sprites.push(p);
                        g.children.add(p.sprite);
                    }

                    this.endText = g.createShape('label',{
                        text: 'END',
                        position:{x: (this.width - 100)/2,y:60},
                        style: {
                            fontFamily: "Arial",
                            fontSize: 46,
                            fill: "blue",
                            stroke: '#ff3300',
                            textAlign : 'center',
                            border: {
                                left: 1,
                                top: 1,
                                right: 1,
                                bottom: 1
                            }
                        }
                    });
                }
                this.endText.visible = false;
                g.children.add(this.endText);
            },
            start: function() {
                //初始化位置
                this.offsetPosition = {
                    x: 0,
                    y: 0
                };
                this.endText.visible = false;
                for(var i=0;i<this.sprites.length;i++) {
                    this.sprites[i].sprite.visible = true;
                    this.sprites[i].update(0);
                }
            },
            //因为这里的精灵是相对于地图的，需要把坐标转换为canvas的
            update: function(delta){
                if(gameState == 'play') {
                    this.move(0 , heart.vy);

                    for(var i=0;i<this.sprites.length;i++) {
                        this.sprites[i].update(delta);
                    }                    

                    if(this.offsetPosition.y >= this.height - height) {
                        end();//结束游戏
                    }
                }
                for(var i=tempSprites.length-1;i>=0; i--) {
                    if(tempSprites[i].update) tempSprites[i].update(delta);
                }
            },
            //转为画布坐标
            toLocalPosition: function(p) {
                var x = p.position.x + this.offsetPosition.x;
                var y = p.position.y + height + this.offsetPosition.y - this.height;
                p.sprite.position = {x:x, y:y};
            },
            //开始移动
            move: function(x, y) {
                this.offsetPosition.x += x;
                this.offsetPosition.y += y;
            }
        }
    })();

    function wan(g, res, x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.sprite = new sprite(g, res['wan.png']);
        this.sprite.visible = false;
        this.die = function() {
            this.sprite.visible = false;
        }
        this.hitEnd = function() {
            var score = new scoreSprite(g, 5, this.sprite.position.x, this.sprite.position.y);
            tempSprites.push(score);
            this.die();
        }
        this.update = function(delta) {
            if(!this.sprite.visible) return;
            map.toLocalPosition(this);
            //如果碰到当前精灵，则精灵死
            if(heart.hitTest(this.sprite)) {
                this.hitEnd();
            }
        }
        this.update(0);
    }
    function flower(g, res, x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.sprite = new sprite(g, res['flower.png']);
        this.sprite.visible = false;
        this.die = function() {
            this.sprite.visible = false;
        }
        this.hitEnd = function() {
            var score = new scoreSprite(g, 10, this.sprite.position.x, this.sprite.position.y);
            tempSprites.push(score);
            this.die();
        }
        this.update = function(delta) {
            if(!this.sprite.visible) return;
            map.toLocalPosition(this);
            //如果碰到当前精灵，则精灵死
            if(heart.hitTest(this.sprite)) {
                this.hitEnd();
            }
        }
        this.update(0);
    }
    function bob(g, res, x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.sprite = new sprite(g, res['bob.png']);
        this.sprite.visible = false;
        this.die = function() {
            this.sprite.visible = false;
        }
        this.hitEnd = function() {
            var score = new scoreSprite(g, 1, this.sprite.position.x, this.sprite.position.y);
            tempSprites.push(score);
            this.die();
        }
        this.update = function(delta) {
            if(!this.sprite.visible) return;
            map.toLocalPosition(this);
            //如果碰到当前精灵，则精灵死
            if(heart.hitTest(this.sprite)) {
                this.hitEnd();
            }
        }
        this.update(0);
    }

    //精灵
    function sprite(g, texture, x, y) {
        //创建一个image
        var img = g.createShape('image',{
            image: texture.img,
            width: texture.img.width,
            height: texture.img.height,
            position: {x: x,y: y}
        });	
        if(texture.frame) {
            img.sourcePosition = {
                x: texture.frame.x||0,
                y: texture.frame.y||0
            };
            img.width = img.sourceWidth = texture.frame.w || texture.img.width;
            img.height = img.sourceHeight = texture.frame.h || texture.img.height;
        }
        return img;
    }

    //加分动画，飞到右上角就消失
    function scoreSprite(g, score, x, y) {
        this.txt =  g.createShape('label',{
            text: '+' + score,
            position:{x: x,y: y},
            style: {
                fontFamily: "Arial",
                fontSize: 12,
                fill: "red",
                stroke: '#ff3300',
                textAlign : 'center'
            }
          });
        g.children.add(this.txt);

        var ox = width - x;
        var oy = y;
        var len = Math.sqrt(ox * ox + oy * oy);
        var speed = len / 80;
        this.vx = speed * ox / len;
        this.vy = speed * oy / len;
        this.update = function(delta) {
            this.txt.position.x += this.vx;
            this.txt.position.y -= this.vy;
            this.txt.needUpdate = true;
            if(this.txt.position.x >= width || this.txt.position.y <= 0) {
                this.die();
            }
        }
        this.die = function() {
            g.children.remove(this.txt);
            for(var i=tempSprites.length-1;i>=0; i--) {
                if(tempSprites[i] && tempSprites[i] == this) {
                    tempSprites.splice(i, 1);
                    break;
                }
            }
        }
    }

    //资源加载管理
    function resourcesLoader(){
        var cache = {};
        //加载器
        function load(queue, index, callback) {
            if(typeof index == 'function') {
                callback = index;
                index = 0;
            }
            var isArray = false;
            if(typeof queue == 'object' && typeof queue.length != 'undefined') {
                if(queue.length <= index) {
                    callback && callback();
                    return;
                }
                isArray = true;
                var obj = queue[index];
            }
            else {
                var obj = queue;
            }
            obj.name = obj.name || obj.url;
            if(!obj.type) {
                if(/\.json(\?|$)/i.test(obj.url)) {
                    obj.type = 'json';
                }
                else {
                    obj.type = 'img';
                }
            }
            if(obj.type == 'img') {
                var img = document.createElement('img');
                img.onload = function(){
                    cache[obj.name] = {
                        frame: {
                            x: 0,
                            y: 0,
                            width: this.width,
                            height: this.height
                        },
                        img: this
                    };
                    if(isArray) {
                        load(queue, index+1, callback);
                        return;
                    }
                    callback && callback(cache[obj.name]);
                };
                img.src = obj.url;
            }
            else {
                request(obj.url, function(ct) {
                    if(!ct) {
                        callback && callback();
                        return;
                    }
                    var data = JSON.parse(ct);
                    if(data.meta && data.meta.image) {
                        load({
                            name: obj.name,
                            url: data.meta.image
                        }, function(txt) {
                                txt.textures = txt.textures||{};
                                for(var name in data.frames) {
                                    var f = data.frames[name];
                                    if(!f) continue;
                                    txt.textures[name]=cache[name] = {
                                        frame: f.frame,
                                        img: txt.img
                                    };
                                }
                                if(isArray) {
                                    load(queue, index+1, callback);
                                    return;
                                }
                                callback && callback(data);
                        });
                        return;
                    }
                    if(isArray) {
                        load(queue, index+1, callback);
                        return;
                    }
                    callback && callback();
                });
            }
        }
        function resourceLoader() {
            this.loadQueue = [];
        }
        //添加加载任务
        resourceLoader.prototype.add = function(name, url) {
            if(!url) url = name;
            var type = 'img';
            if(/\.json(\?|$)/i.test(url)) {
                type = 'json';
            }
            this.loadQueue.push({
                name: name,
                type: type,
                url: url
            });
            return this;
        }
        resourceLoader.prototype.load = function(callback){            
            load(this.loadQueue, 0, callback);
        }


        return {
            cache: cache,
            add: function(name, url){
                return new resourceLoader().add(name, url);
            }
        };
    };

    //请求网络资源
    function request(url, callback) {
        var xmlHttp;
        if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        if(!xmlHttp) {
            callback(null);
            return;
        }
        xmlHttp.onreadystatechange=function(e){
            if(this.readyState == 4) {
                if(this.status == 200) {
                    callback&&callback(this.responseText||this.response);
                }
                else {
                    callback&&callback();
                }
            }
        };
        xmlHttp.open("GET",url,true);
        xmlHttp.send(null);
        return xmlHttp;
    }

    //二个矩形是否有碰撞
    function hitTestRectangle(r1, r2) {
        var hitFlag, combinedHalfWidths, combinedHalfHeights, vx, vy, x1, y1, x2, y2, width1, height1, width2, height2;
        hitFlag = false;

        x1 = r1.x;
        x2 = r2.x;
        y1 = r1.y;
        y2 = r2.y;
        width1 = r1.width;
        width2 = r2.width;
        height1 = r1.height;
        height2 = r2.height;
        //如果对象有指定碰撞区域，则我们采用指定的坐标计算
        if(r1.hitArea) {
            x1 += r1.hitArea.x * map.scale;
            y1 += r1.hitArea.y * map.scale;
            width1 = r1.hitArea.width * map.scale;
            height1 = r1.hitArea.height * map.scale;
        }
        if(r2.hitArea) {
            x2 += r2.hitArea.x * map.scale;
            y2 += r2.hitArea.y * map.scale;
            width2 = r2.hitArea.width * map.scale;
            height2 = r2.hitArea.height * map.scale;
        }

        //中心坐标点
        r1.centerX = x1 + width1 / 2;
        r1.centerY = y1 + height1 / 2;
        r2.centerX = x2 + width2 / 2;
        r2.centerY = y2 + height2 / 2;

        //半宽高
        r1.halfWidth = width1 / 2;
        r1.halfHeight = height1 / 2;
        r2.halfWidth = width2 / 2;
        r2.halfHeight = height2 / 2;

        //中心点的X和Y偏移值
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //计算宽高一半的和
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //如果中心X距离小于二者的一半宽和
        if (Math.abs(vx) < combinedHalfWidths) {
            //如果中心V偏移量也小于半高的和，则二者碰撞
            if (Math.abs(vy) < combinedHalfHeights) {
                hitFlag = true;
            } else {
                hitFlag = false;
            }
        } else {
            hitFlag = false;
        }
        return hitFlag;
    };
})(window, document);
