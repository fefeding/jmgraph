/**
 * 图型基础类
 *
 * @class jmShape
 * @for jmGraph
 */

function jmShape(graph) {
	/**
	 * 当前对象类型名 jmShape
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmShape';
	
	/**
	 * 当前画布
	 *
	 * @property type
	 * @type jmGraph
	 */
	this.graph = graph;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmShape,jmControl);

