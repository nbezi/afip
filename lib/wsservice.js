'use strict';

var soap = require('soap'),
	Wssup = require('./wssup').Wssup,
	util = require('util'),
	endpoints = {
		homolog: 'https://wswhomo.afip.gov.ar/%s/service.asmx',
		homologWSDL: 'https://wswhomo.afip.gov.ar/%s/service.asmx?WSDL',
		production: 'https://servicios1.afip.gov.ar/%s/service.asmx',
		productionWSDL: 'https://servicios1.afip.gov.ar/%s/service.asmx?WSDL'
	};

class ServiceClient extends Wssup {

	constructor(options, callback) {
		try {
			super(options);
		} catch(error) {
			callback(true, error);
			return;
		}

		this.setEndpoints(endpoints);
		soap.createClient(
			this.getWSDLEndpoint(),
			{
				endpoint: this.getEndpoint(),
				envelopeKey: 'soapenv'
			},
			(err, client) => {
				if (err) {
					callback(true, err);
					return;
				}
				
				this.soapClient = client;
				callback(false, this);
			}
		);
	}

	getEndpoint() {
		return util.format((this.isProduction() ? this.endpoints.production : this.endpoints.homolog), this.serviceClass);
	}

	getWSDLEndpoint() {
		return util.format((this.isProduction() ? this.endpoints.productionWSDL : this.endpoints.homologWSDL), this.serviceClass);
	}
}

module.exports.getInstance = (options, callback) => {
	return new ServiceClient(options, callback);
}
