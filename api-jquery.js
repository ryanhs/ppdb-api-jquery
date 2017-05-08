(function(g, a){
	// js platform detector

	if(typeof define === "function" && define.amd){
		// AMD module
		define('API', [], function(){ return a(); });
	}else{
		g.API = a();
	}

})(this, (function(){

	/*
	 * -----------------------------------------
	 *  VLORO - C Framework 2.0
	 *
	 *  by Ryan hs <mr.ryansilalahi@gmail.com>
	 * -----------------------------------------
	 *
	 * DESCRIPTION
	 * 		This simple class for accessing vloro API.
	 * 		for more documentation please see ppdb gitlab:
	 *
	 * LICENSE
	 * 		MIT
	 *
	 * REQUIREMENT
	 * 		JQuery 1.3+
	 *
	 * USAGE EXAMPLE
	 *
	 * 		API.get({
	 *			method: "category.select"
	 *		}, function(d){ // on success
	 *			console.log('suc: ' + JSON.stringify(d));
	 *
	 *		}, function(d){ // on error
	 *			console.log('err: ' + JSON.stringify(d));
	 *		});
	 *
	 *
	 * 		API.get({
	 *			method: "post.get",
	 * 			params: {
	 * 				id: API._GET('post_id')
	 * 			}
	 *		}, function(d){ // on success
	 *			console.log('suc: ' + JSON.stringify(d));
	 *
	 *		}, function(d){ // on error
	 *			console.log('err: ' + JSON.stringify(d));
	 *		});
	 *
	 */

	// local scope variable definition
	var url = 'http://api.dev.ppdbkotabandung.web.dev/json',
        n = 'undefined',
		qs = {},
		expireCache = 1, // 1 minutes
		enableCache = true,
		enableDebug = true,
		enableAsync = false;

	// parse query string
	(function () {
		var e, a = /\+/g,
			r = /([^&=]+)=?([^&]*)/g,
			d = function (s) {
				return decodeURIComponent(s.replace(a, / /g))
			},
			q = window.location.search.substring(1);
		while(e = r.exec(q)) qs[d(e[1])] = d(e[2])
	})();


	// API class
	var API = {

		name: "api-accessor",
		version: "1.2.0",

		_GET: function (w) {
            return(w in qs) ? qs[w] : n
        },

		cache: function (enable, expire) {
			if (typeof enable !== 'undefined') enableCache = enable;
			if (typeof expire !== 'undefined') expireCache = expire;

			return enableCache;
		},

		debug: function (enable) {
			if (typeof enable !== 'undefined') enableDebug = enable;
			return enableDebug;
		},

		async: function (enable) {
			if (typeof enable !== 'undefined') enableAsync = enable;
			return enableAsync;
		},

		setUrl: function(newUrl){
			url = newUrl;
		},

		getUrl: function(){
			return url;
		},

		get: function(method_params, onSuccess, onError){
			data = {
				jsonrpc	: "2.0",
				method	: method_params.method,
				params	: {}
			};

			if(typeof method_params.params != 'undefined')
				data.params = method_params.params;

			if (enableCache) {
				var cacheKey = JSON.stringify(data);
				var cacheValue = lscache.get(cacheKey);
				if (cacheValue !== null) {
					if (enableDebug) console.log('API: load from cache: ' + cacheKey);
					onSuccess(JSON.parse(LZString.decompress(cacheValue)));
					return;
				}
			}

			var req = JSON.stringify(data);
			console.log(req);
			//~ return;

			if (enableDebug) console.log('API: request: ' + req);
			$.ajax({
				async: enableAsync,
				url: url,
				method: "POST",
				data: req
			}).done(function(res){

				if(typeof res.error != 'undefined' && typeof onError == 'function'){
					if (enableDebug) console.log('API: error: ' + req);
					onError(res.error);
					return;
				}

				if(typeof res.result != 'undefined' && typeof onSuccess == 'function'){
					if (enableCache) {
						cacheValue = LZString.compress(JSON.stringify(res.result));
						lscache.set(cacheKey, cacheValue, expireCache);
						if (enableDebug) console.log('API: save to cache ('+expireCache+' m): ' + req);
					}

					if (enableDebug) console.log('API: received: ' + req);
					onSuccess(res.result)
					return;
				}


			});

		},

	};

	return API;
}));
