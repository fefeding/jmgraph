
/**
* 渐变类
* op {Object} type:[linear/radial]
* linear为线性渐变
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
*/
jmGradient.prototype.toGradient = function(control) {
	var gradient;
	var context = control.context || control;
	var bounds = control.absoluteBounds?control.absoluteBounds:this.getAbsoluteBounds();
	var x1 = this.x1;
	var y1 = this.y1;
	var x2 = this.x2;
	var y2 = this.y2;

	//处理百分比参数
	if(jmUtils.checkPercent(x1)) {
		x1 = jmUtils.percentToNumber(x1) * control.width();
	}
	if(jmUtils.checkPercent(x2)) {
		x2 = jmUtils.percentToNumber(x2) * control.width();
	}
	if(jmUtils.checkPercent(y1)) {
		y1 = jmUtils.percentToNumber(y1) * control.height();
	}
	if(jmUtils.checkPercent(y2)) {
		y2 = jmUtils.percentToNumber(y2) * control.height();
	}
	if(this.type === 'linear') {
		gradient = context.createLinearGradient(x1 + bounds.left,y1 + bounds.top,x2 + bounds.left,y2 + bounds.top);
	}
	else if(this.type === 'radial') {
		var r1 = this.r1;
		var r2 = this.r2;
		if(jmUtils.checkPercent(r1)) {
			r1 = jmUtils.percentToNumber(r1);
			if(control.radius) {
				r1 = control.radius() * r1;
			}
			else {
				r1 = Math.min(control.width(),control.height()) * r1;
			}
		}
		if(jmUtils.checkPercent(r2)) {
			r2 = jmUtils.percentToNumber(r2);
			if(control.radius) {
				r2 = control.radius() * r2;
			}
			else {
				r2 = Math.min(control.width(),control.height()) * r2;
			}
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
* x=横坐标偏移量，y=纵坐标编移量,blur=模糊值，color=阴影的颜色
*/
jmShadow = function(x,y,blur,color) {
	this.x = x;
	this.y = y;
	this.blur = blur;
	this.color = color;
}