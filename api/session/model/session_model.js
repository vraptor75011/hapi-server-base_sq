const Uuid = require('node-uuid');
const Sequelize = require('sequelize');
const QueryHelper = require('../../../utilities/query/query-helper');

const Op = Sequelize.Op;

module.exports = function(sequelize, DataTypes) {
	let Session = sequelize.define('session', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			key: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					len: [3, 64]
				},
				query: Query.key,
			},
			passwordHash: {
				type: DataTypes.STRING,
				exclude: true,
				allowNull: false,
				validation: {
					len: [8, 128]
				},
			},
		},
		{
			tableName: 'sessions',
			paranoid: false,
			timestamps: true,
		},
	);


	// Model Relations
	Session.associate = function (models) {
		Session.belongsTo(models.User);
	};

	// Special Methods:
	// CreateInstance
	Session.createInstance = (user) => {

		let params = {
			userId: user.id,
			key: Uuid.v4(),
			passwordHash: user.password,
		};

		let newSession = Session.build(params);
		return newSession.save()
			.then(function(result) {
				newSession = result;

				let query = {
					where: {
						userId: user.id,
						key: { [Op.ne]: newSession.key }
					}
				};

				return Session.destroy(query)
			})
			.then(function(result) {
				return newSession;
			});
	};

	// Find By Credentials
	Session.findByCredentials = (sessionId, sessionKey) => {
		let session = {};
		let attributes = QueryHelper.createAttributesArray(Session);
		let query = {
			where: {
				id: sessionId,
			},
			include: [{
				association: Session.associations.user,
			}],
		};

		return Session.findOne(query)
			.then(function (result) {
				session = result;
				if (!session) {
					return false;
				}

				return session.key === sessionKey ? session : false;
			})
			.catch(function (error) {
				Log.error(error);
			});
	};

	return Session;
};

// Params to build query URL
const Query = {
	id: {
		array: {
			items: {
				string: {
					regex: '',
					example: '{>=}20',
				},
				integer: {
					min: 1,
					example: 35,
				},
			},
			description: 'the session ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
			example: ['{>}35', '{<}50'],
		},
		string: {
			regex: '',
			example: '{in}35,40',
		},
		integer: {
			min: 1,
			example: 40,
		}

	},
	key: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}-aff1-4749',
				},
			},
			description: 'the session key: -aff1-4749 vs [{=}-aff1-4749,{<>}pippo3,{like}-aff1-4749]',
			example: ['{like}-aff1-4749', '{like}-drt6-84r5'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}dwr6-cdr5', '{<>}drt6-844z']
		},
	},
};