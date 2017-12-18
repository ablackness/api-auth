const express = require('express');
const morgan  = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');

//DB dependencies

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
  userName: process.env.DB_USER, // update me
  password: process.env.DB_PASSWORD, // update me
  server: process.env.DB_SERVER,
  options: {
    database: process.env.DB_NAME
  }
}

var connection = new Connection(config);
var result = '';
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
      console.log('connected');
      // Read();
    // executeStatement();
  }
});

// function stringifyEmployeeParameters(employee) {
//   var parameters = '';
//   for (key in employee) {
//     if (typeof employee[key] === 'string') {
//       parameters = parameters + employee[key] + ', ';
//     }
//   }
//   console.log(parameters);
//   return parameters;
// }

function addEmployeePromise(employee) {
  return new Promise( (resolve, reject) => {
    console.log('Adding new employee...');

    var spStr = "exec ttAdmin.AddEmployee " + "'" + employee.EmployeeFirstName + "', '" + employee.EmployeeLastName + "', '" + employee.EmployeePosition + "', " + employee.EmployeeRate + ", " + employee.EmployeeCompanyID + ";"
    console.log(spStr);
    var request = new Request(
      spStr,
      function(err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' row(s) returned');
            console.log(null);
        }
      });

      var requestPromise = new Promise ( (res, rej) => {
        var results = [];
        var result = {}
        request.on('row', function(columns) {
          console.log(columns);
          var j;
          columns.forEach(function(column, i) {
              j = i;
              if (column.value === null) {
                  console.log('NULL');
              } else {
                  // result += column.value + " ";
                  result[column.metadata.colName] = column.value;
              }
          });
          console.log(result);
          results.push(result);
          result = {};
          console.log(results);
          if (j === columns.length - 1) {
            res(results);
          }
        });
        
      })

      requestPromise.then( info => {
        console.log('request promise',info);
        resolve(info);
      })
      
      // Execute SQL statement
      connection.execSql(request);
  })
}

function employeeByIdPromise(id) {
  return new Promise( (resolve, reject) => {
    console.log('Getting employee by ID...');

    var request = new Request(
      'exec ttAdmin.GetEmployeeByID ' + id + ';',
      function(err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' row(s) returned');
            console.log(null);
        }
      });

      var requestPromise = new Promise ( (res, rej) => {
        var results = [];
        var result = {}
        request.on('row', function(columns) {
          console.log(columns);
          var j;
          columns.forEach(function(column, i) {
              j = i;
              if (column.value === null) {
                  console.log('NULL');
              } else {
                  // result += column.value + " ";
                  result[column.metadata.colName] = column.value;
              }
          });
          console.log(result);
          results.push(result);
          result = {};
          console.log(results);
          if (j === columns.length - 1) {
            res(results);
          }
        });
        
      })

      requestPromise.then( info => {
        console.log('request promise',info);
        resolve(info);
      })
      
      // Execute SQL statement
      connection.execSql(request);
  })
}

function readPromise() {
  return new Promise( (resolve, reject) => {
    // function Read(callback) {
      console.log('Reading rows from the Table...');
  
      var request = new Request(
          'exec ttAdmin.GetEmployees;',
          function(err, rowCount, rows) {
          if (err) {
              console.log(err);
          } else {
              console.log(rowCount + ' row(s) returned');
              console.log(null);
          }
      });
  
      // var result = "";
      
      var requestPromise = new Promise ( (res, rej) => {
        var results = [];
        var result = {}
        request.on('row', function(columns) {
          console.log(columns);
          var j;
          columns.forEach(function(column, i) {
              j = i;
              if (column.value === null) {
                  console.log('NULL');
              } else {
                  // result += column.value + " ";
                  result[column.metadata.colName] = column.value;
              }
          });
          console.log(result);
          results.push(result);
          result = {};
          console.log(results);
          if (j === columns.length - 1) {
            res(results);
          }
        });
        
      })

      requestPromise.then( info => {
        console.log('request promise',info);
        resolve(info);
      })
      
      // Execute SQL statement
      connection.execSql(request);
  // }
  })
}

// Express app and Authentication
const app = express();
// app.use(express.static('./build'));

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
//add middleware
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

app.get('/', function(req, res) {
    res.status(200).send('HELLLO WORLD');
})

app.post('/api/employee/add', checkJwt, jwtAuthz(['write:info']), function(req, res) {
  var employee = req.body;
  console.log(employee);
  var addPromise = addEmployeePromise(employee);

  addPromise.then( id => {
    console.log(id);
    res.send(id);
  })
  
})

app.get('/api/employee/:id', checkJwt, jwtAuthz(['read:info']), function(req, res) {
  var employeePromise = employeeByIdPromise(req.params.id);

  employeePromise.then( e => {
    console.log(e);
    res.send(e);
  })
})

app.get('/api/employees', checkJwt, jwtAuthz(['read:info']), function(req, res) {   
    var infoPromise = readPromise();

    infoPromise.then( info => {
      console.log('readPromise',info);
      res.send(info)
    });
    
})

module.exports = app;