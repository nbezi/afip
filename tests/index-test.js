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
  it('wsfe() should return instance of Wsfev1Client', function(done) {
    afip.wsfe({wsfeVersion: 'wsfev1', token: 'test', sign: 'test', cuit: '20123123129'}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.getWsfeVersion()).to.equal('wsfev1');
    	done();
    });
  });
});

describe('Wsfev1Client production property', function() {
  it('wsfe() production default to false', function(done) {
    afip.wsfe({wsfeVersion: 'wsfev1', token: 'test', sign: 'test', cuit: '20123123129'}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.isProduction()).to.equal(false);
    	done();
	});
  });

  it('wsfe() production set to false', function(done) {
    afip.wsfe({wsfeVersion: 'wsfev1', token: 'test', sign: 'test', cuit: '20123123129', production: false}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.isProduction()).to.equal(false);
    	done();
    });
  });

  it('wsfe() production set to true', function(done) {
    afip.wsfe({wsfeVersion: 'wsfev1', token: 'test', sign: 'test', cuit: '20123123129', production: true}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.isProduction()).to.equal(true);
    	done();
    });
  });
});

describe('Wsfev1Client get Endpoints property', function() {
  it('wsfe() production to false, homolog expected', function(done) {
    afip.wsfe({wsfeVersion: 'wsfev1', token: 'test', sign: 'test', cuit: '20123123129'}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.getEndpoint()).to.equal(endpoints.homolog);
    	expect(client.getWSDLEndpoint()).to.equal(endpoints.homologWSDL);
    	done();
    });
  });

  it('wsfe() production set to true, production expected', function(done) {
    afip.wsfe({wsfeVersion: 'wsfev1', token: 'test', sign: 'test', cuit: '20123123129', production: true}, (err, client) => {
    	if (err) expect(client).to.equal('');
    	expect(err).to.equal(false);
    	expect(client.getEndpoint()).to.equal(endpoints.production);
	    expect(client.getWSDLEndpoint()).to.equal(endpoints.productionWSDL);
    	done();
    });
  });
});

describe('WsaaClient instantiation', function() {
  it('wsaa() should return instance of Wsfev1Client', function(done) {
    afip.wsaa({service: 'wsfe'}, (err, client) => {
      if (err) expect(client).to.equal('');
      expect(err).to.equal(false);
      client.createTRA();
      done();
    });
  });
});