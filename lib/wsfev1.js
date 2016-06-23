'use strict';

var soap = require('soap');
var Wssup = require('./wssup').Wssup;

var endpoints = {
	homolog: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
	homologWSDL: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL',
	production: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
	productionWSDL: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx'
}

class Wsfev1Client extends Wssup {

	constructor(options, callback) {
		super(options);

		soap.createClient(
			this.getWSDLEndpoint(),
			{
				endpoint: this.getEndpoint(),
				envelopeKey: 'soapenv'
			},
			(err, client) => {
				if (err) return callback(true, err);
				this.soapClient = client;
				callback(false, this);
			}
		);
	}

	_makeCall() {

	}

	getEndpoint() {
		if (this.isProduction()) {
			return endpoints.production;
		} else {
			return endpoints.homolog;
		}
	}

	getWSDLEndpoint() {
		if (this.isProduction()) {
			return endpoints.productionWSDL;
		} else {
			return endpoints.homologWSDL;
		}
	}
}

module.exports.getInstance = (options, callback) => {
	return new Wsfev1Client(options, callback);
}
