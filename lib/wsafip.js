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
		return this.isProduction() ? this.endpoints.production : this.endpoints.homolog;
	}

	getWSDLEndpoint() {
		return this.isProduction() ? this.endpoints.productionWSDL : this.endpoints.homologWSDL;
	}
}