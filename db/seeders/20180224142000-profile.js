const Profiles = require('./data/05-profile_data');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('authProfiles', Profiles, {});
		console.log('Seed Profile');
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('authProfiles', null, {});
		console.log('UNSeed Profile');
	},
};
