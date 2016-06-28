'use strict';

var Wsafip = require('./wsafip').Wsafip;

module.exports.Wssup = class Wssup extends Wsafip {

	constructor(options) {
		super(options);
		this._setRequiredOption(options, 'token');
		this._setRequiredOption(options, 'sign');
		this._setRequiredOption(options, 'cuit');
	}

	setWsVersion(wsVersion) {
		this.wsVersion = wsVersion;
	}

	getWsVersion() {
		return this.wsfeVersion;
	}

}
