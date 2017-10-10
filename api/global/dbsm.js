
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

			console.log(obj);
			var self = this;
			var models = [];
			for(x in obj)
			{
			  var schema = obj[x];
			  var number  =   schema.number;
			  models[number] = schema;
			}
			var result = [];
			for(var x = 1; x <  models.length ; x++ )
			{

				var schema  =  models[x];
				var prop  =   schema.properties;
				var title  =   schema.title;

				var model = [];
				var children = [];
				var propnames = []
				for(y in prop)
				{
					var eachprop = prop[y];
					var type = prop[y].type;
					var valuedef = prop[y].default;

					if(type == 'many' || type == 'one')
					{
						var childModel =  eachprop.items[0].instanceof;
						children.push(childModel);
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
								type:type
							}

						}
					}
				}

				/*
					result[title] = self.DBSql.define(title, model);
					for(var z in children)
					{

						if(type == 'many')
						{
							result[title].hasMany(result[children[z]]);
						}
						if(type == 'one')
						{
							result[title].hasOne(result[children[z]]);
						}

					}
				*/

				var endpoints = ['/api/'+title, '/api/'+title+'/:id',]


			}
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
