module.exports = function(sequelize, Sequelize) {

	let CntrGeoRepartition = sequelize.define('cntrGeoRepartition', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			name: {
				type: Sequelize.STRING,
                default4Select: true,
				unique: true,
				allowNull: false,
				validation: {
					len: [3,128]
				},
				query: Query.name,
			},
		},
		{
			tableName: 'cntrGeoRepartitions',
			paranoid: true,
			timestamps: true,
		},
	);

	// Class Method
	CntrGeoRepartition.associate = function (models) {
		CntrGeoRepartition.hasMany(models.CntrRegion, { foreignKey: 'geoRepartitionId', sourceKey: 'id' });
	};

	return CntrGeoRepartition;
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
			description: 'the Geo Repartition ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
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
	name: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 64,
					example: '{like}Nord',
				},
			},
			description: 'the geo repartition name: CntrGeoRepartition vs [{=}Nord,{<>}Sud,{like}Centro',
			example: ['{like}ord', '{like}entro'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{like}ord', '{like}entro']
		},
	},
};