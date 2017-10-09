
var Sequelize = require('sequelize');
var Dbconfig = require('db.config');


module.exports = {
	DBSql:'',
  DBNoSql:'',
	validators:[],
	schemas:[],
	helpers:require('helper'),
	loadSchemasSql:function(cb){

		var self = this;
		var object = helpers.readJson('api/model/*.json',function(obj){


			var models = [];
			for(x in obj)
			{
			  var schema = obj[x];
			  var title  =   schema.title;
			  models[title] = schema;
			}
			function walkThroughEach(result,titles,schema,obj)
			{

				var prop  =   schema.properties;
				var title  =   schema.title;
				var model = {};
				var children = [];
				for(y in prop)
				{
				  var modeltype = prop[y].type;
				  var default = prop[y].default;
				  if(modeltype == 'array' )
				  {
					  var childModel =  prop.items[0].instanceof;
					  var child = obj[childModel];
					  childModel = walkThroughEach(result,titles,child,obj);
					  children.push(childModel);
				  }
				  else {
						model[modeltype] = {
						  type:modeltype,
						  defaultValue:default
						}
				  }
				}
				if(titles.indexOf(title) == -1 )
				{
				  titles.push(title);
				  result[title] = sequelize.define(title, model);
				  for(x in childen)
				  {
					result.hasMany(children);

				  }
				}
				return result[title];
			}

			function  walkThrough(obj) {
					var result = [];

					for(x in obj)
					{
					  var schema = obj[x];
					  var titles = []
					  walkThroughEach(result,titles,schema,obj);
					}
					return result;
			  }


			var result = walkThrough(models);
			cb(result);

		});
	},
	loadSchemasNosql:function()
	{
		var self = this;
		var object = helpers.readJson('api/model/*.json',function(obj){

		});

	},
	validate : function (tableName,data)
	{

	},
	insertData:function(tableName,data,cb)
	{

	},
	updateData:function(tableName,data,cb)
	{

	},
	createTables: function()
	{

	},
	removeData:function(tableName,data,cb)
	{

	},
	initdb: function (conn, cb)
	{


	},
	initUsertables: function (conn, cb)
	{
		// getJson





	},
	load: function(functions)
	{
		this.helpers = functions;
	},
	init: function(app,cb){

    /*
		 self.DBSql = new Sequelize(Dbconfig.Dbname ,Dbconfig.username, Dbconfig.password , {
			  host: Dbconfig.host ,
			  port: Dbconfig.port,
				dialect: 'mariadb'

			});
      */


	}
}
