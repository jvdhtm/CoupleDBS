
var Dbconfig = require('./db.config');
var http = require('http');

module.exports = {
	DBSql:'',
  DBNoSql:'',
	server:'',
	validators:[],
	schemas:[],
	helpers:require('./helper'),
	loadSchemasSql:function(cb,obj){


			var self = this;
			var models = [];
			var result = [];
			var parents = [];
			var tplgy = [];
			var level = 0;
			for(x in obj)
			{
			  var schema = obj[x];
				var prop  =   schema.properties;
				var title  =   schema.title;
				tplgy[title] = level;
				var model = [];
				var propnames = [];
				for(y in prop)
				{
					var eachprop = prop[y];
					var type = prop[y].type;
					var valuedef = prop[y].default;
					if(type == 'many' || type == 'one')
					{
						var childModel =  eachprop.items[0].instanceof;
						if(typeof parents[childModel]  == 'undefined')
						{
								parents[childModel] = [];
								parents[childModel][title] =  title;
								level++;
						}
						else {
							parents[childModel][title] =  title;
						}
					}
					else {
						propnames.push(y)
						if(valuedef)
						{
							model[y] = {
								type:type,
								defaultValue:valuedef
							}
						}
						else {
							model[y] = {
								type:type,
								defaultValue:0
							}

						}
					}
				}
				if(typeof models[tplgy[title]] !=='undefined')
				{
					 	var count = tplgy[title];
						while(typeof models[count] !=='undefined')
						{
							count++;
							console.log('finding >'+ count + 'title '+title  );

						}
						models[count] = {title:title,model:model};
				}
				else {
					models[tplgy[title]] = {title:title,model:model};
				}

			}



			var createTable = function (index){



				if(models[index])
				{
					var model = models[index].model;
					var title = models[index].title;

					console.log('Check Table > '+title + ' index' +index);
					self.DBSql.schema.hasTable(title).then(function(exists) {
						if (!exists) {
							console.log('init Table > '+title);
							var query = self.DBSql.schema.createTable(title, function(table) {
							 table.increments('id').primary();
							 for(var y  in model)
							 {
									 var type = model[y].type;
									 var value = model[y].defaultValue;
									 if(type == 'string')
									 {
											 table.string(y, 255).defaultTo(value);
									 }
									 if(type == 'text')
									 {
											 table.text(y).defaultTo(value);;
									 }
									 if(type == 'int')
									 {
											 table.integer(y).defaultTo(value);;
									 }
									 if(type == 'Bigint')
									 {
											 table.bigInteger(y).defaultTo(value);;
									 }
									 if(type == 'float')
									 {
											 table.bigInteger(y).defaultTo(value);;
									 }
									 if(type == 'boolean')
									 {
											 table.boolean(y).defaultTo(value);;
									 }
									 if(parents[title])
									 {
										 for(var z in parents[title])
										 {
											 var children = parents[title][z];
											 table.foreign(children+'_id').references(children+'.id');
										 }
									 }
							 }
							 table.timestamps();
						 }).toString();

						 console.log(query);
						 index--;
						 return createTable(index);

					 }else {

						console.log('alter Table > '+title);
						index--;
						return createTable(index);
					 }

					});

				}
				else {
					return;
				}

			}

			console.log(models);
			createTable(level);
			var endpoints = ['/api/'+title, '/api/'+title+'/:id',propnames];
			cb();
	},
	loadSchemasNosql:function()
	{
		var self = this;

	},
	validate : function (tableName,data,cb)
	{

	},
	insertData:function(tableName,data,cb)
	{

	},
	updateData:function(tableName,data,cb)
	{

	},
	updateTable: function (tableName,data,cb)
	{


	},
	removeTable:function(tableName,data,cb)
	{


	},
	createTables: function()
	{


	},
	initTables:function ()
	{

	},
	init: function(app,cb){

			var self = this;
			var object = self.helpers.readJson('api/models/global/*.json',function(obj){
					self.loadSchemasSql(function(result){


					},obj);
			});


			self.DBSql = require('knex')({
				  client: Dbconfig.dialect,
				  connection: {
				    host : Dbconfig.host ,
				    user : Dbconfig.user,
						port: Dbconfig.Port,
				    password : Dbconfig.password,
				    database : Dbconfig.Dbname
				  }
				});


	}
}
