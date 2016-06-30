'use strict';

var soap = require('soap'),
	Wssup = require('./wssup').Wssup,
	endpoints = {
		'wsfev1': {
			homolog: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
			homologWSDL: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL',
			production: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
			productionWSDL: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL'
		},
		'wsmtxca': {
			homolog: 'https://fwshomo.afip.gov.ar/wsmtxca/services/MTXCAService',
			homologWSDL: 'https://fwshomo.afip.gov.ar/wsmtxca/services/MTXCAService?wsdl',
			production: 'https://serviciosjava.afip.gob.ar/wsmtxca/services/MTXCAService',
			productionWSDL: 'https://serviciosjava.afip.gob.ar/wsmtxca/services/MTXCAService?wsdl'
		}
	};

class ServiceClient extends Wssup {

	constructor(options, callback) {
		try {
			super(options);
		} catch(error) {
			callback(error);
			return;
		}

		this.setEndpoints(endpoints);
		console.log(this.serviceClass);
		console.log(endpoints);
		if (!endpoints[this.serviceClass]) {
			callback(new Error('The class \'Service Client\' at \'wsservice.js\' dosn\'t know endpoint for \'' + this.serviceClass + '\''));
			return;
		}

		soap.createClient(
			this.getWSDLEndpoint(),
			{
				endpoint: this.getEndpoint(),
				envelopeKey: 'soapenv'
			},
			(err, client) => {
				if (err) {
					callback(err);
					return;
				}
				
				this.soapClient = client;
				callback(false, this);
			}
		);
	}

	getEndpoint() {
		return this.isProduction() ? this.endpoints[this.serviceClass].production : this.endpoints[this.serviceClass].homolog;
	}

	getWSDLEndpoint() {
		return this.isProduction() ? this.endpoints[this.serviceClass].productionWSDL : this.endpoints[this.serviceClass].homologWSDL;
	}
}

module.exports.getInstance = (options, callback) => {
	return new ServiceClient(options, callback);
}
