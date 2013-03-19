/**
* 图型基础类
*/

var jmShape = (function(context) {	
	function __constructor(graph) {
		this.initializing(graph.context,style);
		this.graph = graph;
	}

	jmUtils.extend(__constructor,jmControl);
	return __constructor;
})();
