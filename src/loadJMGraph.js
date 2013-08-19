/**
 * 加载整个组件依赖
 *
 * @method load
 * @for jmGraph
 * @param {function} [callback] 回调函数callback为成功或失败后回调
 */
loadJMGraph = function(base,callback,debug) {
    if(typeof callback == 'boolean') {
        debug = callback;
    }
    if(typeof base == 'function') {
        callback = base;
        base = "";
    }
    
   
	if(!base) {
        var sc = document.getElementById('jmgraph');
        if(sc) {
            var graphindex = sc.src.indexOf('loadJMGraph.js');
            if(graphindex >= 0) {
                base = sc.src.substring(0,graphindex);
            }
        }
        else {
        	//获取当前graph路径
            sc = document.getElementsByTagName('script');
            for(var i =0; i < sc.length;i++) {
                var src = sc[i].src;
                var graphindex = src.indexOf('loadJMGraph.js');
                if(graphindex >= 0) {
                    base = src.substring(0,graphindex);
                    break;
                }
            }
        }
    }
    
    if(debug) {
        var js = [
            base + 'jmgraph.debug.js'
        ];
        /*[
    			base + 'common/jmUtils.js',
    			base + 'models/jmGradient.js',
                base + 'models/jmShadow.js',
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
    			];*/
    }
    else {
        var js = [
            base + 'jmgraph.min.js',
        ];
    }
    if (/msie/i.test(navigator.userAgent)) {        
        var ieinfo = navigator.userAgent.match(/msie\s+\d+(\.\d+)*/i)[0];
        var ver = ieinfo.match(/\d+(\.\d+)*/)[0];
        if(ver < 9) {
        	js.push(base + 'lib/raphael-min.js');
        	js.push(base + 'common/jmSvg.js');
        }
    }
	require(js,function() {				
				if(callback) setTimeout(callback,10);
			});	
}

/**
 * 加载js文件
 * 
 * @method require
 * @for jmGraph
 * @param {string} js 需要加载的JS的路径
 * @param {function} [callback] 回调函数callback为成功或失败后回调
 */
function require(js,callback) {
    if(typeof(js) !== 'string') {
        var loaded = js.length;	        
        if(loaded > 0) {
        	var jsindex = 0;
        	function requireCallback(j,err) {
        		if(err) {
                    if(callback) callback(j,err);
                }
                else {
                    jsindex++;
                    if(loaded == jsindex) {
                        if(callback) callback(loaded);
                    }
                    else {
                        var src = js[jsindex];
                        if(src) {
                            require(src,requireCallback);
                        }
                    	else {
                            requireCallback();
                        }
                    }
                }
        	}
        	require(js[jsindex],requireCallback);
        }	        
    }
    else {
        //获取所有已加载的js标记
        var sc = document.getElementsByTagName('script');
        for(var i in sc) {
            //如果已加载则直接返回成功
            if(sc[i].src === js) {
                if(callback) callback(js);
                return;
            }
        }
        //创建script，加载js
        sc = document.createElement('script');
        sc.type= 'text/javascript';
        sc.charset = 'utf-8';
        sc.src = js;
        //append到head中
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(sc);

        if(callback) {
        	function loadCallback(e) {
	            if(this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete') {
	                return;
	            }
	            if(callback) callback(js);
	        }
	        //加载回调
	        if(sc.readyState) {
	        	sc.onreadystatechange = loadCallback;
	        }
        	else {
        		sc.onload = loadCallback;
        	}		        
        }
        
        //加载失败
        sc.onerror = function() {
            head.removeChild(sc);
            if(callback) callback(js,'load faild');
        }        
    }
}