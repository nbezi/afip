'use strict';

module.exports.client = (options, callback) => {
	if (!options) {
		options = {};
	}

	if (!options.wsfeVersion) {
		options.wsfeVersion = 'wsfev1';
	}

	var clientInstance = require(__dirname + '/lib/' + options.wsfeVersion).getInstance(options, callback);
	clientInstance.setWsfeVersion(options.wsfeVersion);
}

