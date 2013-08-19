
/**
 * 画箭头,继承自jmPath
 *
 * @class jmArraw
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} 生成箭头所需的参数
 */
function jmArraw(graph,params) {
	if(!params) params = {};
	this.points = params.points || [];
	var style = params.style || {};
	/**
	 * 当前对象类型名
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmArraw';
	
	style.lineJoin = 'miter';
	style.lineCap = 'square';
	this.graph = graph;
	
	this.angle(params.angle  || 0);
	this.start(params.start  || 0);
	this.end(params.end  || 0);
	this.offsetX(params.offsetX || 5);
	this.offsetY(params.offsetY || 8);
	this.initializing(graph.context,style);
}

jmUtils.extend(jmArraw,jmPath);//jmPath

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @param {boolean} solid 是否为实心的箭头
 * @for jmArraw
 */
jmArraw.prototype.initPoints = function(solid) {	
	var rotate = this.angle();
	var start = this.start();
	var end = this.end();
	if(!end) return;
	//计算箭头指向角度
	if(!rotate) {
		rotate = Math.atan2(end.y - start.y,end.x - start.x);
	}
	this.points = [];
	var offx = this.offsetX();
	var offy = this.offsetY();
	//箭头相对于线的偏移角度
	var r = Math.atan2(offx,offy);
	var r1 = rotate + r;
    var rsin = Math.sin(r1);
    var rcos = Math.cos(r1);
    var sq = Math.sqrt(offx * offx  + offy * offy);
    var ystep = rsin * sq;
    var xstep = rcos * sq;
    
    var p1 = {x:end.x - xstep,y:end.y - ystep};
    var r2 = rotate - r;
    rsin = Math.sin(r2);
    rcos = Math.cos(r2);
    ystep = rsin * sq;
    xstep = rcos * sq;
    var p2 = {x:end.x - xstep,y:end.y - ystep};

    var s = jmUtils.clone(end);  
    s.m = true;  
    this.points.push(s);
    this.points.push(p1);
    //如果实心箭头则封闭路线
    if(solid || this.style.fill) {    	
    	this.points.push(p2);
    	this.points.push(s);
    }
    else {
    	this.points.push(s);
    	this.points.push(p2);
    }
    
	return this.points;
}


/**
 * 控制起始点
 *
 * @method start
 * @for jmArraw
 * @param {point} p 起始点
 * @return {point} 起始点
 */
jmArraw.prototype.start = function(p) {
	return this.setValue('start',p);
}

/**
 * 控制结束点
 *
 * @method end
 * @for jmArraw
 * @param {point} p 结束点
 * @return {point} 结束点
 */
jmArraw.prototype.end = function(p) {
	return this.setValue('end',p);
}

/**
 * 箭头角度
 *
 * @method angle
 * @for jmArraw
 * @param {number} r 箭头角度
 * @return {number} 箭头角度
 */
jmArraw.prototype.angle = function(r) {
	return this.setValue('angle',r);
}

/**
 * 箭头X偏移量
 *
 * @method offsetX
 * @for jmArraw
 * @param {number} p 箭头X偏移量
 * @return {number} 箭头X偏移量
 */
jmArraw.prototype.offsetX = function(p) {
	return this.setValue('offsetX',p);
}
/**
 * 箭头Y偏移量
 *
 * @method offsetY
 * @for jmArraw
 * @param {number} p 箭头Y偏移量
 * @return {number} 箭头Y偏移量
 */
jmArraw.prototype.offsetY = function(p) {
	return this.setValue('offsetY',p);
}

