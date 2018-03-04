module.exports = function(sequelize, Sequelize) {

	let CntrRegion = sequelize.define('cntrRegion', {

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
			tableName: 'cntrRegions',
			paranoid: true,
			timestamps: true,
		},
	);

	// Class Method
	CntrRegion.associate = function (models) {
		CntrRegion.belongsTo(models.CntrGeoRepartition, { foreignKey: 'geoRepartitionId', sourceKey: 'id' });
	};

	return CntrRegion;
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
			description: 'the Region ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
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
					example: '{like}Piemonte',
				},
			},
			description: 'the Region name: CntrRegion vs [{=}Lombardia,{<>}Veneto,{like}Toscana',
			example: ['{like}egna', '{like}eneto'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{like}scana', '{like}ardia']
		},
	},
};