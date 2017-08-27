const BookshelfFactory = require('bookshelf');
const KnexFactory = require('knex');
const KnexConfig = require('../knexfile');
const SoftDelete = require('bookshelf-paranoia');
const BookshelfScopes = require('bookshelf-scopes');
const BookshelfModelBase = require('bookshelf-modelbase');
const BookshelfCamelCase = require('bookshelf-camelcase');
const BookshelfEloquent = require('bookshelf-eloquent');

// create connection to the database
const Knex = KnexFactory(KnexConfig.development);

// pass connection to bookshelf (used for object/relational mapping)
const Bookshelf = BookshelfFactory(Knex);

Bookshelf.plugin(BookshelfModelBase.pluggable);

// any options that may be passed to Model#fetchAll (such as withRelated)
// may also be passed in the options to fetchPage, as you can see in the example below.
// By default, with no parameters or missing parameters,
// fetchPage will use an options object of {page: 1, pageSize: 10}
// https://github.com/bookshelf/bookshelf/wiki/Plugin:-Pagination
Bookshelf.plugin('pagination');

// prevent cyclical dependencies when creating models
// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
Bookshelf.plugin('registry');

// allow virtual properties on models (custom getters and setters)
// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Virtuals
Bookshelf.plugin('virtuals');

// if visible or hidden attributes are defined on the model as arrays,
// the specified fields are hidden/shown as appropriate when calling toJSON.
// https://github.com/bookshelf/bookshelf/wiki/Plugin:-Visibility
Bookshelf.plugin('visibility');

Bookshelf.plugin(SoftDelete);

Bookshelf.plugin(BookshelfScopes);

Bookshelf.plugin(BookshelfCamelCase);

Bookshelf.plugin(BookshelfEloquent);



module.exports = Bookshelf;