'use strict';

var soap = require('soap');
var Wssup = require('./wssup').Wssup;

var endpoints = {
	homolog: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
	homologWSDL: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL',
	production: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
	productionWSDL: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL'
}

class Wsfev1Client extends Wssup {

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

	_makeCall() {

	}
}

module.exports.getInstance = (options, callback) => {
	return new Wsfev1Client(options, callback);
}
