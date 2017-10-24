module.exports = function(app,dbs)
{

  app.use('*',function(req ,res ,next){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });


  app.post('/session/get-token', function (req, res, next) {
    var usernameReq = req.body.username;
    var passwordReq = req.body.password;
    dbs.checkLogin(usernameReq,passwordReq,function(token){
        res.send(token);
    },function(err){
        res.send(err);
    });
  });


  app.use('/api/*', function(req ,res ,next ){
    console.log('Time:', Date.now);
    var username = req.body.username;
    var token = req.body.token;
    dbs.checkSession(usernameReq,passwordReq,function(token){
        next();
    },function(err){
        res.send(err);
    });
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

  app.listen(3000, function(){
    console.log('listening on port 3000');
  });

}
