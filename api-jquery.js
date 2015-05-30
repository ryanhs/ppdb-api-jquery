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
		qs = {};
	
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
		version: "1.0.0-Beta1",		
		
		_GET: function (w) {
            return(w in qs) ? qs[w] : n
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
			
			var req = JSON.stringify(data);
			//console.log(req);
			//return;
			
			$.ajax({
				async: false,
				url: url,
				method: "POST",
				data: req
			}).done(function(res){
								
				if(typeof res.error != 'undefined' && typeof onError == 'function'){
					onError(res.error);
					return;
				}
					
				if(typeof res.result != 'undefined' && typeof onSuccess == 'function'){
					onSuccess(res.result)
					return;
				}
				
				
			});
			
		},		
		
	};
	
	return API;
}));
