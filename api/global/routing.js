module.exports = function letsRoute(app,endpoints,db)
{



app.use('*',function(req ,res ,next){

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
})



  app.post('/session/get-token', function (req, res, next) {

    
    var usernameReq = req.body.username;
    var passwordReq = req.body.password;
    db.checkLogin(username,password,function(token){

        res.send('get request to the API');

    },function(err){

        res.send('get request to the API');

    });
  });



  app.use('/api/*', function(req ,res ,next ){
    console.log('Time:', Date.now);

    next();
  })
  app.get('/api/*', function (req, res) {
    res.send('get request to the API');

  })


  app.post('/api/*', function (req, res) {
    res.send('post request to the API')
  });

  app.delete('/api/*', function (req, res) {
    res.send('delete request to the API')
  });

  app.put('/api/*', function (req, res) {
    res.send('put request to the API')
  });

}
