'use strict'
//libs
const express = require ('express');
const bodyParser = require('body-parser');
const app = express();
const formidable = require('express-form-data');
const fs = require('fs');

//routes
const api = require('./routes/routes');

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
app.use(formidable.parse({keepExtensions: true}));
app.use('/static', express.static("https://e-contacts-api.herokuapp.com/" + '/public'));
app.use('/api', api);


 module.exports=app