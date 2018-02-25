const Bcrypt = require('bcrypt');


module.exports = function(sequelize, Sequelize) {

	let AuthUser = sequelize.define('authUser', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			username: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: true,
				validate: {
					len: [3, 64]
				},
				query: Query.username,
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true
				},
				query: Query.email,
			},
			password: {
				type: Sequelize.STRING,
				exclude: true,
				allowNull: false,
				validate: {
					len: [8, 128]
				},
			},
			firstName: {
				type: Sequelize.STRING,
				required: true,
				validate: {
					len: [3, 64]
				},
				query: Query.firstName,
			},
			lastName: {
				type: Sequelize.STRING,
				required: true,
				validate: {
					len: [3, 64]
				},
				query: Query.lastName,
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				query: Query.isActive,
			},
			currentLoginAt: {
				type: Sequelize.DATE,
				query: Query.currentLoginAt,
			},
			lastLoginAt: {
				type: Sequelize.DATE,
				query: Query.lastLoginAt,
			},
			currentLoginIP: {
				type: Sequelize.STRING,
				validate: {
					len: [3, 15]
				},
				query: Query.currentLoginIP,
			},
			lastLoginIP: {
				type: Sequelize.STRING,
				validate: {
					len: [3, 15]
				},
				query: Query.lastLoginIP
			},
			resetPasswordToken: {
				type: Sequelize.STRING,
				exclude: true,
			},
			resetPasswordExpires: {
				type: Sequelize.STRING,
				exclude: true,
			},
			resetPasswordNewPWD: {
				type: Sequelize.STRING,
				exclude: true,
			},
			activateAccountToken: {
				type: Sequelize.STRING,
				exclude: true,
			},
			activateAccountExpires: {
				type: Sequelize.STRING,
				exclude: true,
			},
			fullName: {
				type: Sequelize.VIRTUAL(Sequelize.STRING, ['lastName', 'firstName']),
				default4Select: true,
				get: function() {
					if (this.get('lastName') && this.get('firstName')) {
						return this.get('lastName') + ' ' + this.get('firstName')
					} else {
						return null;
					}
				},
			}
		},
		{
			tableName: 'authUsers',
			paranoid: true,
			timestamps: true,
		},
	);

	// Model Relations
	AuthUser.associate = function (models) {
		AuthUser.belongsToMany(models.AuthRole, { through: 'authRealmsRolesUsers', foreignKey: 'userId', otherKey: 'roleId' });
		AuthUser.belongsToMany(models.AuthRealm, { through: 'authRealmsRolesUsers', foreignKey: 'userId', otherKey: 'realmId' });
		AuthUser.hasMany(models.AuthRealmsRolesUsers, { as: 'userRRU', foreignKey: 'userId', sourceKey: 'id' });
		AuthUser.hasMany(models.AuthSession, { foreignKey: 'userId', sourceKey: 'id' });
		AuthUser.hasOne(models.AuthProfile, { foreignKey: 'userId', sourceKey: 'id' });
	};

	// Model Utilities
	AuthUser.hashPassword = (password) => {
		const SaltRounds = 10;
		let salt = Bcrypt.genSaltSync(SaltRounds);
		return Bcrypt.hashSync(password, salt);
	};

	return AuthUser;
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
	firstName: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 64,
					example: '{like}Mario',
				},
			},
			description: 'the user first name: Luigi vs [{or}{=}Mario,{or}{=}Fabio,{or}{like}Mar]',
			example: ['{like}Rosa', '{like}Viviano'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{<>}Mario']
		},
	},

	lastName: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 64,
					example: '{like}Vieri',
				},
			},
			description: 'the user last name: Lo Cascio vs [{or}{=}Rossi,{or}{=}Verdi,{or}{like}Pia]',
			example: ['{like}Rossini', '{like}Verdini'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{<>}Mariotti']
		},
	},

	isActive: {
		array: {
			items: {
				boolean: {
					valid: [true, false],
					example: 'true',
				},
			},
			description: 'the user is active?: true vs [true, false]]',
		},
		boolean: {
			valid: [true, false],
		},
	},

	authCount: {
		array: {
			items: {
				string: {
					regex: '',
					min: 0,
					example: '{=}1',
				},
			},
			description: 'the user Auth count Attempted: 5 vs [{or}{=}3,{or}{=}2,{>=}4]',
			example: ['{<}5', '{=}5'],
		},
		string: {
			regex: '',
			min: 0,
			example: ['{<>}0']
		},
	},

	currentLoginAt: {
		array: {
			items: {
				string: {
					regex: '',
					max: 255,
					example: 'the current date: 2017-08-15 09:00:00] vs [{or}{btw}2017-08-17 09:00:00,2017-08-17 23:30:00, ' +
					'{or}{btw}2017-12-25 09:00:00,2018-01-06 23:30:00]',
				},
			},
			description: 'the Current login Date: 2017-08-15 09:00:00 vs [{=}2017-08-17 09:00:00,{<>}2017-12-25 09:00:00]',
			example: ['{>=}2017-12-25 09:00:00', '{>=}2017-12-25 09:00:00'],
		},
		string: {
			regex: '',
			max: 255,
			example: ['{=}2017-08-17 09:00:00,{>=}2017-12-25 09:00:00']
		},
	},

	lastLoginAt: {
		array: {
			items: {
				string: {
					regex: '',
					max: 255,
					example: 'the last date: 2017-08-15 09:00:00] vs [{or}{btw}2017-08-17 09:00:00,2017-08-17 23:30:00, ' +
					'{or}{btw}2017-12-25 09:00:00,2018-01-06 23:30:00]',
				},
			},
			description: 'the Last login Date: 2017-08-15 09:00:00 vs [{=}2017-08-17 09:00:00,{<>}2017-12-25 09:00:00]',
			example: ['{>=}2017-12-25 09:00:00', '{>=}2017-12-25 09:00:00'],
		},
		string: {
			regex: '',
			max: 255,
			example: ['{=}2017-08-17 09:00:00,{>=}2017-12-25 09:00:00']
		},
	},

	currentLoginIP: {
		array: {
			items: {
				string: {
					regex: '',
					max: 25,
					example: 'the current IP: 10.20.40.120] vs [{or}{btw}192.168.1.1,192.168.1.254, {or}{=}192.168.0.1',
				},
			},
			description: 'the Current login IP: 192.168.1.254 vs [{=}192.168.0.1,{<=}192.168.1.254]',
			example: ['{>=}10.20.40.120', '{>=}192.168.1.1'],
		},
		string: {
			regex: '',
			max: 255,
			example: ['{=}192.168.1.1,{like}192.168.1.1']
		},
	},

	lastLoginIP: {
		array: {
			items: {
				string: {
					regex: '',
					max: 25,
					example: 'the last IP: 10.20.40.120] vs [{or}{btw}192.168.1.1,192.168.1.254, {or}{=}192.168.0.1',
				},
			},
			description: 'the last login IP: 192.168.1.254 vs [{=}192.168.0.1,{<=}192.168.1.254]',
			example: ['{>=}10.20.40.120', '{>=}192.168.1.1'],
		},
		string: {
			regex: '',
			max: 255,
			example: ['{=}192.168.1.1,{like}192.168.1.1']
		},
	},
};