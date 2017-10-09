var api = function(app,functions){

    functions.init();




    app.post('/auth/gettoken', function(req, response, next) {
      //username
      //password
      //time
      var token = req.body.usr;
      var geo = req.body.pass;

      //give a tokenback

      //save the token

      var token = 'somthing';
      response.send(token);


    });


    app.post('/api/*', function(req, response, next) {

       var user_id = req.body.id;
       var token = req.body.token;
       var geo = req.body.geo;

       next();
    });


    app.post('/api/auth/', function(req, response, next) {


          var path = req.body.path;
          var user_id = req.body.path;


    });


    app.post('/api/init/', function(req, response, next) {

          var token = req.params.token;


    });

}


module.exports = api;
