const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const RegionValidation = require('../../url_validation/region_validation');
const RegionHandler = require('../handler/region_handlers');
const ErrorHelper = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/cntr/regions',
		config: {
			handler: RegionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'GET Regions List',
			notes: ['Returns Regions list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'CntrRegion First Level Relations: ' + RegionValidation.FLRelations + '<br>' +
			'CntrRegion Second Level Relations: ' + RegionValidation.SLRelations + '<br>' +
			'Attributes: ' + RegionValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryAll,
				// query: RegionValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/cntr/regions/{regionId}',
		config: {
			handler: RegionHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'GET One CntrRegion',
			notes: ['Returns a CntrRegion identified by the params {regionId} <br>' +
			'Attributes: ' + RegionValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryOne,
				params: RegionValidation.oneParams,
				// query: RegionValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/cntr/regions',
		config: {
			handler: RegionHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'POST a New CntrRegion',
			notes: ['Save a new CntrRegion with params in payload with one or more Child object.<br>' +
			'CntrRegion hasMany Child Model: CntrRegion object can contain one or more Child object <br>' +
			'CntrRegion BelongsToMany Child Model: CntrRegion object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				payload: RegionValidation.postPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/cntr/regions/{regionId}',
		config: {
			handler: RegionHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'PUT an Updated CntrRegion',
			notes: ['Save an updated CntrRegion with params in payload <br>'],
			validate: {
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				params: RegionValidation.oneParams,
				payload: RegionValidation.putPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/cntr/regions/{regionId}',
		config: {
			handler: RegionHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'DELETE an CntrRegion',
			notes: ['Delete un CntrRegion <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				params: RegionValidation.oneParams,
				payload: RegionValidation.deleteOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/cntr/regions/',
		config: {
			handler: RegionHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'DELETE many Regions by Ids Array',
			notes: ['Delete many Regions <br>'],
			validate: {
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				// params: RegionValidation.paramOne,
				payload: RegionValidation.deleteManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/cntr/regions/{regionId}/{childModel}/{childId}',
		config: {
			handler: RegionHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'ADD one related Model to CntrRegion',
			notes: ['Add one related model (to save) to a persisted CntrRegion <br>' +
			'Add a persisted child Model to CntrRegion.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				params: RegionValidation.addOneParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/cntr/regions/{regionId}/{childModel}/{childId}',
		config: {
			handler: RegionHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'Remove one related Model from CntrRegion',
			notes: ['Remove one related model (delete) from a persisted CntrRegion <br>' +
			'CntrRegion hasMany Child Model: CntrRegion object can contain one or more Child object <br>' +
			'CntrRegion BelongsToMany Child Model: CntrRegion object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				params: RegionValidation.removeOneParams,
				payload: RegionValidation.removeOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/cntr/regions/{regionId}/{childModel}',
		config: {
			handler: RegionHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'ADD one or more related Model to CntrRegion',
			notes: ['Add one or more related model (to save) to an existed CntrRegion <br>' +
			'CntrRegion hasMany Child Model: CntrRegion object can contain one or more Child object <br>' +
			'CntrRegion BelongsToMany Child Model: CntrRegion object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				params: RegionValidation.addManyParams,
				payload: RegionValidation.addManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/cntr/regions/{regionId}/{childModel}',
		config: {
			handler: RegionHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'Remove one or many related Model from CntrRegion',
			notes: ['Remove one or many related model (delete) from a persisted CntrRegion <br>' +
			'CntrRegion hasMany Child Model: CntrRegion object can contain one or more Child object <br>' +
			'CntrRegion BelongsToMany Child Model: CntrRegion object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryLang,
				params: RegionValidation.removeManyParams,
				payload: RegionValidation.removeManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/cntr/regions/{regionId}/{childModel}',
		config: {
			handler: RegionHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Regions'],
			description: 'Get All CntrRegion related child model with query filters',
			notes: ['Get All records of CntrRegion related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.queryGetAll,
				params: RegionValidation.getAllParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/cntr/regions/4Select',
		config: {
			handler: RegionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'Logged'],
				},
			tags: ['api', 'Regions'],
			description: 'GET Regions List for Input Select',
			notes: ['Returns Regions list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'CntrUser First Level Relations, only for query: ' + RegionValidation.FLRelations + '<br>' +
			'CntrUser Second Level Relations only for query: ' + RegionValidation.SLRelations + '<br>' +
			'Attributes: ' + RegionValidation.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RegionValidation.query4Select,
				// query: UserValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];