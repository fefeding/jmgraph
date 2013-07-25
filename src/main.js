
/**
 * 用于加载jmgraph主入口
 */
define(function(require,exports,module) {
    
    var jmUtils = require('./common/jmUtils');
    var jmGraph = require('./jmGraph');    
    var jmEditor = require('./editor/jmEditor');   
    
    module.exports = {
        'jmUtils':jmUtils,
        'jmGraph':jmGraph,
        'jmEditor':jmEditor
    }
});