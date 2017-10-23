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


    // get usr and pass
    // send back random token
    // save token inside session
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
