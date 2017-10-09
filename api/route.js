var functions = require('./global/dbsm.js');
var APIDB = require('./routes/api.js');

var routers = function (app)
{
	APIDB(app,functions);
}
module.exports = routers;
