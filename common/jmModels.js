
/**
 * 渐变类
 *
 * @class jmGradient
 * @module jmGraph
 * @for jmGraph
 * @param {object} op 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] 
 */
function jmGradient(op) {
	if(op) {
		for(var k in op) {
			this[k] = op[k];
		}
	}
	this.stops = new jmUtils.list();
}

/**
 * 添加渐变色
 * 
 * @method addStop
 * @for jmGradient
 * @param {number} offset 放射渐变颜色偏移,可为百分比参数。
 * @param {string} color 当前偏移颜色值
 */
jmGradient.prototype.addColorStop =
jmGradient.prototype.addStop = function(offset,color) {
	this.stops.add({
		offset:offset,
		color:color
	});
}

/**
 * 生成为canvas的渐变对象
 *
 * @method toGradient
 * @for jmGradient
 * @param {jmControl} control 当前渐变对应的控件
 * @return {gradient} canvas渐变对象
 */
jmGradient.prototype.toGradient = function(control) {
	var gradient;
	var context = control.context || control;
	var bounds = control.absoluteBounds?control.absoluteBounds:control.getAbsoluteBounds();
	var x1 = this.x1;
	var y1 = this.y1;
	var x2 = this.x2;
	var y2 = this.y2;

	var location = control.getLocation();
	//处理百分比参数
	if(jmUtils.checkPercent(x1)) {
		x1 = jmUtils.percentToNumber(x1) * location.width;
	}
	if(jmUtils.checkPercent(x2)) {
		x2 = jmUtils.percentToNumber(x2) * location.width;
	}
	if(jmUtils.checkPercent(y1)) {
		y1 = jmUtils.percentToNumber(y1) * location.height;
	}
	if(jmUtils.checkPercent(y2)) {
		y2 = jmUtils.percentToNumber(y2) * location.height;
	}	
	if(this.type === 'linear') {
		gradient = context.createLinearGradient(x1 + bounds.left,y1 + bounds.top,x2 + bounds.left,y2 + bounds.top);
	}
	else if(this.type === 'radial') {
		var r1 = this.r1;
		var r2 = this.r2;
		var r = 0;
		if(control.radius) {
			var r = control.radius();				
		}
		if(!r) {
			r = Math.min(location.width,location.height);				
		}
		if(jmUtils.checkPercent(r1)) {
			r1 = jmUtils.percentToNumber(r1);			
			r1 = r * r1;
		}
		if(jmUtils.checkPercent(r2)) {
			r2 = jmUtils.percentToNumber(r2);
			r2 = r * r2;
		}			
		gradient = context.createRadialGradient(x1 + bounds.left,y1 + bounds.top,r1,x2 + bounds.left,y2 + bounds.top,r2);
	}
	this.stops.each(function(i,stop) {
		gradient.addColorStop(stop.offset,stop.color);
	});
	return gradient;
}


/**
 * 画图阴影对象表示法
 *
 * @class jmShadow
 * @for jmGraph
 * @param {number} x 横坐标偏移量
 * @param {number} y 纵坐标编移量
 * @param {number} blur 模糊值
 * @param {string} color 阴影的颜色
 */
var jmShadow = function(x,y,blur,color) {
	this.x = x;
	this.y = y;
	this.blur = blur;
	this.color = color;
}