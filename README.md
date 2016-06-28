# AFIP Client

This is a Argetina's AFIP Client communicate to their Business WS

**THIS IS AN ALPHA 1, NOT A PRODUCTION MODULE YET BUT ALMOST, USE IT AT YOUR OWN RISK**

**IMPORTANT: This module is currently using a PHP code snipped to Sign the TRA (ticket de requerimiento de autenticación), planned to be replace with pure node code soon**

Development on this module started June 22, 2016. We are scheduling to release a beta version by July 15th, we are now open for bugs, suggestions and pull requests.

Keep watching!

## Module

This module provides a constructor method that gives you an instance of a WS SOAP Client (See: [SOAP Module](https://www.npmjs.com/package/soap))

### initSession(options, callback)

Starts a session with WSAA Afip and creates a Client for a given Business Service.

#### Options

The `options` argument allows you to customize the client with the following properties:

- service: business service to authenticate to, possible values: wsfe
- serviceClass: business service class to use, possible values: wsfev1
- productionCertFilename: absolute location to your production cert file
- productionKeyFilename:  absolute location to your production cert file
- productionPassphrase: `Optional, default empty` passphrase used to generate the production key file
- homologCertFilename:  absolute location to your production cert file
- homologKeyFilename:  absolute location to your production cert file
- homologPassphrase: `Optional, default empty` passphrase used to generate the homolog key file
- production: `Optional, default: false`  whether use production or homolog condiguration

#### callback

The `callback` function will be called call once the instance is created and it's mandatory.

The callback will receive the following parameters:

1. error: and error object in case something went wrong
2. client: [SOAP Client](https://www.npmjs.com/package/soap#client)) instance

#### Usage

```node
var afip = require('afip');

afip.initSession({
	service: 'wsfe',
	serviceClass: 'wsfev1',
	productionCertFilename: __dirname + '/wsaa/production.cert',
	productionKeyFilename: __dirname + '/wsaa/production.key',
	homologCertFilename: __dirname + '/wsaa/homolog.cert',
	homologKeyFilename: __dirname + '/wsaa/homolog.key',
	production: false // Optional, default: false
}, (err, client) => {
  // TODO: Place your code here...
  
  // Example: requesting a invoice
  client.FECAESolicitar(
    {/* TODO: Your Options, see documentation at ./docs folder */}, 
    (err, result, raw, soapHeader) => {
      // TODO: Check if the invoice is ok and whatever...
    }
  );
  
  // Print the client and check what methods do you have available...
	console.log(client);
});
```



