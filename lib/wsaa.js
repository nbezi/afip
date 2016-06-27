'use strict';

var util = require('util'),
	soap = require('soap'),
	spawn = require('child_process').spawn,
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
			this._setRequiredOption(options, 'certFilename');
			this._setRequiredOption(options, 'keyFilename');
		} catch(error) {
			callback(true, error);
			return;
		}

		this.passphrase = options.passphrase || '';

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
				fs.readFile(options.certFilename, 'utf8', (err, data) => {
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
				fs.readFile(options.keyFilename, 'utf8', (err, data) => {
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

	createTRA() {
		var today = new Date(),
			uniqueId = Math.floor(today.getTime() / 1000),
			generationTime = new Date((uniqueId - 60) * 1000),
			expirationTime = new Date((uniqueId + 60) * 1000);

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

	createCMS(tra) {
		this.sign({
			content: this.createTRA(),
			key: this.keyFilename,
			cert: this.certFilename,
			password: this.passphrase
		}, (err, cms) => {
			console.log(cms);
		});

		/*this.soapClient.loginCms(requestBody, (err, result, raw, soapHeader) => {

		});*/
	}

	callWS(cms) {

	}

	/**
	 * Sign a file.
	 *
	 * @param {object} options Options
	 * @param {stream.Readable} options.content Content stream
	 * @param {string} options.key Key path
	 * @param {string} options.cert Cert path
	 * @param {string} [options.password] Key password
	 * @param {function} [cb] Optional callback
	 * @returns {object} result Result
	 * @returns {string} result.pem Pem signature
	 * @returns {string} result.der Der signature
	 * @returns {string} result.stdout Strict stdout
	 * @returns {string} result.stderr Strict stderr
	 * @returns {ChildProcess} result.child Child process
	 */
	sign(options, cb) {
        options = options || {};

        if (!options.content)
            throw new Error('Invalid content.');

        if (!options.key)
            throw new Error('Invalid key.');

        if (!options.cert)
            throw new Error('Invalid certificate.');

        var command = util.format(
            'openssl smime -sign -text -signer %s -inkey %s -outform DER -nodetach',
            options.cert, options.key
        );

        if (options.password)
            command += util.format(' -passin pass:%s', options.password || '');

        console.log(command);
        var args = command.split(' ');
        var child = spawn(args[0], args.splice(1));

        var der = [];

        child.stdout.on('data', (chunk) => {
            der.push(chunk);
        });

        child.on('close', (code) => {
            if (code !== 0) {
            	console.log(der);
                cb(true, new Error('Process failed. [' + code + ']'));
            } else {
            	der.shift().shift().shift().shift();
                cb(false, {	
                    child: child,
                    der: Buffer.concat(der)
                });
            }
        });
	}	
}

var getInstance = module.exports.getInstance = (options, callback) => {
	return new Wsaa(options, callback);
}


getInstance(
	{
		service: 'wsfe',
		certFilename: __dirname + '/wsaa/cert',
		keyFilename: __dirname + '/wsaa/privatekey'
	}, (err, client) => {
		console.log('Done');
		if (err) console.log(client);
		else console.log(client.cert);

		client.createCMS();
	}
);