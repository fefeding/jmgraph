


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

function jmShadow(x,y,blur,color) {
	this.x = x;
	this.y = y;
	this.blur = blur;
	this.color = color;

	/**
	 * 转换为raphael的光晕对象
	 *
	 * @method toGlow
	 * @for jmShadow
	 * @class jmShadow	
	 * @return {object} raphael的光晕对象
	 */
	this.toGlow = function() {
		return {
			width: this.blur,
			offsetx : this.x,
			offsety : this.y,
			color : this.color
		}
	}
}