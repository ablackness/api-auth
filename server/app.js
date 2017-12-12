const express = require('express');
const morgan  = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');

const app = express();
var access_token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJVWTBPRUl6UTBJMU1qTTJOMFF5TURJNE1USkZRMFV5UkRWRE1USkdNREl4UkVJM05FWTVOZyJ9.eyJpc3MiOiJodHRwczovL2NvZGVibGFjay5hdXRoMC5jb20vIiwic3ViIjoidmd5UFBZTTRDVjNPUFVkOTBiaXhCZDFhYU9yVVNVWW1AY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImlhdCI6MTUxMzEwMjEzNywiZXhwIjoxNTEzMTg4NTM3LCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.fiQ2QKANbVGYoama99aX2obIlp-Xu0diG8FoYnChZhLMKQzz5lwQFIfA79rPHl51UlsZ_LPRsbZxUpZRjZ3T3LvuzrwDxGzEzXYFJ4ODzUZ9lshWuVnfNxzCCVx5PwL7Cjjo6oJptEuzdNwR-hMh3HeBvqgXe_s7uxRMyjqc4F-1JcxZ9cCjmIlWzlpdD2ftGPTfUhBSXe4EM4TAXZIKrDwIu4cUge22anfxytURMwFiItn59NrOKQPbvgPVbvGgfLonVfehfECKsFz8UUFtcABgC4gWIERDp8-8OtnQB8iF-YaouptXRW1vAZwti1Gmsl_mox7gv2NAWfWJ00dSWQ';

const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://codeblack.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'http://localhost:8080',
    issuer: `https://codeblack.auth0.com/`,
    algorithms: ['RS256']
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(cors);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.headers);
    next();
})

app.get('/', function(req, res) {
    res.status(200).send('HELLLO WORLD');
})
var info = {};

app.get('/api/info', checkJwt, jwtAuthz(['read:info']), function(req, res) {
    console.log(access_token, req.headers.Authorization);
    res.json(info);
})

app.post('/api/info', checkJwt, jwtAuthz(['write:info']), function(req, res) {
    info = req.body;

    res.json(info);
})

module.exports = app;