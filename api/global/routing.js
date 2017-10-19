module.exports = function letsRoute(app,endpoints,db)
{



  app.get('/:project/get-token', function (req, res) {

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

  app.delete('/api/:project*', function (req, res) {
    res.send('delete request to the API')
  });

  app.put('/api/:project/*', function (req, res) {
    res.send('put request to the API')
  });

}
