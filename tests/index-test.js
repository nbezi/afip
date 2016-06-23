var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var afip = require('./../index.js');

var endpoints = {
	homolog: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
	homologWSDL: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL',
	production: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
	productionWSDL: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx'
}

describe('Wsfev1Client instantiation', function() {
  it('client() should return instance of Wsfev1Client', function(done) {
    afip.client({wsfeVersion: 'wsfev1'}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.getWsfeVersion()).to.equal('wsfev1');
    	done();
    });
  });
});

describe('Wsfev1Client production property', function() {
  it('client() production default to false', function(done) {
    afip.client({wsfeVersion: 'wsfev1'}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.isProduction()).to.equal(false);
    	done();
	});
  });

  it('client() production set to false', function(done) {
    afip.client({wsfeVersion: 'wsfev1', production: false}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.isProduction()).to.equal(false);
    	done();
    });
  });

  it('client() production set to true', function(done) {
    afip.client({wsfeVersion: 'wsfev1', production: true}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.isProduction()).to.equal(true);
    	done();
    });
  });
});

describe('Wsfev1Client get Endpoints property', function() {
  it('client() production to false, homolog expected', function(done) {
    afip.client({wsfeVersion: 'wsfev1'}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.getEndpoint()).to.equal(endpoints.homolog);
    	expect(client.getWSDLEndpoint()).to.equal(endpoints.homologWSDL);
    	done();
    });
  });

  it('client() production set to true, production expected', function(done) {
    afip.client({wsfeVersion: 'wsfev1', production: true}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.getEndpoint()).to.equal(endpoints.production);
	    expect(client.getWSDLEndpoint()).to.equal(endpoints.productionWSDL);
    	done();
    });
  });
});