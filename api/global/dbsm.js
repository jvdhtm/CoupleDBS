
var Sequelize = require('sequelize');
var Dbconfig = require('./db.config');


module.exports = {
	DBSql:'',
  DBNoSql:'',
	validators:[],
	schemas:[],
	helpers:require('./helper'),
	loadSchemasSql:function(cb,obj){

			var self = this;
			var models = [];
			for(x in obj)
			{
			  var schema = obj[x];
			  var number  =   schema.number;
			  models[number] = schema;
			}

			console.log(models);

			var result = [];
			for(var x = 1; x <  models.length ; x++  )
			{

				var schema  =  models[x];
				var prop  =   schema.properties;
				var title  =   schema.title;

				var model = [];
				var children = [];
				for(y in prop)
				{
					var eachprop = prop[y];
					var type = prop[y].type;
					var valuedef = prop[y].default;


					if(type =='string')
					{
						modeltype = Sequelize.STRING;
					}
					if(type =='integer')
					{
						modeltype = Sequelize.INTEGER;
					}
					if(type =='bigint')
					{
						modeltype = Sequelize.BIGINT;
					}
					if(type =='date')
					{
						modeltype = Sequelize.DATE;
					}
					if(type =='text')
					{
						modeltype = Sequelize.TEXT;
					}
					else {

						modeltype = Sequelize.TEXT;
					}

					if(modeltype == 'array' )
					{
						var childModel =  prop.items[0].instanceof;
						children.push(childModel);
					}
					else {
						if(valuedef)
						{
							model[y] = {
								type:modeltype,
								defaultValue:valuedef
							}
						}
						else {
							model[y] = {
								type:modeltype
							}

						}

					}
				}

				console.log('model >'+title);
				console.log(model);
				result[title] = self.DBSql.define(title, model);
				for(x in children)
				{
					result[title].hasMany(result[children[x]]);
				}

			}

			self.DBSql.sync();
			cb(result);

	},
	loadSchemasNosql:function()
	{
		var self = this;

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
	removeData:function(tableName,data,cb)
	{

	},
	initTables:function (cb,jsonSchemas)
	{
		var self = this;
		var object = self.helpers.readJson('api/models/*.json',function(obj){

				self.loadSchemasSql(function(result){

						console.log(result);

				},obj);
		});
	},
	init: function(app,cb){

    /**/
			var self = this;
		 self.DBSql = new Sequelize(Dbconfig.Dbname ,Dbconfig.user, Dbconfig.password , {
			  host: Dbconfig.host ,
			  port: Dbconfig.port,
				dialect: 'mysql'
			});

			self.initTables(cb,'null')

	}
}
