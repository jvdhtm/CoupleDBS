
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
			for(x in obj)
			{
			  var schema = obj[x];
				var prop  =   schema.properties;
				var title  =   schema.title;

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
						parents[title] = childModel ;
						model[y] = {
							type:type,
							defaultValue:valuedef
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
				models[title] = model;
			}

			knex.schema.hasTable(title).then(function(exists) {
				if (!exists) {
					return knex.schema.createTable(title, function(table) {
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
										table.text(y).defaultValue;;
								}
								if(type == 'int')
								{
										table.integer(y).defaultValue;;
								}
								if(type == 'Bigint')
								{
										table.bigInteger(y).defaultValue;;
								}
								if(type == 'float')
								{
										table.bigInteger(y).defaultValue;;
								}
								if(type == 'boolean')
								{
										table.boolean(y).defaultValue;;
								}
						}
						table.timestamps();
					});
				}
			});

			var endpoints = ['/api/'+title, '/api/'+title+'/:id',propnames]

			console.log(endpoints);


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


			var knex = require('knex')({
				  client: Dbconfig.dialect,
				  connection: {
				    host : Dbconfig.host +':'+ Dbconfig.port ,
				    user : Dbconfig.user,
				    password : Dbconfig.password,
				    database : Dbconfig.Dbname
				  }
				});


	}
}
