'use strict';

module.exports.Wssup = class Wssup {
	
	constructor(options) {
		// Production must be explicit, default homolog
		this.production = options.production || false;
	}

	setWsfeVersion(wsfeVersion) {
		this.wsfeVersion = wsfeVersion;
	}

	getWsfeVersion() {
		return this.wsfeVersion;
	}

	isProduction() {
		return this.production;
	}	
}
