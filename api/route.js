var routers = function (app)
{
	projectsAPi(app,dblibrary,functions);
	RESTfulApi(app,dblibrary,functions);
}

module.exports = routers;
