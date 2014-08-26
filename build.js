var fs = require('fs'); 
var jsp = require("../../nodejs/lib/uglify-js/uglify-js").parser; 
var pro = require("../../nodejs/lib/uglify-js/uglify-js").uglify; 

function build(files, fileOut) { 
	var code = '';
	for(var i=0;i<files.length;i++) {
		var origCode = fs.readFileSync(files[i], 'utf8'); 
		code += origCode;
	}
	
	var ast = jsp.parse(code); 
	ast = pro.ast_mangle(ast); 
	ast = pro.ast_squeeze(ast);
	var mincode = pro.gen_code(ast); 
	fs.writeFileSync(fileOut + '.min.js', mincode, 'utf8'); 
	fs.writeFileSync(fileOut + '.debug.js', code, 'utf8'); 
	console.log('build to ' +fileOut + ' complete');
}

var base = __dirname + '/src/';
var js = [
			base + 'common/jmUtils.js',
			base + 'models/jmGradient.js',
            base + 'models/jmShadow.js',
            //base + 'lib/raphael-min.js',
            //base + 'common/jmSvg.js',
            base + 'common/jmObject.js',
			base + 'common/jmProperty.js',
			base + 'common/jmEvents.js',
			base + 'common/jmControl.js',			
			base + 'shapes/jmShape.js',
			base + 'shapes/jmPath.js',
			base + 'shapes/jmLine.js',
			base + 'shapes/jmCircle.js',
			base + 'shapes/jmArc.js',
			base + 'shapes/jmHArc.js',
			base + 'shapes/jmPrismatic.js',
			base + 'shapes/jmBezier.js',
			base + 'shapes/jmRect.js',
			base + 'shapes/jmArraw.js',					
			base + 'controls/jmLabel.js',
			base + 'controls/jmImage.js',
			base + 'controls/jmResize.js',
			base + 'controls/jmArrawLine.js',
            base + 'controls/jmTooltip.js',
			base + 'jmGraph.js',
			base + 'editor/jmCell.js',
            base + 'editor/jmConnectLine.js',
			base + 'editor/jmEditor.js'
			]; 
build(js,__dirname + '/src/jmgraph');



/*
* Compressor for Metro UI CSS
* Require:
* node.js
* node-minify (https://github.com/srod/node-minify)
* */
/*
var compressor = require('node-minify');
var project_root = '/Projects/Metro-UI-CSS/',
    module_path = project_root+'docs/js/metro/',
    css_path = project_root+'docs/css/',
    js_compile_path = project_root+'min/',
    css_compile_path = project_root+'min/';

var modules = [
    module_path+'metro-global.js',
    module_path+'metro-core.js',
    module_path+'metro-locale.js',
    module_path+'metro-touch-handler.js',
    module_path+'metro-accordion.js',
    module_path+'metro-button-set.js',
    module_path+'metro-date-format.js',
    module_path+'metro-calendar.js',
    module_path+'metro-datepicker.js',
    module_path+'metro-carousel.js',
    module_path+'metro-countdown.js',
    module_path+'metro-dropdown.js',
    module_path+'metro-input-control.js',
    module_path+'metro-live-tile.js',
    module_path+'metro-drag-tile.js',
    module_path+'metro-progressbar.js',
    module_path+'metro-rating.js',
    module_path+'metro-slider.js',
    module_path+'metro-tab-control.js',
    module_path+'metro-table.js',
    module_path+'metro-times.js',
    module_path+'metro-dialog.js',
    module_path+'metro-notify.js',
    module_path+'metro-listview.js',
    module_path+'metro-treeview.js',
    module_path+'metro-fluentmenu.js',
    module_path+'metro-hint.js',
    module_path+'metro-streamer.js',
    module_path+'metro-scroll.js',
    module_path+'metro-stepper.js',
    module_path+'metro-pull.js',
    module_path+'metro-wizard.js',
    module_path+'metro-panel.js',
    module_path+'metro-tile-transform.js',
    module_path+'metro-initiator.js',
];

new compressor.minify({
    type: 'gcc',
    language: 'ECMASCRIPT5',
    fileIn: modules,
    fileOut: js_compile_path+'metro.min.js',
    callback: function(err, min){
        if (err) console.log(err); else console.log("js compiled");
    }
});

new compressor.minify({
    type: 'yui-css',
    fileIn: css_path+'metro-bootstrap.css',
    fileOut: css_compile_path+'metro-bootstrap.min.css',
    callback: function(err, min){
        if (err) console.log(err); else console.log("main css compiled");
    }
});

new compressor.minify({
    type: 'yui-css',
    fileIn: css_path+'metro-bootstrap-responsive.css',
    fileOut: css_compile_path+'metro-bootstrap-responsive.min.css',
    callback: function(err, min){
        if (err) console.log(err); else console.log("responsive css compiled");
    }
});

new compressor.minify({
    type: 'yui-css',
    fileIn: css_path+'iconFont.css',
    fileOut: css_compile_path+'iconFont.min.css',
    callback: function(err, min){
        if (err) console.log(err); else console.log("icon font css compiled");
    }
});

*/