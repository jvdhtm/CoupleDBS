var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var api = require("./api/route.js")(app);
