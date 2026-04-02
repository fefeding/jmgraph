import {jmUtils} from "./jmUtils.js";
import {jmList} from "./jmList.js";

/**
 * 渐变类
 *
 * @class jmGradient
 * @param {object} op 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] 
 */
export default class jmGradient {
	constructor(opt) {
		this.stops = new jmList();

		if(opt && typeof opt == 'object') {
			for(let k in opt) {
				if(k === 'stops') continue;
				this[k] = opt[k];
			}
			if(opt.stops && Array.isArray(opt.stops)) {
				this.stops.push(...opt.stops);
			}
		}
		//解析字符串格式
		//linear-gradient(direction, color-stop1, color-stop2, ...);
		//radial-gradient(center, shape size, start-color, ..., last-color);
		else if(typeof opt == 'string') {
			this.fromString(opt);
		}
	}
	/**
	 * 添加渐变色
	 * 
	 * @method addStop
	 * @for jmGradient
	 * @param {number} offset 放射渐变颜色偏移,可为百分比参数。
	 * @param {string} color 当前偏移颜色值
	 */
	addStop(offset, color) {
		this.stops.add({
			offset: Number(offset),
			color: color
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
	toGradient(control) {
		let gradient;
		let context = control.context || control;
		let bounds = control.absoluteBounds?control.absoluteBounds:control.getAbsoluteBounds();
		let x1 = this.x1||0;
		let y1 = this.y1||0;
		let x2 = this.x2;
		let y2 = this.y2;

		let location = control.getLocation();

		let d = 0;
		if(location.radius) {
			d = location.radius * 2;				
		}
		if(!d) {
			d = Math.min(location.width || 0, location.height || 0);				
		}
		if(d <= 0) {
			d = Math.max(bounds.width || 0, bounds.height || 0, 100);
		}

		const width = bounds.width || d;
		const height = bounds.height || d;

		if(jmUtils.checkPercent(x1)) {
			x1 = jmUtils.percentToNumber(x1) * width;
		}
		else if(typeof x1 === 'number' && x1 >= 0 && x1 <= 1) {
			x1 = x1 * width;
		}
		else if(typeof x1 === 'string') {
			const num = parseFloat(x1);
			if(!isNaN(num)) x1 = num;
		}
		if(jmUtils.checkPercent(x2)) {
			x2 = jmUtils.percentToNumber(x2) * width;
		}
		else if(typeof x2 === 'number' && x2 >= 0 && x2 <= 1) {
			x2 = x2 * width;
		}
		else if(typeof x2 === 'string') {
			const num = parseFloat(x2);
			if(!isNaN(num)) x2 = num;
		}
		if(jmUtils.checkPercent(y1)) {
			y1 = jmUtils.percentToNumber(y1) * height;
		}
		else if(typeof y1 === 'number' && y1 >= 0 && y1 <= 1) {
			y1 = y1 * height;
		}
		else if(typeof y1 === 'string') {
			const num = parseFloat(y1);
			if(!isNaN(num)) y1 = num;
		}
		if(jmUtils.checkPercent(y2)) {
			y2 = jmUtils.percentToNumber(y2) * height;
		}
		else if(typeof y2 === 'number' && y2 >= 0 && y2 <= 1) {
			y2 = y2 * height;
		}
		else if(typeof y2 === 'string') {
			const num = parseFloat(y2);
			if(!isNaN(num)) y2 = num;
		}

		x1 = Number(x1) || 0;
		y1 = Number(y1) || 0;
		x2 = Number(x2) || 0;
		y2 = Number(y2) || 0;

		let sx1 = x1 + (bounds.left || 0);
		let sy1 = y1 + (bounds.top || 0);
		let sx2 = x2 + (bounds.left || 0);
		let sy2 = y2 + (bounds.top || 0);
		if(this.type === 'linear') {
			if(control.mode === 'webgl' && control.webglControl) {
				// WebGL 着色器中 v_text_coord 是绝对坐标，需要传递绝对坐标
				gradient = control.webglControl.createLinearGradient(sx1, sy1, sx2, sy2, bounds);
				gradient.key = this.toString();
			}	
			else {		
				context.createLinearGradient && (gradient = context.createLinearGradient(sx1, sy1, sx2, sy2));
			}
		}
		else if(this.type === 'radial') {
			let r1 = this.r1||0;
			let r2 = this.r2;
			
			if(d <= 0) {
				d = Math.max(bounds.width || 0, bounds.height || 0, 1);
			}
			
			if(jmUtils.checkPercent(r1)) {
				r1 = jmUtils.percentToNumber(r1);			
				r1 = d * r1;
			}
			else if(typeof r1 === 'number' && r1 >= 0 && r1 <= 1) {
				r1 = r1 * d;
			}
			else if(typeof r1 === 'string') {
				r1 = parseFloat(r1) || 0;
			}
			
			if(jmUtils.checkPercent(r2)) {
				r2 = jmUtils.percentToNumber(r2);
				r2 = d * r2;
			}
			else if(typeof r2 === 'number' && r2 >= 0 && r2 <= 1) {
				r2 = r2 * d;
			}
			else if(typeof r2 === 'string') {
				r2 = parseFloat(r2);
			}
			
			if(r2 === undefined || r2 === null || isNaN(Number(r2)) || Number(r2) <= 0) {
				r2 = d / 2;
			}
			
			r1 = Number(r1) || 0;
			r2 = Number(r2) || d / 2;
			
			if(control.mode === 'webgl' && control.webglControl) {
				gradient = control.webglControl.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2, bounds);
				gradient.key = this.toString();
			}	
			else if(context.createRadialGradient) {
				gradient = context.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2);	
			}
			else if(context.createCircularGradient) { 
				gradient = context.createCircularGradient(sx1, sy1, r2);
			}
		}
		
		//颜色渐变
		if(gradient) {
			this.stops.each(function(i,s) {	
				let c = jmUtils.toColor(s.color);
				//s.offset 0.0 ~ 1.0
				gradient && gradient.addColorStop(s.offset, c);		
			});
		}
		else {
			const s = this.stops.get(0);
			return (s && s.color) || '#000';
		}
		
		return gradient;
	}

	/**
	 * 解析渐变字符串
	 * 支持的格式:
	 * - linear-gradient(180deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)
	 * - linear-gradient(to top, red, blue)
	 * - linear-gradient(to right bottom, red, blue)
	 * - linear-gradient(45deg, red, blue)
	 * - linear-gradient(0.5turn, red, blue)
	 * - radial-gradient(circle, red, blue)
	 * - radial-gradient(ellipse at top, red, blue)
	 *
	 * @method fromString
	 * @for jmGradient
	 * @param {string} s 渐变字符串
	 */
	fromString(s) {
		if(!s) {
			console.warn('jmGradient: 渐变字符串为空');
			return;
		}
		const gradientMatch = s.match(/(linear|radial)-gradient\s*\(\s*(.+)\)/i);
		if(!gradientMatch || gradientMatch.length < 3) {
			console.warn('jmGradient: 无效的渐变字符串格式: "' + s + '"');
			return;
		}

		const type = gradientMatch[1].toLowerCase();
		if(type !== 'linear' && type !== 'radial') {
			console.warn('jmGradient: 不支持的渐变类型 "' + type + '"，仅支持 linear 和 radial');
			return;
		}

		this.type = type;
		const content = jmUtils.trim(gradientMatch[2]);

		const splitIndex = this._findSplitIndex(content);
		if(splitIndex < 0) {
			console.warn('jmGradient: 无法解析渐变内容: "' + content + '"');
			return;
		}

		const params = content.substring(0, splitIndex).trim();
		const colorPart = content.substring(splitIndex + 1).trim();

		if(!colorPart) {
			console.warn('jmGradient: 未找到颜色停止点');
			return;
		}

		if(this.type === 'linear') {
			this._parseLinearParams(params);
		}
		else {
			this._parseRadialParams(params);
		}

		const colorCount = this._parseColorStops(colorPart);
		if(colorCount === 0) {
			console.warn('jmGradient: 未找到有效的颜色停止点: "' + colorPart + '"');
		}
		else if(colorCount < 2) {
			console.warn('jmGradient: 颜色停止点至少需要2个，当前只有 ' + colorCount + ' 个');
		}
	}

	/**
	 * 找到参数和颜色的分割位置（第一个不在括号内的逗号）
	 * @param {string} content 内容字符串
	 * @returns {number} 分割位置索引
	 */
	_findSplitIndex(content) {
		let depth = 0;

		for(let i = 0; i < content.length; i++) {
			const char = content[i];
			if(char === '(') {
				depth++;
			}
			else if(char === ')') {
				depth--;
			}
			else if(char === ',' && depth === 0) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * 验证渐变配置是否有效
	 * @returns {boolean} 是否有效
	 */
	isValid() {
		if(!this.type) return false;
		if(this.type === 'linear') {
			return typeof this.x1 !== 'undefined' ||
				   typeof this.x2 !== 'undefined' ||
				   typeof this._angle !== 'undefined';
		}
		if(this.type === 'radial') {
			return this.stops && this.stops.length >= 2;
		}
		return false;
	}

	/**
	 * 解析线性渐变参数
	 * @param {string} params 参数字符串
	 */
	_parseLinearParams(params) {
		const trimmed = jmUtils.trim(params);

		if(trimmed.startsWith('to ')) {
			const direction = trimmed.substring(3).toLowerCase().trim();
			const dir = this._directionToAngle(direction);
			this._angle = dir.angle;
			this.x1 = dir.x1;
			this.y1 = dir.y1;
			this.x2 = dir.x2;
			this.y2 = dir.y2;
		}
		else if(this._hasAngleUnit(trimmed)) {
			const angle = this._parseAngle(trimmed);
			this._angle = angle;
			const coords = this._angleToCoords(angle);
			this.x1 = coords.x1;
			this.y1 = coords.y1;
			this.x2 = coords.x2;
			this.y2 = coords.y2;
		}
		else if(trimmed.startsWith('at ')) {
			const radialMatch = trimmed.match(/at\s+(.+)/i);
			if(radialMatch) {
				this._parseRadialParams(trimmed);
			}
		}
		else {
			const parts = trimmed.split(/\s+/);
			if(parts.length >= 4) {
				this.x1 = parts[0];
				this.y1 = parts[1];
				this.x2 = parts[2];
				this.y2 = parts[3];
			}
			else if(parts.length === 2) {
				this.x1 = 0;
				this.y1 = 0;
				this.x2 = parts[0];
				this.y2 = parts[1];
			}
		}
	}

	/**
	 * 解析径向渐变参数
	 * @param {string} params 参数字符串
	 */
	_parseRadialParams(params) {
		const trimmed = jmUtils.trim(params);

		this.shape = 'ellipse';
		this.position = { x: '50%', y: '50%' };

		const atMatch = trimmed.match(/^(.+?)\s+at\s+(.+)$/i);
		if(atMatch) {
			const shapePart = jmUtils.trim(atMatch[1]);
			const posPart = jmUtils.trim(atMatch[2]);
			this._parseRadialShape(shapePart);
			this._parseRadialPosition(posPart);
		}
		else if(trimmed.startsWith('circle') || trimmed.startsWith('ellipse')) {
			this._parseRadialShape(trimmed);
			this.x1 = '50%';
			this.y1 = '50%';
			this.x2 = '50%';
			this.y2 = '50%';
		}
		else {
			const parts = trimmed.split(/\s+/);
			if(parts.length >= 3) {
				this.x1 = parts[0];
				this.y1 = parts[1];
				this.r1 = parts[2];
			}
			if(parts.length >= 6) {
				this.x2 = parts[3];
				this.y2 = parts[4];
				this.r2 = parts[5];
			}
		}

		if(this.x1 === undefined && this.y1 === undefined) {
			this.x1 = '50%';
			this.y1 = '50%';
		}
		if(this.x2 === undefined && this.y2 === undefined) {
			this.x2 = '50%';
			this.y2 = '50%';
		}
		if(this.r2 === undefined) {
			this.r2 = '50%';
		}
	}

	/**
	 * 解析径向渐变形状
	 * @param {string} shapePart 形状描述
	 */
	_parseRadialShape(shapePart) {
		if(shapePart.startsWith('circle')) {
			this.shape = 'circle';
			const sizeMatch = shapePart.match(/circle\s*\(\s*([^)]+)\s*\)/i);
			if(sizeMatch) {
				this.r2 = jmUtils.trim(sizeMatch[1]);
			}
		}
		else if(shapePart.startsWith('ellipse')) {
			this.shape = 'ellipse';
			const sizeMatch = shapePart.match(/ellipse\s*\(\s*([^)]+)\s*\)/i);
			if(sizeMatch) {
				const sizes = jmUtils.trim(sizeMatch[1]).split(/\s+/);
				if(sizes.length >= 2) {
					this.rx = sizes[0];
					this.ry = sizes[1];
				}
			}
		}
	}

	/**
	 * 解析径向渐变位置
	 * @param {string} posPart 位置描述
	 */
	_parseRadialPosition(posPart) {
		const parts = posPart.split(/\s+/);
		if(parts.length >= 2) {
			this.x1 = parts[0];
			this.y1 = parts[1];
			this.x2 = parts[0];
			this.y2 = parts[1];
		}
	}

	/**
	 * 解析颜色停止点
	 * @param {string} colorPart 颜色部分字符串
	 * @returns {number} 成功解析的颜色数量
	 */
	_parseColorStops(colorPart) {
		if(!colorPart) {
			return 0;
		}

		const stops = this._splitColorStops(colorPart);
		let lastOffset = -1;
		let colorCount = 0;

		for(let i = 0; i < stops.length; i++) {
			const stop = jmUtils.trim(stops[i]);
			if(!stop) continue;

			const parsed = this._parseSingleColorStop(stop);
			if(!parsed) {
				continue;
			}

			let { color, offset } = parsed;

			if(color === 'transparent') {
				color = 'rgba(0,0,0,0)';
			}

			if(!this._isValidColor(color)) {
				console.warn('jmGradient: 无效的颜色格式 "' + color + '"');
				continue;
			}

			const normalizedOffset = this._normalizeOffset(offset);
			let finalOffset = normalizedOffset;

			if(finalOffset === null) {
				if(i === 0) {
					finalOffset = 0;
				}
				else if(i === stops.length - 1) {
					finalOffset = 1;
				}
				else {
					const nextOffset = this._findNextOffset(stops, i);
					if(nextOffset !== null) {
						finalOffset = (lastOffset + nextOffset) / 2;
					}
					else {
						finalOffset = Math.min(1, lastOffset + (1 - lastOffset) / (stops.length - i));
					}
				}
			}

			if(finalOffset !== null) {
				if(finalOffset < 0 || finalOffset > 1) {
					console.warn('jmGradient: 颜色偏移量 ' + finalOffset + ' 超出有效范围 [0, 1]，将调整为有效范围');
					finalOffset = Math.max(0, Math.min(1, finalOffset));
				}
				lastOffset = finalOffset;
				this.addStop(finalOffset, color);
				colorCount++;
			}
		}

		return colorCount;
	}

	/**
	 * 分割颜色停止点字符串
	 * @param {string} colorPart 颜色部分字符串
	 * @returns {string[]} 颜色停止点数组
	 */
	_splitColorStops(colorPart) {
		const stops = [];
		let depth = 0;
		let current = '';

		for(let i = 0; i < colorPart.length; i++) {
			const char = colorPart[i];
			if(char === '(') {
				depth++;
				current += char;
			}
			else if(char === ')') {
				depth--;
				current += char;
			}
			else if(char === ',' && depth === 0) {
				stops.push(current.trim());
				current = '';
			}
			else {
				current += char;
			}
		}

		if(current.trim()) {
			stops.push(current.trim());
		}

		return stops;
	}

	/**
	 * 解析单个颜色停止点
	 * @param {string} stop 单个颜色停止点字符串
	 * @returns {object|null} {color, offset} 或 null
	 */
	_parseSingleColorStop(stop) {
		const hexMatch = stop.match(/^(#[a-fA-F0-9]{3,8})\s*(\d+(?:\.\d+)?%?)?$/i);
		if(hexMatch) {
			return { color: hexMatch[1], offset: hexMatch[2] || null };
		}

		const rgbaMatch = stop.match(/^(rgba?\s*\([^)]+\))\s*(\d+(?:\.\d+)?%?)?$/i);
		if(rgbaMatch) {
			return { color: rgbaMatch[1], offset: rgbaMatch[2] || null };
		}

		const hslaMatch = stop.match(/^(hsla?\s*\([^)]+\))\s*(\d+(?:\.\d+)?%?)?$/i);
		if(hslaMatch) {
			return { color: hslaMatch[1], offset: hslaMatch[2] || null };
		}

		const namedMatch = stop.match(/^([a-zA-Z]+)\s*(\d+(?:\.\d+)?%?)?$/i);
		if(namedMatch && this._isValidColor(namedMatch[1])) {
			return { color: namedMatch[1], offset: namedMatch[2] || null };
		}

		return null;
	}

	/**
	 * 查找下一个有偏移量的颜色停止点
	 * @param {string[]} stops 颜色停止点数组
	 * @param {number} currentIndex 当前索引
	 * @returns {number|null} 下一个偏移量或null
	 */
	_findNextOffset(stops, currentIndex) {
		for(let i = currentIndex + 1; i < stops.length; i++) {
			const parsed = this._parseSingleColorStop(jmUtils.trim(stops[i]));
			if(parsed && parsed.offset) {
				return this._normalizeOffset(parsed.offset);
			}
		}
		return null;
	}

	/**
	 * 验证颜色格式是否有效
	 * @param {string} color 颜色字符串
	 * @returns {boolean} 是否有效
	 */
	_isValidColor(color) {
		if(!color) return false;

		const hexPattern = /^#([a-fA-F0-9]{3,8})$/;
		if(hexPattern.test(color)) return true;

		const rgbPattern = /^rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*[\d.]+\s*)?\)$/i;
		if(rgbPattern.test(color)) return true;

