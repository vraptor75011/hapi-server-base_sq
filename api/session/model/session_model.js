const Uuid = require('node-uuid');
const Sequelize = require('sequelize');
const Bcrypt = require('bcrypt');
const _ = require('lodash');
const QueryHelper = require('../../../utilities/query/query-helper');

const Op = Sequelize.Op;

module.exports = function(sequelize, DataTypes) {
	let Session = sequelize.define('session', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			key: {
				type: DataTypes.STRING,
				default4Select: true,
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
			userAgent: {
				type: DataTypes.STRING,
				allowNull: false,
				query: Query.userAgent,
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
		Session.belongsTo(models.Realm);
	};

	// Special Methods:
	// CreateInstance
	Session.createOrRefreshInstance = async (request, oldSession, user, realm) => {
		// const { method, url } = request;
		let { headers } = request;
		// let { info } = request;
		let userAgent = headers['user-agent'];
		let option = {};
		let oldSessionId = null;
		if (oldSession) {
			oldSessionId = oldSession.id;
		}

		let [session, initialized] = await Session.findOrBuild({
			where: {
				id: oldSessionId,
				userId: user.id,
				realmId: realm.id,
			}
		});

		if (session) {
			session.key = Uuid.v4();
			session.passwordHash = user.password;
			session.userAgent = userAgent;

			session = await session.save();

			option = {
				where: {
					userAgent: userAgent,
					userId: user.id,
					realmId: realm.id,
					key: { [Op.ne]: session.key }
				}
			};
			await Session.destroy(option);
			return session;
		} else {
			return null
		}

	};

	// Find By Credentials
	Session.findByCredentials = async (sessionId, sessionKey) => {
		let query = {
			where: {
				id: sessionId,
			},
			include: [
				{
					association: Session.associations.user,
				},
				{
					association: Session.associations.realm
				}],
		};

		let session = await Session.findOne(query);
		if (!session) {
			return false;
		}

		return session.key === sessionKey ? session : false;
	};

	// Generate a hashed key for new user registration
	Session.generateKeyHash = async () => {
		let salt;
		let hash;
		const key = Uuid.v4();

		salt = await Bcrypt.genSalt(10);
		hash = await Bcrypt.hash(key, salt);
		return { key, hash };
	};


	// To complete model function
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
	userAgent: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}Mozilla',
				},
			},
			description: 'the User Agent: Chrome vs [{=}Chrome,{<>}Chrome,{like}Chrome]',
			example: ['{like}Firefox', '{like}Chrome'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}Firefox', '{<>}Chrome']
		},
	},
};