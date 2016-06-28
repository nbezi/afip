'use strict';

var util = require('util'),
	soap = require('soap'),
	exec = require('child_process').exec,
	Wsafip = require('./wsafip').Wsafip,
	xml = require('xml'),
	fs = require('fs');

var endpoints = {
	homolog: 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms',
	homologWSDL: 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL',
	production: 'https://wsaa.afip.gov.ar/ws/services/LoginCms',
	productionWSDL: 'https://wsaa.afip.gov.ar/ws/services/LoginCms?WSDL'
}

var validServices = ['wsfe'];

class Wsaa extends Wsafip {

	constructor(options, callback) {
		try {
			super(options);
			this._setRequiredOption(options, 'service');
			this._setRequiredOption(options, 'productionCertFilename');
			this._setRequiredOption(options, 'productionKeyFilename');
			this._setRequiredOption(options, 'homologCertFilename');
			this._setRequiredOption(options, 'homologKeyFilename');
		} catch(error) {
			callback(true, error);
			return;
		}

		this.homologPassphrase = options.homologPassphrase || '';
		this.productionPassphrase = options.productionPassphrase || '';

		this.service = validServices.find((service) => service == options.service)
		if (!options.service) {
			callback(true, 'Invalid option \'service\', must be one of ' . validServices.join(' '));
			return;
		}

		this.setEndpoints(endpoints);
		var loadingClass = new Promise((resolve, reject) => {
			soap.createClient(
				this.getWSDLEndpoint(), {endpoint: this.getEndpoint()},
				(err, client) => {
					if (err) {
						reject(err);
						return;
					}
				
					this.soapClient = client;
					resolve();
				}
			);
		});

		loadingClass.then(() => {
			return new Promise((resolve, reject) => {
				fs.readFile(this.getCertFilename(), 'utf8', (err, data) => {
					if (err) {
						reject(err);
						return;
					}

					this.cert = data;
					resolve();
				});
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				fs.readFile(this.getKeyFilename(), 'utf8', (err, data) => {
					if (err) {
						reject(err);
						return;
					}

					this.key = data;
					callback(false, this);
				});
			});
		}).catch((error) => {
			callback(true, error);
		});
	}

	getCredentials(callback) {
		this.createCMS((err, cms) => {
			if (err) callback(err);
			else this.soapClient.loginCms({'in0': cms}, (err, result, raw, soapHeader) => {
				if (!err) {
					this._setCredentials({
						token: (/<token>(.*)<\/token>/g).exec(result.loginCmsReturn)[1],
						sign: (/<sign>(.*)<\/sign>/g).exec(result.loginCmsReturn)[1],
						cuit: (/<source>.*CUIT (\d+)<\/source>/g).exec(result.loginCmsReturn)[1]
					});
				}
				callback(err, this._getCredentials());
			});
		});
	}

	_setCredentials(data) {
		this.credentials = data;
	}

	_getCredentials() {
		return this.credentials;
	}

	createCMS(cb) {
        var tarFilename = '/tmp/TAR' + Math.floor(Math.random() * 10000000);
        fs.writeFile(tarFilename + '.xml', this.createTRA(), (err) => {
        	/*
        	 * TODO: Couldn't find a way to sign using openssl yet, working on it... 
        	 */
	        var phpCommand = '$status = openssl_pkcs7_sign("' + tarFilename + '.xml", "' + tarFilename + '.tmp", "file://' + this.getCertFilename() + '", array("file://' + this.getKeyFilename() + '", "' + this.getPassphrase() + '"), array(), !PKCS7_DETACHED); if (!$status) {exit("ERROR generating PKCS#7 signature");} ';
	        phpCommand += '$inf = fopen("' + tarFilename + '.tmp", "r"); $i = 0; $CMS = ""; ';
	        phpCommand += 'while (!feof($inf)) {$buffer = fgets($inf); if ($i++ >= 4) {$CMS.=$buffer;}} ';
	        phpCommand += 'fclose($inf); unlink("' + tarFilename + '.xml"); unlink("' + tarFilename + '.tmp"); print($CMS);';
	        var command = util.format("php -r '%s'", phpCommand);
	        /** END OF TODO **/

	        var child = exec(command, (error, stdout, stderr) => {
				if (error) {
					cb(stderr);
				} else {
	            	cb(false, stdout);
	        	}
			});
        });
	}

	createTRA() {
		var today = new Date(),
			uniqueId = Math.floor(today.getTime() / 1000),
			generationTime = new Date((uniqueId - 120) * 1000),
			expirationTime = new Date((uniqueId + 120) * 1000);

		/* Forcing Argentina's TZ, WS don't care about daylight saving */
		generationTime.setHours(generationTime.getHours() - 3);
		expirationTime.setHours(expirationTime.getHours() - 3);

		var tra = xml({
			loginTicketRequest: [
				{_attr: {version: '1.0'}},
				{header: [
					{uniqueId: uniqueId},
					{generationTime: generationTime.toISOString().replace(/\.000Z$/, '-03:00')},
					{expirationTime: expirationTime.toISOString().replace(/\.000Z$/, '-03:00')}
				]},
				{service: this.service}
			]
		}, {declaration: true});

		return tra;
	}

	getCertFilename() {
		return this.isProduction() ? this.productionCertFilename : this.homologCertFilename;
	}

	getKeyFilename() {
		return this.isProduction() ? this.productionKeyFilename : this.homologKeyFilename;
	}

	getPassphrase() {
		return this.isProduction() ? this.productionPassphrase : this.homologPassphrase;
	}
}

module.exports.getInstance = (options, callback) => {
	return new Wsaa(options, callback);
}
