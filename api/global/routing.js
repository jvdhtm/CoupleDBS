module.exports = function letsRoute(app,endpoints,db)
{



app.use('*',function(req ,res ,next){

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
})


  app.post('/session/:project/get-token', function (req, res, next) {
    var projectname = req.params.project;

    var usernameReq = req.body.username;
    var passwordReq = req.body.password;



    db('users')
      .where({ user: usernameReq })
      .select('key')
      .then(function(result) {
        if (!result || !result[0])  {  // not found!
          // report invalid username


          return;
        }
        var pass = result[0].password;
        if (passwordReq === pass) {

            res.send('get request to the API');


          // login
        } else {
          // failed login
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    // get usr and pass
    // send back random token based on IP and username an time  72hour
    // save token inside db if there is user

    res.send('get request to the API');

  });



  app.use('/api/:project/*', function(req ,res ,next ){
    console.log('Time:', Date.now);

    next();
  })
  app.get('/api/:project/*', function (req, res) {
    res.send('get request to the API');

  })


  app.post('/api/:project/*', function (req, res) {
    res.send('post request to the API')
  });

  app.delete('/api/:project/*', function (req, res) {
    res.send('delete request to the API')
  });

  app.put('/api/:project/*', function (req, res) {
    res.send('put request to the API')
  });

}
