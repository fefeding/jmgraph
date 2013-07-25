define(function(require,exports,module) {
	
	var jmUtils = require('../src/common/jmUtils');
	var jmGraph = require('../src/jmGraph');	
	var jmEditor = require('../src/editor/jmEditor');	
	
	module.exports = {
		'jmUtils':jmUtils,
		'jmGraph':jmGraph,
		'jmEditor':jmEditor
	}
});