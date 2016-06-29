'use strict';

var wsaa = require('./lib/wsaa');
var wsservice = require('./lib/wsservice');

var afip = {
	wsbusiness: function(options, callback) {
		var clientInstance = wsservice.getInstance(options || {}, callback);
	},
	wsaa: function(options, callback) {
		wsaa.getInstance(options || {}, callback);
	},
	initSession: function(options, callback) {
		this.wsaa(options, (err, wsaa) => {
			if (err) callback(err);
			else wsaa.getCredentials((err, data) => {
				if (err) {
					callback(err);
					return;
				}
				options.token = data.token;
				options.sign = data.sign;
				options.cuit = data.cuit;
				this.wsbusiness(options, callback);
			});
		});
	}
}

module.exports = afip;
