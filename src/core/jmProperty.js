
import {jmUtils} from "./jmUtils.js";
import { jmObject } from "./jmObject.js";

const PROPERTY_KEY = Symbol("properties");

export default class jmProperty extends jmObject {
	constructor(params) {
		super();
		this[PROPERTY_KEY] = {};
		if(params && params.mode) this.mode = params.mode;
	}

	property(...pars) {
		if(pars) {
			const pros = this[PROPERTY_KEY];
			const name = pars[0];
			if(pars.length > 1) {
				const value = pars[1];
				const args = {oldValue: pros[name], newValue: value};
				pros[name] = pars[1];
				if(this.emit) this.emit('propertyChange', name, args);
				return pars[1];
			}
			else if(name) {
				return pros[name];
			}
		}
	}

	get needUpdate() {
		return this.property('needUpdate');
	}
	set needUpdate(v) {
		this.property('needUpdate', v);
		if(v && !this.is('jmGraph') && this.graph) {
			this.graph.needUpdate = true;
		}
	}

	get graph() {
		let g = this.property('graph');
		g = g || (this.property('graph', this.findParent('jmGraph')));
		return g;
	}
	set graph(v) {
		return this.property('graph', v);
	}

	get mode() {
		let m = this.property('mode');
		if(m) return m;
		else if(this.is('jmGraph')) return this.property('mode');
		return this.graph.mode;
	}
	set mode(v) {
		return this.property('mode', v);
	}

	requestAnimationFrame(handler) {
		return jmUtils.requestAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}

	cancelAnimationFrame(handler) {
		return jmUtils.cancelAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}
}

export { jmProperty };


