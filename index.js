'use strict';

module.exports.wsfe = (options, callback) => {
	if (!options) {
		options = {};
	}

	if (!options.wsfeVersion) {
		options.wsfeVersion = 'wsfev1';
	}

	var clientInstance = require(__dirname + '/lib/' + options.wsfeVersion).getInstance(options, callback);
	clientInstance.setWsfeVersion(options.wsfeVersion);
}

module.exports.wsaa = (options, callback) => {
	return require(__dirname + '/lib/wsaa').getInstance(options, callback);
}
