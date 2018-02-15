const Fs = require('fs');
const Handlebars = require('handlebars');
const Hoek = require('hoek');
const Markdown = require('nodemailer-markdown').markdown;
const NodeMailer = require('nodemailer');

const Config = require('../../config/config');
const { apiLogger, chalk } = require('../logging/logging');

let renderTemplate = async (signature, context) => {

	// const deferred = Q.defer();

	// if (templateCache[signature]) {
	//   deferred.resolve(internals.templateCache[signature](context));
	// }

	const filePath = __dirname + '/emails/' + signature + '.hbs.md';
	const options = { encoding: 'utf-8' };

	let file = Fs.readFileSync(filePath, options);
	if (file) {
		let tmp = await Handlebars.compile(file);
		return tmp(context);
	}

};


module.exports = {
	sendMail: async (options, template, context) => {

		let content = await renderTemplate(template, context);

		const defaultEmail = Config.get('/defaultEmail');

		//EXPL: send to the default email address if it exists
		if (!(Object.keys(defaultEmail).length === 0 && defaultEmail.constructor === Object)) {
			options.to.address = defaultEmail;
		}

		options = Hoek.applyToDefaults(options, {
			from: Config.get('/system/fromAddress'),
			markdown: content
		});

		// create reusable transporter object using the default SMTP transport
		let transporter = NodeMailer.createTransport(Config.get('/mailAccount'));

		transporter.use('compile', Markdown());

		// send mail with defined transport object
		transporter.sendMail(options, (error, info) => {
			if (error) {
				apiLogger.error(chalk.red(error));
			}
			apiLogger.info(chalk.cyan('Message sent to: %s', info.messageId));
		});

	}
};
