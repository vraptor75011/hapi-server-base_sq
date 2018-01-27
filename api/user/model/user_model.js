const Bcrypt = require('bcrypt');


module.exports = function(sequelize, DataTypes) {

	let User = sequelize.define('user', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					len: [3, 64]
				},
				query: Query.username,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					isEmail: true
				},
				query: Query.email,
			},
			password: {
				type: DataTypes.STRING,
				exclude: true,
				allowNull: false,
				validation: {
					len: [8, 128]
				},
			},
			firstName: {
				type: DataTypes.STRING,
				required: true,
				validation: {
					len: [3, 64]
				},
				query: Query.firstName,
			},
			lastName: {
				type: DataTypes.STRING,
				required: true,
				validation: {
					len: [3, 64]
				},
				query: Query.lastName,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				query: Query.isActive,
			},
			resetPasswordToken: {
				type: DataTypes.STRING,
				exclude: true,
			},
			resetPasswordExpires: {
				type: DataTypes.STRING,
				exclude: true,
			},
			activateAccountToken: {
				type: DataTypes.STRING,
				exclude: true,
			},
			activateAccountExpires: {
				type: DataTypes.STRING,
				exclude: true,
			},
			fullName: {
				type: DataTypes.VIRTUAL(DataTypes.STRING, ['lastName', 'firstName']),
				default4Select: true,
				get: function() {
					return this.get('lastName') + ' ' + this.get('firstName')
				},
			}
		},
		{
			tableName: 'users',
			paranoid: true,
			timestamps: true,
		},
	);

	// Model Relations
	User.associate = function (models) {
		User.belongsToMany(models.Role, { through: models.RealmsRolesUsers, compare: false });
		User.belongsToMany(models.Realm, { through: models.RealmsRolesUsers, compare: false });
		User.hasMany(models.RealmsRolesUsers, {compare: true});
		User.hasMany(models.Session, {compare: true});
	};

	// Model Utilities
	User.hashPassword = (password) => {
		const SaltRounds = 10;
		let salt = Bcrypt.genSaltSync(SaltRounds);
		return Bcrypt.hashSync(password, salt);
	};

	return User;
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

};