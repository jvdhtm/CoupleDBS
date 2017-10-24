var APIDB = require('./global/dbsm.js');
var routes = require('./global/routing.js');

var routers = function (app)
{
	APIDB.init(app,function(){

		routes(app,APIDB);

	});


}
module.exports = routers;
