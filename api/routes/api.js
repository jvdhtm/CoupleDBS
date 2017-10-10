var api = function(app,functions){


    app.use('/api/*', function(req, response, next) {
      //check auth
      //validate if post put
        next();
    });
    app.post('/api/publish', function(req, response, next) {
        response.send('Hello Doc');
          functions.resetTables();
    });
    app.post('/api/gettoken', function(req, response, next) {
        response.send('Hello Doc');
    });
    functions.init(app);

}
module.exports = api;
