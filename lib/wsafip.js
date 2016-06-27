'use strict';

module.exports.Wsafip = class Wsafip {

	constructor(options) {
		this.production = options.production || false;
	}

	_setRequiredOption(options, option) {
		if (!options[option]) {
			throw new Error("Option '" + option + "' is required");
		}	
		this[option] = options[option];
	}

	isProduction() {
		return this.production;
	}

	setEndpoints(endpoints) {
		this.endpoints = endpoints;
	}

	getEndpoint() {
		if (this.isProduction()) {
			return this.endpoints.production;
		} else {
			return this.endpoints.homolog;
		}
	}

	getWSDLEndpoint() {
		if (this.isProduction()) {
			return this.endpoints.productionWSDL;
		} else {
			return this.endpoints.homologWSDL;
		}
	}
}