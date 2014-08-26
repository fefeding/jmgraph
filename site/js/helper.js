
$(function() {
	$(window).bind('popstate',function(e) {
		return helper.redirect(location.pathname);
	});
	$('#content').html($('#content').html().replace(/~\//g,helper.root + '/'));
});

/**
 * 页面辅助类
 *
 * @class helper
 * @static
 */
var helper = {
	root: 'http://localhost',
	pageCache: {},
	convertUrl: function(url) {
		var rootIndex = url.indexOf('~/');
		if(rootIndex >= 0) {
			url = this.root + url.substring(rootIndex + 1);
		}
		else if(url.indexOf('/') == 0) {
			url = this.root + url;
		}
		return url;
	},
	decodeContent: function(content) {
		var ms = content.match(/\<!--\s+content start\s+--\>[\s\S]*\<!--\s+content end\s+--\>/i);
		if(ms) {
			content = ms[0];
		}
		return content.replace(/~\//g,this.root + '/');
	},
	navTo: function(lnk) {
		var url = lnk.href;
		this.redirect(url,function() {
			$('#nav a').toggleClass('current',false);
			lnk.className = 'current';
		});
		return false;
	}
};

/**
 * 页面跳转,当浏览器支持pushState时，采用单页面形式，否则直接跳 转
 *
 * @method redirect
 * @param {string} url 目标地址
 */
helper.redirect = function(url,callback) {
	if(typeof url == 'object') {
		url = url.href;
	}
	//if(url == location.href || url == location.pathname) return;
	url = helper.convertUrl(url);

	if(window.history.pushState) {
		window.history.pushState(null,"",url);
	}
	else {
		window.location.href = '#!' + url;
	}
	if(helper.pageCache[url]) {
		$('#content').html(helper.pageCache[url]);
	}
	else {
		$.ajax({
			type: 'get',
			cache: false,
			url: url,
			success:function(html) {
				html = helper.decodeContent(html);
				$('#content').html(html);
				helper.pageCache[url] = html;
				if(callback) {
					callback();
				}	
			},
			error: function(e) {
				$('#content').html(e.status);
				if(callback) {
					callback();
				}	
			}
		});
	}
	return false;
}