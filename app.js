var express = require("express");
var app = express();
var http = require('http');
var bodyParser = require("body-parser");
var PORT = 3000;
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(150, 'hour');
const rateLimit = require("express-rate-limit");

app.enable("trust proxy"); 

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10
});

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, x-api-key,x-pub-key,signature");
    next();
});

//files configure
app.use(express.static(__dirname + '/views'));

//body parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }))
// parse application/json
app.use(bodyParser.json({limit: '50mb', extended: true}))

// custom routes
const api = require('./routes/api');

// set rate limiters
app.use('/api', apiLimiter);

// Set our api routes
app.use('/api', api);

// Handle 404
app.use(function(req, res) {
    //res.send('404: Page not Found', 404);
    res.status(404).send({status:404, message: '404 Not Found', type:'client'}); 
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send({status:500, message: 'internal error', type:'internal'}); 
});

//listen
var httpServer = http.createServer(app);
httpServer.listen(PORT, () => console.log(`API running on localhost:${PORT}`));
