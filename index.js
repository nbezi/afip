'use strict';

var wsaa = require(__dirname + '/lib/wsaa');

var afip = {
	wsbusiness: function(options, callback) {
		if (!options) {
			options = {};
		}

		if (!options.serviceClass) {
			options.serviceClass = 'wsfev1';
		}

		var clientInstance = require(__dirname + '/lib/' + options.serviceClass).getInstance(options, callback);
		clientInstance.setWsVersion(options.serviceClass);
	},
	wsaa: function(options, callback) {
		return wsaa.getInstance(options, callback);
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
