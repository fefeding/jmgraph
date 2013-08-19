
/**
 * 可拉伸的缩放控件
 * 继承jmRect
 * 如果此控件加入到了当前控制的对象的子控件中，请在参数中加入movable:false，否则导致当前控件会偏离被控制的控件。
 *
 * @class jmResize
 * @for jmGraph
 */
function jmResize(graph,params) {
	this.params = params || {};
	var style = params.style || {};
	/**
	 * 当前对象类型名jmResize
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmResize';	
	//是否可拉伸
	this.enabled = params.enabled === false?false:true;	
	
	
	this.graph = graph;
	this.points = params.points || [];
	this.position(params.position || {x:0,y:0});
	this.width(params.width || 0);
	this.height(params.height  || 0);
	this.rectSize(params.rectSize || 10);
	this.initializing(graph.context,style);
	this.init();
}

jmUtils.extend(jmResize,jmRect);//jmRect

/**
 * 初始化控件的8个拉伸方框
 *
 * @method init
 * @private
 */
jmResize.prototype.init = function() {
	//如果不可改变大小。则直接退出
	if(this.params.resizable === false) return;
	this.resizeRects = [];	
	var rs = this.rectSize();
	for(var i = 0;i<8;i++) {
		//生成改变大小方块
		var r = this.graph.createShape('rect',{
				position:{x:0,y:0},
				width:rs,
				height:rs,
				style:{
					stroke: this.style.rectStroke || 'red',
					//fill:'transparent',
					close:true,
					zIndex:100
				}});
		r.index = i;
		r.visible = true;
		this.resizeRects.push(r);	
		this.children.add(r);
		r.canMove(true,this.graph);	
	}	
	this.reset(0,0,0,0);//初始化位置
	//绑定其事件
	this.bindRectEvents();
}

/**
 * 绑定周边拉伸的小方块事件
 *
 * @method bindRectEvents
 * @private
 */
jmResize.prototype.bindRectEvents = function() {
	var self = this;
	
	for(var i in this.resizeRects) {
		var r = this.resizeRects[i];		
		//小方块移动监听
		r.on('move',function(arg) {				
			var px=0,py=0,dx=0,dy=0;
			if(this.index == 0) {				
				dx = - arg.offsetX;
				px = arg.offsetX;						
			}
			else if(this.index == 1) {
				dx = - arg.offsetX;
				px = arg.offsetX;				
				dy = - arg.offsetY;
				py = arg.offsetY;						
			}
			else if(this.index == 2) {				
				dy = -arg.offsetY;				
				py = arg.offsetY;						
			}
			else if(this.index == 3) {
				dx = arg.offsetX;				
				dy = -arg.offsetY;
				py = arg.offsetY;
			}
			else if(this.index == 4) {
				dx = arg.offsetX;							
			}
			else if(this.index == 5) {
				dx = arg.offsetX;
				dy = arg.offsetY;					
			}
			else if(this.index == 6) {
				dy = arg.offsetY;					
			}
			else if(this.index == 7) {
				dx = - arg.offsetX;
				px = arg.offsetX;
				dy = arg.offsetY;				
			}
			//重新定位
			self.reset(px,py,dx,dy);
		});
		//鼠标指针
		r.bind('mousemove',function() {	
			var rectCursors = ['w-resize','nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize'];		
			this.cursor(rectCursors[this.index]);
		});
		r.bind('mouseleave',function() {
			this.cursor('default');
		});
	}
}

/**
 * 按移动偏移量重置当前对象，并触发大小和位置改变事件
 * @method reset
 * @param {number} px 位置X轴偏移
 * @param {number} py 位置y轴偏移
 * @param {number} dx 大小x轴偏移
 * @param {number} dy 大小y轴偏移
 */
jmResize.prototype.reset = function(px,py,dx,dy) {
	var minSize = 5;
	var location = this.getLocation();
	if(dx != 0 || dy != 0) {
		var w = location.width + dx;
		var h = location.height + dy;
		if(w >= minSize && h >= minSize) {
			this.width(w);
			this.height(h);
			//如果当前控件能移动才能改变其位置
			if(this.params.movable !== false) {
				var p = this.position();
				p.x = location.left + px;
				p.y = location.top + py;
				this.position(p);
			}			
			//触发大小改变事件
			this.emit('resize',px,py,dx,dy);
		}	
	}

	for(var i in this.resizeRects) {
		var r = this.resizeRects[i];
		switch(r.index) {
			case 0: {
				r.position().x = -r.width() / 2;
				r.position().y = (location.height - r.height()) / 2;
				break;
			}	
			case 1: {
				r.position().x = -r.width() / 2;
				r.position().y = -r.height() / 2;
				break;
			}		
			case 2: {
				r.position().x = (location.width - r.width()) / 2;
				r.position().y = -r.height() / 2;
				break;
			}
			case 3: {
				r.position().x = location.width - r.width() / 2;
				r.position().y = -r.height() / 2;
				break;
			}
			case 4: {
				r.position().x = location.width - r.width() / 2;
				r.position().y = (location.height - r.height()) / 2;
				break;
			}
			case 5: {
				r.position().x = location.width - r.width() / 2;
				r.position().y = location.height - r.height() /2;
				break;
			}
			case 6: {
				r.position().x = (location.width - r.height()) / 2;
				r.position().y = location.height - r.height() / 2;
				break;
			}
			case 7: {
				r.position().x = -r.width() / 2;
				r.position().y = location.height - r.height() / 2;
				break;
			}
		}
	}
}

/**
 * 拉伸小方块边长
 *
 * @method rectSize
 * @param {number} s 边长
 * @return {number} 当前边长
 */
jmResize.prototype.rectSize = function(s) {
	return this.setValue('rectSize',s);
}

/**
 * 控制的目标控件
 *
 * @method target
 * @param {jmControl} target 边长
 * @return {jmControl} 控制的目标控件
 */
jmResize.prototype.target = function(target) {
	return this.setValue('target',target);
}

