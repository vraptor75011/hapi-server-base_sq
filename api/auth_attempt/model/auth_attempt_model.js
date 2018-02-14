
module.exports = function(sequelize, DataTypes) {

	let AuthAttempt = sequelize.define('authAttempt', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			ip: {
				type: DataTypes.STRING,
				allowNull: false,
				validation: {
					is: [15]
				},
				query: Query.ip,
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: true,
				validation: {
					len: [3, 64]
				},
				query: Query.username,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: true,
				validation: {
					isEmail: true
				},
				query: Query.email,
			},
			count: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
				validation: {
					min: 0,
				},
				query: Query.count,
			},
		},
		{
			tableName: 'auth_attempts',
			paranoid: true,
			timestamps: true,
		},
	);

	// Model Relations


	// Model Utilities
	AuthAttempt.abuseDetected = (ip, email, username) => {

		return null;
	};

	return AuthAttempt;
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
			description: 'the user ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
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

	ip: {
		array: {
			items: {
				string: {
					regex: '',
					max: 25,
					example: 'the attempting IP: 10.20.40.120] vs [{or}{btw}192.168.1.1,192.168.1.254, {or}{=}192.168.0.1',
				},
			},
			description: 'the attempting login IP: 192.168.1.254 vs [{=}192.168.0.1,{<=}192.168.1.254]',
			example: ['{>=}10.20.40.120', '{>=}192.168.1.1'],
		},
		string: {
			regex: '',
			max: 255,
			example: ['{=}192.168.1.1,{like}192.168.1.1']
		},
	},

	username: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}luigi.rossi',
				},
			},
			description: 'the username: franco.baresi vs [{=}pippo1,{<>}pippo3,{like}pip]',
			example: ['{like}rossi', '{like}bianchi'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}franco.baresi', '{<>}tardelli-GOBBO']
		},
	},

	email: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 255,
					example: '{like}eataly.it',
				},
			},
			description: 'the user email: jack@mail.com vs [{=}pippo1@lol.it,{<>}pippo3@lol.it,{like}pip]',
			example: ['{like}rossi.it', '{like}verdi.it'],
		},
		string: {
			regex: '',
			min: 3,
			max: 255,
			example: ['{<>}luigi.rossi@eataly.it']
		},
	},

	count: {
		array: {
			items: {
				string: {
					regex: '',
					min: 0,
					example: '{=}1',
				},
			},
			description: 'the Attempted Auth count: 5 vs [{or}{=}3,{or}{=}2,{>=}4]',
			example: ['{<}5', '{=}5'],
		},
		string: {
			regex: '',
			min: 0,
			example: ['{<>}0']
		},
	},

};