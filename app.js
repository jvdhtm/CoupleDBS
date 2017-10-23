var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var sessionConfig = require('./session.config');
var app = express();

app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: sessionConfig.secret,
  cookie: { maxAge: sessionConfig.maxAge }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var api = require("./api/route.js")(app);
