var Dbconfig = require('./db.config');
var http = require('http');
var crypto = require('crypto');
module.exports = {
	DBSql: '',
	DBNoSql: '',
	server: '',
	validators: [],
	endpoints: [],
	cipherAlg: 'aes-256-ctr',
	cipherKey: Dbconfig.hashkey,
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
				var unique = prop[y].unique;
				if (type != 'many' && type != 'one') {
					propnames.push(y)
					if (valuedef) {
						model[y] = {
							type: type,
							unique:unique,
							defaultValue: valuedef
						}
					} else {
						model[y] = {
							type: type,
							unique:unique,
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
	checkLogin:function(username,password,cb,err){
		var self = this;

		var users = 'dbusers-'+Dbconfig.hashkey;
		var id ='id_'+Dbconfig.hashkey;
		var key = 'key_'+Dbconfig.hashkey;
		var session = 'session_'+Dbconfig.hashkey;

		var ConWhere =  JSON.parse('{ "id_'+Dbconfig.hashkey +'"":"'+ id +'"}');

		var query = self.DBSql(users).where({ user: username }).select(id,key).then(function(result) {
        if (!result || !result[0])  {
					err({ msg: 401, err:'username'});
          return;
        }
        var pass = result[0][key];
				var id = result[0][id];
				var passwordReqMD5 = crypto.createHash('md5').update(password).digest("hex");
        if (passwordReqMD5 === pass) {
					var d1 =  new Date();
					var twoWeeks =  1000 * 60 * 60 * 24 * 14;
					var twoWeeksAhead = new Date(d1.getTime()+twoWeeks);
					var session = id + twoWeeksAhead + password;
					var token =  crypto.createHash('md5').update(session).digest("hex");
        	cb({ msg: 202 , token:token});
					self.DBSql(users).update(session, token ).update('updated_at', 'NOW()').where(ConWhere).then(function(result) {});
        } else {
					err({ msg: 401 , err:'password'});
        }
      });

	},
	checkSession:function(session,username,path,action,cb,err){

		var self = this;
		var id ='id_'+Dbconfig.hashkey;
		var session = 'session_'+Dbconfig.hashkey;
		var path = 'path_'+Dbconfig.hashkey;
		var action = 'action_'+Dbconfig.hashkey;
		var dbroles_id = 'dbroles_id_'+Dbconfig.hashkey;

		var users = 'dbusers-'+Dbconfig.hashkey;
		var roles = 'dbroles-'+Dbconfig.hashkey;
		var permissions = 'dbpermissions-'+Dbconfig.hashkey;

		var query = self.DBSql(users).where({ user: username }).select(session,self.DBSql.raw(users+'.'+id+' as id'),path,action)
		.innerJoin(roles, users+'.'+dbroles_id, '=', dbroles_id+'.'+id)
		.innerJoin(permissions, permissions+'.'+dbroles_id, '=', dbroles_id+'.'+id).then(function(result) {

			if (!result || !result[0])  {
				err({ msg: 401, err:'username'});
				return;
			}
			var Sid = result[0][session];
			var updated_at = result[0].updated_at;
			var id = result[0].id;
			if(Sid){
					if (session === Sid) {
						for(var x in result){

							if(result[x][path]== 'heavens' || result[x][path] == path)
							{
									if(result[x][action] == action || result[x][action] =='Dance')
									{
										cb();
										break;
									}
									else {
										err({ msg: 401 , err: action + 'is not allowed'});
										break;
									}

							}
							else {

								err({ msg: 401 , err:'path is not allowed'});
								break;
							}

						}
						return;
					}
					else {
						var d2 = new Date();
						var twoWeeks =  1000 * 60 * 60 * 24 * 14;
						var d1 =  new Date(updated_at);
						var twoWeeksAhead = new Date(d1.getTime()+twoWeeks);
						if(twoWeeksAhead < d2){
							err({ msg: 401 , err:'not allowed'});
						} else {
							err({ msg: 440 , err:'expired'});
						}

					}

				}
				else {
					err({ msg: 401 , err:'no session'});
					return;
				}
      });
	},
	loadSchemasSql: function(obj,cb) {
		var self = this;
		var result = self.mapTreetoArray(obj);
		var models = result.models;
		var parents = result.parents;
		var createTable = function(index, callback) {
			if (models[index]) {
				var model = models[index].model;
				var title = models[index].title;
				var tablename = self.encrypt(title);
				console.log('Check Table > ' + title + ' index >' + index);
				self.DBSql.schema.hasTable(tablename).then(function(exists) {
					if (!exists) {
						console.log('create Table > ' + title);
						self.DBSql.schema.createTable(tablename, function(table) {


							table.increments(self.encrypt('id')).primary();

							var uniques = [];
							for (var y in model) {
								var type = model[y].type;
								var value = model[y].defaultValue;
								var unique = model[y].unique;

								var colname = self.encrypt(y);
								if (type == 'string') {
									table.string(colname, 255).defaultTo(value);
								}
								if (type == 'text') {
									table.text(colname).defaultTo(value);;
								}
								if (type == 'int') {
									table.integer(colname).defaultTo(value);;
								}
								if (type == 'Bigint') {
									table.bigInteger(colname).defaultTo(value);
								}
								if (type == 'float') {
									table.float(colname).defaultTo(value);;
								}
								if (type == 'boolean') {
									table.boolean(colname).defaultTo(value);;
								}
								if (type == 'json') {
									table.json(colname).defaultTo(value);;
								}
								if (type == 'datetime') {
									table.timestamp(colname).defaultTo(value)
								}
								if(unique == 1)
								{
										uniques.push(colname)
								}
							}
							if(uniques.length > 0)
							{
								table.unique(uniques);
							}

							if (parents[title]) {
								for (var z in parents[title]) {
									var children = parents[title][z];
									table.integer(self.encrypt(children + '_id')).unsigned().references(self.encrypt('id')).inTable(self.encrypt(children));
								}
							}
							table.timestamp(self.encrypt('created_at')).notNullable().defaultTo(self.DBSql.raw('now()'));
							table.timestamp(self.encrypt('updated_at'));
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
	},
	encrypt: function (string){
		var self = this;
		var cipher = crypto.createCipher(self.cipherAlg,self.cipherKey)
		var encrypted = cipher.update(string, 'utf8', 'hex') + cipher.final('hex');
		return encrypted;

	},
	decrypt: function (string){
		var self = this;
		var decipher = crypto.createDecipher(self.cipherAlg, self.cipherKey);
		var decrypted = decipher.update(string, 'hex', 'utf8') + decipher.final('utf8');
		return decrypted;
	},
	encryptObj: function (obj){
		var self = this;

		var encObj = {};
		var flag = 0;
		if(  obj.constructor === Array)
		{
				flag = 1;
				var encObj = [];
		}

		for (var o in obj) {

				var each ='';
				var y = self.encrypt(o);
				if (typeof obj[o] == "object") {
					var encrypted = self.encryptObj(obj[o]);
					each = JSON.stringify(encrypted);
				}
				else {
					if(o.indexOf('_id') > -1){
						each =  obj[o];
					} else {
						each = self.encrypt(obj[o]);
					}
				}


				if(flag == 1) {
					encObj.push(each);
				} else {
					encObj[y] = each;
				}

			}

		return encObj;
	},
	loadSchemasNosql: function(obj, cb) {
		var self = this;
	},
	validate: function(tableName, data, cb) {},
	insertData: function(tableName, data, cb,err) {

		var self = this;
		var encdata = self.encryptObj(data);
		var encid = self.encrypt('id');
		var enctable =  self.encrypt(tableName);


				self.DBSql.insert(encdata).returning(encid).into(enctable).then(function(id) {
					var id =  id[0];
					cb(id);
				}).catch(function(error) {
						if(err){
							err();
						}
		 				if(cb){
							self.DBSql(enctable).select(encid).orderBy(encid, 'desc').limit(1).then(function(result) {
								var id = result[0][encid];
								cb(id);
							});
						}
				});


	},
	updateData: function(tableName, data, cb) {},
	updateTable: function(tableName, data, cb) {},
	removeTable: function(tableName, data, cb) {},
	createTables: function() {},
	initTables: function() {},
	init: function(app, cb) {
		var self = this;
		var object = self.helpers.readJson('api/models/global/*.json', function(obj) {

      self.loadSchemasSql(obj,function() {
				/*inser the first users with roles and permissions*/

				var role = {
					"name": "Marduk",
					"info": [{"desc":"Marduk sees everything"}]
				};

				self.insertData('dbroles',role,function(id){

					var pass = crypto.createHash('md5').update('@eyes@eyes@eyes').digest("hex");
					var user = {
						"name": "Marduk",
						"user": "Marduk",
						"key": "pass",
						"info": [{"desc":"Marduk sees everything"}],
						"dbroles_id": id
					};

					self.insertData('dbusers',user,function(id){});

					var permissions = {
						"path": "heavens",
						"action": "Dance",
						"info": [{"desc":"Marduk sees everything"}],
						"dbroles_id": id
					};

					self.insertData('dbpermissions',permissions,function(id){});

				});


			});


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
