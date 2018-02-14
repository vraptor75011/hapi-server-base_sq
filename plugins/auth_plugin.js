const HapiJWT2 = require('./hapi-jwt2/hapi-jwt2');


// ToDo Aggiornare alla versione definitiva prima possibile
// Problemi con Hai v.17

module.exports = {
	hapiAuth: {
		plugin: HapiJWT2,
		options: {}
	},

};
