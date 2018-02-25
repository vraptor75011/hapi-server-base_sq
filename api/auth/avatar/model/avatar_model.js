module.exports = function(sequelize, Sequelize) {

	let AuthAvatar = sequelize.define('authAvatar', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			fieldName: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
				default4Select: true,
				query: Query.fieldName,
			},
			originalName: {
				type: Sequelize.STRING,
				allowNull: false,
				query: Query.originalName,
			},
			fileName: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
				query: Query.fileName,
			},
			mimeType: {
				type: Sequelize.STRING,
				allowNull: false,
				query: Query.mimeType,
			},
			destination: {
				type: Sequelize.STRING,
				allowNull: false,
				query: Query.destination,
			},
			path: {
				type: Sequelize.STRING,
				allowNull: false,
				query: Query.path,
			},
			size: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					max: 512000,
				},
				query: Query.size,
			},
			profileId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			deletedAt: {
				type: Sequelize.DATE
			},
		},
		{
			tableName: 'authAvatar',
			paranoid: true,
			timestamps: true,
		},
	);

	// Model Relations
	AuthAvatar.associate = function (models) {
		AuthAvatar.belongsTo(models.AuthProfile, { foreignKey: 'profileId', targetKey: 'id' });
	};

	return AuthAvatar;
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
			description: 'the avatar ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
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

	fieldName: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}jack-avatar',
				},
			},
			description: 'the avatar name: jack vs [{=}giacomo,{<>}luke,{like}R2D2]',
			example: ['{like}jack', '{like}mark'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}andy', '{<>}black']
		},
	},

	originalName: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}jack-avatar',
				},
			},
			description: 'the avatar original name: jack vs [{=}giacomo,{<>}luke,{like}R2D2]',
			example: ['{like}jack', '{like}mark'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}andy', '{<>}black']
		},
	},

	fileName: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}93158cc0-2b6b-4fe9-998d-6102b95e58fc',
				},
			},
			description: 'the avatar file name generated with UUID: jack vs [{=}93158cc0-2b6b-4fe9-998d-6102b95e58fc.png,{<>}93158cc0-2b6b-4fe9-998d-6102b95e58fc,{like}92ef6297-2e6d-409e-8999-f22f328de9f1]',
			example: ['{like}92ef6297-2e6d-409e-8999-f22f328de9f1', '{like}92ef6297-2e6d-409e-8999-f22f328de9f1'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{like}3bd5d3b8-e0ba-451a-9b34-2ad30c01a445', '{<>}ab204077-cd5a-4b2e-ac09-66b91be2e464']
		},
	},

	mimeType: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 255,
					example: '{like}image/png',
				},
			},
			description: 'the avatar mime type: image/png vs [{=}image/jpeg,{<>}image/png]',
			example: ['{like}image/jpeg', '{like}image/png'],
		},
		string: {
			regex: '',
			min: 3,
			max: 255,
			example: ['{<>}image/png']
		},
	},

	destination: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}images',
				},
			},
			description: 'the avatar image destination',
			example: ['{like}images'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{<>}images']
		},
	},

	path: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					example: '{like}uploads/avatars',
				},
			},
			description: 'the avatar path: uploads/avatars]',
			example: ['{like}uploads/avatars', '{like}uploads/images/avatars'],
		},
		string: {
			regex: '',
			min: 3,
			example: ['{<>}uploads/avatars']
		},
	},

	size: {
		array: {
			items: {
				string: {
					regex: '',
					example: '{>=}1024',
				},
				integer: {
				},
			},
			description: 'the avatar file size (in Byte): [{=}]10000 vs [{>}10000,{<>}150,{<=}2048]',
			example: ['{>}350000', '{<}500000'],
		},
		string: {
			regex: '',
			example: '{in}35000,40000',
		},
		integer: {
			min: 1,
			example: 40000,
		}
	},

	profileId: {
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
			description: 'the profile ID related: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
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

};