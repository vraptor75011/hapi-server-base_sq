const Uuid = require('node-uuid');
const Sequelize = require('sequelize');
const Bcrypt = require('bcrypt');

const Op = Sequelize.Op;

module.exports = function(sequelize, Sequelize) {
	let AuthSession = sequelize.define('authSession', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			key: {
				type: Sequelize.STRING,
				default4Select: true,
				unique: true,
				allowNull: false,
				validation: {
					len: [3, 64]
				},
				query: Query.key,
			},
			passwordHash: {
				type: Sequelize.STRING,
				exclude: true,
				allowNull: false,
				validation: {
					len: [8, 128]
				},
			},
			userAgent: {
				type: Sequelize.STRING,
				allowNull: false,
				query: Query.userAgent,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			realmId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		},
		{
			tableName: 'authSessions',
			paranoid: false,
			timestamps: true,
		},
	);


	// Model Relations
	AuthSession.associate = function (models) {
		AuthSession.belongsTo(models.AuthUser, { foreignKey: 'userId', targetKey: 'id' });
		AuthSession.belongsTo(models.AuthRealm, { foreignKey: 'realmId', targetKey: 'id' });
	};

	// Special Methods:
	// CreateInstance
	AuthSession.createOrRefreshInstance = async (request, oldSession, user, realm) => {
		// const { method, url } = request;
		let { headers } = request;
		// let { info } = request;
		let userAgent = headers['user-agent'];
		let option = {};
		let oldSessionId = null;
		if (oldSession) {
			oldSessionId = oldSession.id;
		}

		let [session, initialized] = await AuthSession.findOrBuild({
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
			await AuthSession.destroy(option);
			return session;
		} else {
			return null
		}

	};

	// Find By Credentials
	AuthSession.findByCredentials = async (sessionId, sessionKey) => {
		let query = {
			where: {
				id: sessionId,
			},
			include: [
				{
					association: AuthSession.associations.user,
				},
				{
					association: AuthSession.associations.realm
				}],
		};

		let session = await AuthSession.findOne(query);
		if (!session) {
			return false;
		}

		return session.key === sessionKey ? session : false;
	};

	// Generate a hashed key for new user registration
	AuthSession.generateKeyHash = async () => {
		let salt;
		let hash;
		const key = Uuid.v4();

		salt = await Bcrypt.genSalt(10);
		hash = await Bcrypt.hash(key, salt);
		return { key, hash };
	};


	// To complete model function
	return AuthSession;
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
			description: 'the AuthUser Agent: Chrome vs [{=}Chrome,{<>}Chrome,{like}Chrome]',
			example: ['{like}Firefox', '{like}Chrome'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}Firefox', '{<>}Chrome']
		},
	},
};