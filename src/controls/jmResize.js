import {jmRect} from "../shapes/jmRect.js";
/**
 * 可拉伸的缩放控件
 * 继承jmRect
 * 如果此控件加入到了当前控制的对象的子控件中，请在参数中加入movable:false，否则导致当前控件会偏离被控制的控件。
 *
 * @class jmResize
 * @extends jmRect
 */
class jmResize extends jmRect {	

	constructor(params, t='jmResize') {
		params = params || {};
		super(params, t);
		//是否可拉伸
		this.resizable = params.resizable === false?false:true;	
		this.movable = params.movable;
		this.rectSize = params.rectSize || 8;
		this.style.close = this.style.close || true;

		this.init(params);
	}
	/**
	 * 拉动的小方块大小
	 * @property rectSize
	 * @type {number}
	 */
	get rectSize() {
		return this.__pro('rectSize');
	}
	set rectSize(v) {
		return this.__pro('rectSize', v);
	}

	/**
	 * 是否可以拉大缩小
	 * @property resizable
	 * @type {boolean}
	 */
	get resizable() {
		return this.__pro('resizable');
	}
	set resizable(v) {
		return this.__pro('resizable', v);
	}

	/**
	 * 初始化控件的8个拉伸方框
	 *
	 * @method init
	 * @private
	 */
	init(params) {
		//如果不可改变大小。则直接退出
		if(this.resizable === false) return;
		this.resizeRects = [];	
		let rs = this.rectSize;
		let rectStyle = this.style.rectStyle || {
				stroke: 'red',
				fill: 'transparent',
				lineWidth: 2,
				close: true,
				zIndex:100
			};
		rectStyle.close = true;
		rectStyle.fill = rectStyle.fill || 'transparent';
		
		for(let i = 0;i<8;i++) {
			//生成改变大小方块
			let r = (this.graph || params.graph).createShape('rect',{
					position:{x:0,y:0},
					width: rs,
					height: rs,
					style: rectStyle,
					interactive: true
				});
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
	bindRectEvents() {		
		for(let i =0; i<this.resizeRects.length; i++) {
			let r = this.resizeRects[i];		
			//小方块移动监听
			r.on('move',function(arg) {				
				let px=0, py=0, dx=0, dy=0;
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
					dx = - arg.offsetX;
					px = arg.offsetX;
					dy = arg.offsetY;				
				}
				//重新定位
				this.parent.reset(px,py,dx,dy);
				this.needUpdate = true;
			});
			//鼠标指针
			r.bind('mousemove',function() {	
				let rectCursors = ['w-resize','nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize'];		
				this.cursor = rectCursors[this.index];
			});
			r.bind('mouseleave',function() {
				this.cursor = 'default';
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
	reset(px, py, dx, dy) {
		let minWidth = typeof this.style.minWidth=='undefined'?5:this.style.minWidth;
		let minHeight = typeof this.style.minHeight=='undefined'?5:this.style.minHeight;

		let location = this.getLocation();
		if(dx != 0 || dy != 0) {
			let w = location.width + dx;
			let h = location.height + dy;
			if(w >= minWidth || h >= minHeight) {
				if(w >= minWidth) {
					this.width = w;
				}
				else {
					px = 0;
					dx = 0;
				}
				if(h >= minHeight) {
					this.height = h;
				}
				else {
					py = 0;
					dy = 0;
				}
				//如果当前控件能移动才能改变其位置
				if(this.movable !== false && (px||py)) {
					let p = this.position;
					p.x = location.left + px;
					p.y = location.top + py;
					this.position = p;
				}			
				//触发大小改变事件
				this.emit('resize',px,py,dx,dy);
			}	
		}

		for(let i in this.resizeRects) {
			let r = this.resizeRects[i];
			switch(r.index) {
				case 0: {
					r.position.x = -r.width / 2;
					r.position.y = (location.height - r.height) / 2;
					break;
				}	
				case 1: {
					r.position.x = -r.width / 2;
					r.position.y = -r.height / 2;
					break;
				}		
				case 2: {
					r.position.x = (location.width - r.width) / 2;
					r.position.y = -r.height / 2;
					break;
				}
				case 3: {
					r.position.x = location.width - r.width / 2;
					r.position.y = -r.height / 2;
					break;
				}
				case 4: {
					r.position.x = location.width - r.width / 2;
					r.position.y = (location.height - r.height) / 2;
					break;
				}
				case 5: {
					r.position.x = location.width - r.width / 2;
					r.position.y = location.height - r.height /2;
					break;
				}
				case 6: {
					r.position.x = (location.width - r.height) / 2;
					r.position.y = location.height - r.height / 2;
					break;
				}
				case 7: {
					r.position.x = -r.width / 2;
					r.position.y = location.height - r.height / 2;
					break;
				}
			}
		}
	}
}

export { jmResize };