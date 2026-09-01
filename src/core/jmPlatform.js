/**
 * @fileoverview jmPlatform 平台适配层
 * 
 * 抽象浏览器、微信小程序、Node(测试) 等运行环境的差异，
 * 避免 document/wx 等全局对象散落在业务代码中。
 * 
 * @module jmPlatform
 * @author jmGraph Team
 * @license MIT
 */
export default class jmPlatform {

	/**
	 * 判断当前是否为微信小程序环境
	 * @return {boolean}
	 */
	static isWX() {
		return typeof wx !== 'undefined' && wx.canIUse && wx.canIUse('canvas');
	}

	/**
	 * 获取全局 document（不存在时返回 null）
	 * @return {Document|null}
	 */
	static getDocument() {
		return typeof document !== 'undefined' ? document : null;
	}

	/**
	 * 获取全局 window（不存在时返回 null）
	 * @return {Window|null}
	 */
	static getWindow() {
		return typeof window !== 'undefined' ? window : null;
	}

	/**
	 * 获取设备像素比
	 * @return {number}
	 */
	static getDevicePixelRatio() {
		if(jmPlatform.isWX()) {
			try {
				return wx.getWindowInfo().pixelRatio || 1;
			}
			catch(e) {
				try { return wx.getSystemInfoSync().pixelRatio || 1; }
				catch(e2) { return 1; }
			}
		}
		const win = jmPlatform.getWindow();
		return win && win.devicePixelRatio > 1 ? win.devicePixelRatio : 1;
	}

	/**
	 * 通过 id 或元素本身解析 canvas 元素
	 * @param {HTMLElement|string} canvas canvas 元素或元素 id
	 * @return {HTMLElement|null}
	 */
	static resolveCanvas(canvas) {
		const doc = jmPlatform.getDocument();
		if(typeof canvas === 'string' && doc) {
			return doc.getElementById(canvas);
		}
		if(canvas && canvas.length && !canvas.getContext) {
			return canvas[0];
		}
		return canvas;
	}

	/**
	 * 创建一个 canvas 元素（在 DOM 环境）
	 * @return {HTMLElement|null}
	 */
	static createCanvas() {
		const doc = jmPlatform.getDocument();
		return doc ? doc.createElement('canvas') : null;
	}

	/**
	 * 创建 blob URL（DOM 环境）
	 * @param {Blob} blob
	 * @return {string}
	 */
	static createObjectURL(blob) {
		const win = jmPlatform.getWindow();
		return win && win.URL ? win.URL.createObjectURL(blob) : '';
	}

	/**
	 * 释放 blob URL（DOM 环境）
	 * @param {string} url
	 */
	static revokeObjectURL(url) {
		const win = jmPlatform.getWindow();
		if(win && win.URL) win.URL.revokeObjectURL(url);
	}

	/**
	 * 触发浏览器文件下载
	 * @param {string} url 文件 URL 或 Data URL
	 * @param {string} fileName 文件名（含扩展名）
	 */
	static download(url, fileName) {
		const doc = jmPlatform.getDocument();
		if(!doc) return;
		const link = doc.createElement('a');
		link.href = url;
		link.download = fileName;
		doc.body.appendChild(link);
		link.click();
		doc.body.removeChild(link);
	}
}

export { jmPlatform };
