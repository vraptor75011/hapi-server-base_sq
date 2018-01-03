const Joi = require('joi');

const usrString = "^([a-zA-Z0-9]+[\_\.\-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\*\.\,\;\:\-\_\|@&%\$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);

const ModelValidation = require('../../../utilities/validation/model_validations');

module.exports = function(sequelize, DataTypes) {

	let User = sequelize.define('User', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: {
					array: {
						items: {
                            string: {
                                example: '{<=}20',
                            },
                            integer: {
                                example: 35,
                            },
						},
                        description: 'the user ID PK increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
                        example: ['{>}35', '{<}50'],
					},
					string: {
						example: '{in}35,40',
					},
					integer: {
						min: 1,
						example: 40,
					}

				}
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					len: [3, 64]
				}
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.STRING,
				exclude: true,
				allowNull: false,
				validation: {
					len: [8, 128]
				}
			},
			firstName: {
				type: DataTypes.STRING,
				required: true,
				validation: {
					len: [3, 64]
				}
			},
			lastName: {
				type: DataTypes.STRING,
				required: true,
				validation: {
					len: [3, 64]
				}
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			resetPasswordToken: {
				allowOnCreate: false,
				allowOnUpdate: false,
				exclude: true,
				type: DataTypes.STRING,
			},
			resetPasswordExpires: {
				allowOnCreate: false,
				allowOnUpdate: false,
				exclude: true,
				type: DataTypes.STRING,
			},
			activateAccountToken: {
				allowOnCreate: false,
				allowOnUpdate: false,
				exclude: true,
				type: DataTypes.STRING,
			},
			activateAccountExpires: {
				allowOnCreate: false,
				allowOnUpdate: false,
				exclude: true,
				type: DataTypes.STRING,
			},
		},
		{
			tableName: 'users',
			paranoid: true
		},
	);


	// Model Relations
	User.associate = function (models) {
		User.belongsToMany(models.Role, { through: models.RealmsRolesUsers });
		User.belongsToMany(models.Realm, { through: models.RealmsRolesUsers });
		User.hasMany(models.RealmsRolesUsers);
	};

	User.schemaQuery = () => {
        const modelValidations = {
        	pippo: ModelValidation(User).pippo,
            filters: filters,
            pagination: pagination,
            sort: sort,
            math: math,
            extra: extra,
            query: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, extra)),
            FLRelations: FLRelations,
            SLRelations: SLRelations,
            ALLRelations: ALLRelations,
            Attributes: Attributes,
        };

		return modelValidations;
		};

	User.schemaPayload = () => {
		return Joi.object().keys({
			id: Joi.number().min(1),
			username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
			password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
			email: Joi.string().email().required(),
			isActive: Joi.boolean().valid(true, false).required(),
			firstName: Joi.string().min(1).max(64),
			lastName: Joi.string().min(1).max(64),
			createdAt: Joi.date(),
			updatedAt: Joi.date(),
			deletedAt: Joi.date(),
		})};

	return User;
};