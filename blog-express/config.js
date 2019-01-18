var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();
var csurf = require('csurf');
var cors = require('cors');

var corsOptions = {
    origin:'http://localhost:4200',
    optionsSuccessStatus:200,
    exposedHeaders: ['x-access-token']
}

app.use(helmet());
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(err, req, res, next){
    const token = req.headers['x-access-token'];
});

app.use(function(err, req, res, next){
    console.error(err.stack)
    res.status(500).send('Something broke');
    next();
});

app.listen(3000, function(){
    console.log('Serve in 3000');
});

module.exports = app;