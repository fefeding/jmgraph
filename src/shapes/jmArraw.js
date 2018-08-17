
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
	
	this.angle = params.angle  || 0;
	this.start = params.start  || {x:0,y:0};
	this.end = params.end  ||  {x:0,y:0};
	this.offsetX = params.offsetX || 5;
	this.offsetY = params.offsetY || 8;
	this.initializing(graph.context,style);
}

jmUtils.extend(jmArraw, jmPath);//jmPath

/**
 * 控制起始点
 *
 * @property start
 * @for jmArraw
 * @type {point}
 */
jmUtils.createProperty(jmArraw.prototype, 'start');

/**
 * 控制结束点
 *
 * @property end
 * @for jmArraw
 * @type {point} 结束点
 */
jmUtils.createProperty(jmArraw.prototype, 'end');

/**
 * 箭头角度
 *
 * @property angle
 * @for jmArraw
 * @type {number} 箭头角度
 */
jmUtils.createProperty(jmArraw.prototype, 'angle');

/**
 * 箭头X偏移量
 *
 * @property offsetX
 * @for jmArraw
 * @type {number}
 */
jmUtils.createProperty(jmArraw.prototype, 'offsetX');

/**
 * 箭头Y偏移量
 *
 * @property offsetY
 * @for jmArraw
 * @type {number}
 */
jmUtils.createProperty(jmArraw.prototype, 'offsetY');


/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @param {boolean} solid 是否为实心的箭头
 * @for jmArraw
 */
jmArraw.prototype.initPoints = function(solid) {	
	var rotate = this.angle;
	var start = this.start;
	var end = this.end;
	if(!end) return;
	//计算箭头指向角度
	if(!rotate) {
		rotate = Math.atan2(end.y - start.y,end.x - start.x);
	}
	this.points = [];
	var offx = this.offsetX;
	var offy = this.offsetY;
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
    	this.points.push(end);
    }
    else {
    	this.points.push(s);
    	this.points.push(p2);
    }
    
	return this.points;
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['arraw'] = jmArraw;
}