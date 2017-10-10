
var Sequelize = require('sequelize');
var Dbconfig = require('./db.config');
var epilogue = require('epilogue');
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

					if(type == 'many' || type == 'one')
					{
						var childModel =  eachprop.items[0].instanceof;
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
				//console.log(model);
				result[title] = self.DBSql.define(title, model);
				for(var z in children)
				{
					console.log('children >'+children[z]);
					if(type == 'many')
					{
						result[title].hasMany(result[children[z]]);
					}
					if(type == 'one')
					{
						result[title].hasOne(result[children[z]]);
					}

				}

				var endpoints = ['/api/'+title, '/api/'+title+'/:id']
				console.log(endpoints);
				var userResource = epilogue.resource({
					model: result[title],
					endpoints: endpoints
				});

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
	removeData:function(tableName,data,cb)
	{

	},
	resetTables: function()
	{
		var self = this;
		var object = self.helpers.readJson('api/models/project/*.json',function(obj){
				self.loadSchemasSql(function(result){
					self.DBSql.sync();
				},obj);
		});
	},
	initTables:function ()
	{
		var self = this;
		var object = self.helpers.readJson('api/models/global/*.json',function(obj){
				self.loadSchemasSql(function(result){

					self.DBSql.sync().then(function() {
						self.server.listen(8000,function() {
							var host = self.server.address().address,
	 								port = self.server.address().port;
									console.log('listening at http://localhost:%s', port);
								});
					});

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



			epilogue.initialize({
			  app: app,
			  sequelize: self.DBSql
			});

			self.server = http.createServer(app);

			self.initTables();

	}
}
