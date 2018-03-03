const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const GeoRepartitionValidation = require('../../url_validation/geo_repartition_validation');
const GeoRepartitionHandler = require('../handler/geo_repartition_handlers');
const ErrorHelper = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/cntr/geoRepartitions',
		config: {
			handler: GeoRepartitionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'GET GeoRepartitions List',
			notes: ['Returns GeoRepartitions list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthGeoRepartition First Level Relations: ' + GeoRepartitionValidation.FLRelations + '<br>' +
			'AuthGeoRepartition Second Level Relations: ' + GeoRepartitionValidation.SLRelations + '<br>' +
			'Attributes: ' + GeoRepartitionValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryAll,
				// query: GeoRepartitionValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}',
		config: {
			handler: GeoRepartitionHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'GET One AuthGeoRepartition',
			notes: ['Returns a AuthGeoRepartition identified by the params {geoRepartitionId} <br>' +
			'Attributes: ' + GeoRepartitionValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryOne,
				params: GeoRepartitionValidation.oneParams,
				// query: GeoRepartitionValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/cntr/geoRepartitions',
		config: {
			handler: GeoRepartitionHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'POST a New AuthGeoRepartition',
			notes: ['Save a new AuthGeoRepartition with params in payload with one or more Child object.<br>' +
			'AuthGeoRepartition hasMany Child Model: AuthGeoRepartition object can contain one or more Child object <br>' +
			'AuthGeoRepartition BelongsToMany Child Model: AuthGeoRepartition object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				payload: GeoRepartitionValidation.postPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}',
		config: {
			handler: GeoRepartitionHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'PUT an Updated AuthGeoRepartition',
			notes: ['Save an updated AuthGeoRepartition with params in payload <br>'],
			validate: {
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				params: GeoRepartitionValidation.oneParams,
				payload: GeoRepartitionValidation.putPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}',
		config: {
			handler: GeoRepartitionHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'DELETE an AuthGeoRepartition',
			notes: ['Delete un AuthGeoRepartition <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				params: GeoRepartitionValidation.oneParams,
				payload: GeoRepartitionValidation.deleteOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/cntr/geoRepartitions/',
		config: {
			handler: GeoRepartitionHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'DELETE many GeoRepartitions by Ids Array',
			notes: ['Delete many GeoRepartitions <br>'],
			validate: {
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				// params: GeoRepartitionValidation.paramOne,
				payload: GeoRepartitionValidation.deleteManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}/{childModel}/{childId}',
		config: {
			handler: GeoRepartitionHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'ADD one related Model to AuthGeoRepartition',
			notes: ['Add one related model (to save) to a persisted AuthGeoRepartition <br>' +
			'Add a persisted child Model to AuthGeoRepartition.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				params: GeoRepartitionValidation.addOneParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}/{childModel}/{childId}',
		config: {
			handler: GeoRepartitionHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'Remove one related Model from AuthGeoRepartition',
			notes: ['Remove one related model (delete) from a persisted AuthGeoRepartition <br>' +
			'AuthGeoRepartition hasMany Child Model: AuthGeoRepartition object can contain one or more Child object <br>' +
			'AuthGeoRepartition BelongsToMany Child Model: AuthGeoRepartition object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				params: GeoRepartitionValidation.removeOneParams,
				payload: GeoRepartitionValidation.removeOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}/{childModel}',
		config: {
			handler: GeoRepartitionHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'ADD one or more related Model to AuthGeoRepartition',
			notes: ['Add one or more related model (to save) to an existed AuthGeoRepartition <br>' +
			'AuthGeoRepartition hasMany Child Model: AuthGeoRepartition object can contain one or more Child object <br>' +
			'AuthGeoRepartition BelongsToMany Child Model: AuthGeoRepartition object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				params: GeoRepartitionValidation.addManyParams,
				payload: GeoRepartitionValidation.addManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}/{childModel}',
		config: {
			handler: GeoRepartitionHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'Remove one or many related Model from AuthGeoRepartition',
			notes: ['Remove one or many related model (delete) from a persisted AuthGeoRepartition <br>' +
			'AuthGeoRepartition hasMany Child Model: AuthGeoRepartition object can contain one or more Child object <br>' +
			'AuthGeoRepartition BelongsToMany Child Model: AuthGeoRepartition object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryLang,
				params: GeoRepartitionValidation.removeManyParams,
				payload: GeoRepartitionValidation.removeManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/cntr/geoRepartitions/{geoRepartitionId}/{childModel}',
		config: {
			handler: GeoRepartitionHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'Get All AuthGeoRepartition related child model with query filters',
			notes: ['Get All records of AuthGeoRepartition related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.queryGetAll,
				params: GeoRepartitionValidation.getAllParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/cntr/geoRepartitions/4Select',
		config: {
			handler: GeoRepartitionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'Logged'],
				},
			tags: ['api', 'GeoRepartitions'],
			description: 'GET GeoRepartitions List for Input Select',
			notes: ['Returns GeoRepartitions list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthUser First Level Relations, only for query: ' + GeoRepartitionValidation.FLRelations + '<br>' +
			'AuthUser Second Level Relations only for query: ' + GeoRepartitionValidation.SLRelations + '<br>' +
			'Attributes: ' + GeoRepartitionValidation.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: GeoRepartitionValidation.query4Select,
				// query: UserValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];