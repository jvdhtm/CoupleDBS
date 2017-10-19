var Dbconfig = require('./db.config');
var http = require('http');
var crypto = require('crypto');
module.exports = {
	DBSql: '',
	DBNoSql: '',
	server: '',
	validators: [],
	endpoints: [],
	helpers: require('./helper'),
	getChildren: function(schema) {
		var self = this;
		var children = [];
		var prop = schema.properties;
		var title = schema.title;
		for (y in prop) {
			var type = prop[y].dbtype;
			var valuedef = prop[y].default;
			if (type == 'many' || type == 'one') {
				var childModel = prop[y].items[0].instanceof;
				children.push(childModel)
			}
		}
		return children;
	},
	mapTreetoArray: function(models) {
		var self = this;
		var obj = []
		for (x in models) {
			var schema = models[x];
			var title = schema.title;
			obj[title] = schema;
		}
		var visted = [];
		var parentvisted = [];
		var resultarray = [];
		var level = 0;
		for (x in obj) {
			var schema = obj[x];
			var prop = schema.properties;
			var title = schema.title;
			if (visted[title] == 1) {
				continue;
			}
			var stack = [];
			stack.push(title);
			while (stack.length !== 0) {
				var node = stack.pop();
				var children = self.getChildren(obj[node]);
				console.log(children);
				if (children.length == 0 || parentvisted[node] == 1) {
					resultarray[level] = obj[node];
					visted[node] = 1;
					level++;
				} else {
					parentvisted[node] = 1;
					stack.push(node);
					for (var c in children) {
						if (visted[children[c]] == 1) {
							continue;
						}
						stack.push(children[c]);
					}
				}
			}
		}
		var parents = [];
		var result = [];
		for (i = 0; i < resultarray.length; i++) {
			var schema = resultarray[i];
			var prop = schema.properties;
			var title = schema.title;
			var propnames = [];
			var model = [];
			for (y in prop) {
				var eachprop = prop[y];
				var type = prop[y].dbtype;
				var valuedef = prop[y].default;
				if (type != 'many' && type != 'one') {
					propnames.push(y)
					if (valuedef) {
						model[y] = {
							type: type,
							defaultValue: valuedef
						}
					} else {
						model[y] = {
							type: type,
							defaultValue: 0
						}
					}
				} else {
					var childModel = eachprop.items[0].instanceof;
					parents[childModel] = [];
					parents[childModel][title] = title;
				}
			}
			result[i] = {
				title: title,
				model: model
			};
			var endpoints = ['/api/' + title, '/api/' + title + '/:id', propnames];
			self.endpoints.push(endpoints);
		}
		return {
			models: result,
			parents: parents
		};
	},
	loadSchemasSql: function(cb, obj) {
		var self = this;
		var result = self.mapTreetoArray(obj);
		var models = result.models;
		var parents = result.parents;
		var createTable = function(index, callback) {
			if (models[index]) {
				var model = models[index].model;
				var title = models[index].title;
				console.log('Check Table > ' + title + ' index >' + index);
				self.DBSql.schema.hasTable(title).then(function(exists) {
					if (!exists) {
						console.log('create Table > ' + title);
						self.DBSql.schema.createTable(title, function(table) {
							table.increments('id').primary();
							for (var y in model) {
								var type = model[y].type;
								var value = model[y].defaultValue;
								if (type == 'string') {
									table.string(y, 255).defaultTo(value);
								}
								if (type == 'text') {
									table.text(y).defaultTo(value);;
								}
								if (type == 'int') {
									table.integer(y).defaultTo(value);;
								}
								if (type == 'Bigint') {
									table.bigInteger(y).defaultTo(value);;
								}
								if (type == 'float') {
									table.float(y).defaultTo(value);;
								}
								if (type == 'boolean') {
									table.boolean(y).defaultTo(value);;
								}
								if (type == 'json') {
									table.json(y).defaultTo(value);;
								}
								if (type == 'datetime') {
									table.timestamp(y).defaultTo(value)
								}
							}
							if (parents[title]) {
								for (var z in parents[title]) {
									var children = parents[title][z];
									table.integer(children + '_id').unsigned().references('id').inTable(children);
								}
							}
							table.timestamp('created_at').notNullable().defaultTo(self.DBSql.raw('now()'));
							table.timestamp('updated_at');
						}).then(function(resp) {
							index--;
							return createTable(index, callback);
						});
					} else {
						console.log('Table existed > ' + title);
						index--;
						return createTable(index, callback);
					}
				});
			} else {
				callback();
				return;
			}
		}
		createTable(models.length - 1, cb);
		/**/
	},
	loadSchemasNosql: function() {
		var self = this;
	},
	validate: function(tableName, data, cb) {},
	insertData: function(tableName, data, cb) {},
	updateData: function(tableName, data, cb) {},
	updateTable: function(tableName, data, cb) {},
	removeTable: function(tableName, data, cb) {},
	createTables: function() {},
	initTables: function() {},
	init: function(app, cb) {
		var self = this;
		var object = self.helpers.readJson('api/models/global/*.json', function(obj) {
			self.loadSchemasSql(function() {
				/*inser the first users with roles and permissions*/
				var role = {
					name: 'Marduk',
					info: '[{"desc":"Marduk sees everything"}]'
				};
				self.DBSql.insert(role).returning('id').into('dbroles').then(function(id) {
					var pass = crypto.createHash('md5').update('@eyes@eyes@eyes').digest("hex");
					var user = {
						name: 'Marduk',
						user: 'Marduk',
						key: pass,
						info: '[{"desc":"Marduk sees everything"}]',
						dbroles_id: id[0]
					};
					self.DBSql.insert(user).returning('id').into('dbusers').then(function() {});
					var permissions = {
						path: 'heavens',
						action: 'Dance',
						info: '[{"desc":"Marduk sees everything"}]',
						dbroles_id: id[0]
					};
					self.DBSql.insert(permissions).returning('id').into('dbpermissions').then(function() {});
				});
			}, obj);
		});
		self.DBSql = require('knex')({
			client: Dbconfig.dialect,
			connection: {
				host: Dbconfig.host,
				user: Dbconfig.user,
				port: Dbconfig.Port,
				password: Dbconfig.password,
				database: Dbconfig.Dbname
			}
		});
	}
}
