module.exports = function(sequelize, Sequelize) {

	let AuthProfile = sequelize.define('authProfile', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			firstName: {
				type: Sequelize.STRING,
				required: true,
				validation: {
					len: [3, 64]
				},
				query: Query.firstName,
			},
			lastName: {
				type: Sequelize.STRING,
				required: true,
				validation: {
					len: [3, 64]
				},
				query: Query.lastName,
			},
			langDefault: {
				type: Sequelize.STRING,
				validation: {
					len: [2, 8]
				},
				query: Query.langDefault,
			},
			mobilePhone: {
				type: Sequelize.STRING,
				validation: {
					len: [7, 15]
				},
				query: Query.mobilePhone,
			},
			public: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				query: Query.public,
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
			tableName: 'authProfiles',
			paranoid: true,
			timestamps: true,
		},
	);

	// Model Relations
	AuthProfile.associate = function (models) {
		AuthProfile.belongsTo(models.AuthUser, { foreignKey: 'userId', sourceKey: 'id' });
		AuthProfile.hasOne(models.AuthAvatar, { foreignKey: 'profileId', sourceKey: 'id' });
	};

	return AuthProfile;
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
			description: 'the profile ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
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
			description: 'the profile first name: Luigi vs [{or}{=}Mario,{or}{=}Fabio,{or}{like}Mar]',
			example: ['{like}Rosa', '{like}Viviano'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{<>}Mario']
		},
	},

	langName: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 64,
					example: '{like}Verdi',
				},
			},
			description: 'the profile last name: Lo Cascio vs [{or}{=}Rossi,{or}{=}Verdi,{or}{like}Pia]',
			example: ['{like}Rossini', '{like}Verdini'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{<>}Mariottini']
		},
	},

	langDefault: {
		array: {
			items: {
				string: {
					regex: '',
					min: 2,
					max: 16,
					example: '{like}it',
				},
			},
			description: 'the profile default language: it vs [{or}{=}en,{or}{=}it,{or}{like}en]',
			example: ['{like}Rossini', '{like}Verdini'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{<>}it']
		},
	},

	mobilePhone: {
		array: {
			items: {
				string: {
					regex: '',
					min: 7,
					max: 25,
					example: '{like}33558',
				},
			},
			description: 'the profile mobile phone: +393355834233 vs [{or}{=}+39349,{or}{=}+3933996,{or}{like}335]',
			example: ['{like}335', '{like}349'],
		},
		string: {
			regex: '',
			min: 8,
			max: 25,
			example: ['{<>}+39']
		},
	},

	public: {
		array: {
			items: {
				boolean: {
					valid: [true, false],
					example: 'true',
				},
			},
			description: 'the profile is public?: true vs [true, false]]',
		},
		boolean: {
			valid: [true, false],
		},
	},
};
