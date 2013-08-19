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

	var d = 0;
	if(location.radius) {
		d = location.radius * 2;				
	}
	if(!d) {
		d = Math.min(location.width,location.height);				
	}

	//处理百分比参数
	if(jmUtils.checkPercent(x1)) {
		x1 = jmUtils.percentToNumber(x1) * (location.width || d);
	}
	if(jmUtils.checkPercent(x2)) {
		x2 = jmUtils.percentToNumber(x2) * (location.width || d);
	}
	if(jmUtils.checkPercent(y1)) {
		y1 = jmUtils.percentToNumber(y1) * (location.height || d);
	}
	if(jmUtils.checkPercent(y2)) {
		y2 = jmUtils.percentToNumber(y2) * (location.height || d);
	}	
	if(this.type === 'linear') {
		if(control.mode == 'canvas') {
			gradient = context.createLinearGradient(x1 + bounds.left,y1 + bounds.top,x2 + bounds.left,y2 + bounds.top);
		}
		else {
			gradient = Raphael.deg(Math.atan2(y2-y1,x2-x1)) + '-';
			this.stops.each(function(i,stop) {	
				gradient += stop.color + ':' + Math.floor(stop.offset * 100) + '-';
			});
			gradient = jmUtils.trimEnd(gradient,'-');
		}
	}
	else if(this.type === 'radial') {
		var r1 = this.r1;
		var r2 = this.r2;
		
		if(jmUtils.checkPercent(r1)) {
			r1 = jmUtils.percentToNumber(r1);			
			r1 = d * r1;
		}
		if(jmUtils.checkPercent(r2)) {
			r2 = jmUtils.percentToNumber(r2);
			r2 = d * r2;
		}	
		if(control.mode == 'canvas') {		
			gradient = context.createRadialGradient(x1 + bounds.left,y1 + bounds.top,r1,x2 + bounds.left,y2 + bounds.top,r2);
		}
		else {
			gradient = 'r(';
			this.stops.each(function(i,stop) {	
				gradient += stop.offset + ',';
			});
			gradient = jmUtils.trimEnd(gradient,',') + ')';
			this.stops.each(function(i,stop) {	
				gradient += stop.color + '-';
			});
			gradient = jmUtils.trimEnd(gradient,'-');
		}
	}
	if(control.mode == 'canvas') {	
		this.stops.each(function(i,stop) {			
			gradient.addColorStop(stop.offset,stop.color);		
		});
	}
	return gradient;
}

/**
 * 转换为raphael的渐变的字符串表达
 *
 * @method toString
 * @for jmGradient
 * @return {string} raphael的渐变的字符串表达
 */
jmGradient.prototype.toString = function() {

}