		const hslPattern = /^hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(,\s*[\d.]+\s*)?\)$/i;
		if(hslPattern.test(color)) return true;

		const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'white', 'black', 'cyan', 'magenta', 'gray', 'grey', 'brown', 'navy', 'teal', 'olive', 'maroon', 'silver', 'lime', 'aqua', 'fuchsia', 'violet', 'indigo', 'gold', 'silver', 'transparent'];
		if(namedColors.includes(color.toLowerCase())) return true;

		return false;
	}

	/**
	 * 标准化偏移值
	 * @param {string} offset 偏移字符串
	 * @returns {number|null} 0-1之间的数值或null
	 */
	_normalizeOffset(offset) {
		if(!offset) return null;
		offset = jmUtils.trim(offset);
		if(offset.endsWith('%')) {
			return parseFloat(offset) / 100;
		}
		const num = parseFloat(offset);
		if(isNaN(num)) return null;
		if(num > 1) {
			return num / 100;
		}
		return num;
	}

	/**
	 * 检查字符串是否包含角度单位
	 * @param {string} str 待检查字符串
	 * @returns {boolean}
	 */
	_hasAngleUnit(str) {
		return /^-?\d+(\.\d+)?\s*(deg|rad|grad|turn)$/i.test(str);
	}

	/**
	 * 解析角度值
	 * @param {string} angleStr 角度字符串
	 * @returns {number} 弧度值
	 */
	_parseAngle(angleStr) {
		angleStr = jmUtils.trim(angleStr);
		const match = angleStr.match(/^(-?\d+(\.\d+)?)\s*(deg|rad|grad|turn)?$/i);
		if(!match) return 0;

		let value = parseFloat(match[1]);
		const unit = (match[3] || 'deg').toLowerCase();

		switch(unit) {
			case 'deg':
				return value * Math.PI / 180;
			case 'rad':
				return value;
			case 'grad':
				return value * Math.PI / 200;
			case 'turn':
				return value * 2 * Math.PI;
			default:
				return value * Math.PI / 180;
		}
	}

	/**
	 * 将角度转换为起点和终点坐标
	 * @param {number} angle 弧度值
	 * @returns {object} 坐标对象
	 */
	_angleToCoords(angle) {
		const x = Math.cos(angle);
		const y = -Math.sin(angle);

		return {
			x1: Math.round((0.5 - x * 0.5) * 1000) / 1000,
			y1: Math.round((0.5 + y * 0.5) * 1000) / 1000,
			x2: Math.round((0.5 + x * 0.5) * 1000) / 1000,
			y2: Math.round((0.5 - y * 0.5) * 1000) / 1000
		};
	}

	/**
	 * 将方向关键词转换为角度和坐标
	 * @param {string} direction 方向描述
	 * @returns {object} 包含angle和坐标的对象
	 */
	_directionToAngle(direction) {
		const directions = {
			'to top': { angle: 0, x1: '50%', y1: '100%', x2: '50%', y2: '0%' },
			'to bottom': { angle: Math.PI, x1: '50%', y1: '0%', x2: '50%', y2: '100%' },
			'to left': { angle: -Math.PI / 2, x1: '100%', y1: '50%', x2: '0%', y2: '50%' },
			'to right': { angle: Math.PI / 2, x1: '0%', y1: '50%', x2: '100%', y2: '50%' },
			'to top left': { angle: -Math.PI * 3 / 4, x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
			'to top right': { angle: -Math.PI / 4, x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
			'to bottom left': { angle: Math.PI * 3 / 4, x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
			'to bottom right': { angle: Math.PI / 4, x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
			'top': { angle: 0, x1: '50%', y1: '100%', x2: '50%', y2: '0%' },
			'bottom': { angle: Math.PI, x1: '50%', y1: '0%', x2: '50%', y2: '100%' },
			'left': { angle: -Math.PI / 2, x1: '100%', y1: '50%', x2: '0%', y2: '50%' },
			'right': { angle: Math.PI / 2, x1: '0%', y1: '50%', x2: '100%', y2: '50%' }
		};

		const dir = directions[direction];
		if(dir) {
			return dir;
		}

		const keywordMatch = direction.match(/to\s+(top|bottom|left|right)/i);
		if(keywordMatch) {
			const mainDir = keywordMatch[1].toLowerCase();
			const secDir = direction.replace(keywordMatch[0], '').trim();
			if(secDir) {
				const combined = `to ${mainDir} ${secDir}`;
				if(directions[combined]) {
					return directions[combined];
				}
			}
		}

		return { angle: 0, x1: '50%', y1: '100%', x2: '50%', y2: '0%' };
	}

	/**
	 * 转换为渐变的字符串表达
	 *
	 * @method toString
	 * @for jmGradient
	 * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
	 */
	toString() {
		let str = this.type + '-gradient(';
		if(this.type == 'linear') {
			str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
		}
		else {
			str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
		}
		//颜色渐变
		this.stops.each(function(i,s) {	
			str += ',' + s.color + ' ' + s.offset;
		});
		return str + ')';
	}
}

export { jmGradient };



