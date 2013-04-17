/**
 * 图型基础类
 *
 * @class jmShape
 * @for jmGraph
 * @module jmGraph
 */

var jmShape = (function(context) {	
	function __constructor(graph) {
		/**
		 * 当前对象类型名 jmShape
		 *
		 * @property type
		 * @type string
		 */
		this.type = 'jmShape';
		this.initializing(graph.context,style);
		/**
		 * 当前画布
		 *
		 * @property type
		 * @type jmGraph
		 */
		this.graph = graph;
	}

	jmUtils.extend(__constructor,jmControl);
	return __constructor;
})();
