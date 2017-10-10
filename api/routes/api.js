var api = function(app,functions){


    app.use('/api/*', function(req, response, next) {
      //check auth
      //validate if post put
        next();
    });

    
    app.get('/api/publish', function(req, response, next) {

          functions.createTables();
    });
    app.post('/api/gettoken', function(req, response, next) {
        response.send('Hello Doc');
    });


    functions.init(app);

}
module.exports = api;
