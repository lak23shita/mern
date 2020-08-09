const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

const hostname = 'localhost';
const port = 3000;

// ---> an object of express node_module is created
const app = express();
// ---> morgan helps in logging the req.url and req.status
app.use(morgan('dev'));
// ---> Using middleware bodyParser to parse the JSON Body taht can be accessed by using req.body
app.use(bodyParser.json());
// ---> This means that any request with /dishes will be handled by dishRouter
app.use('/dishes', dishRouter)
// ---> For leaders and promo
app.use('/promotions',promoRouter)
app.use('/leaders',leaderRouter)
// ---> This will tell express to serve up the static files by looking from root (__dirname) of the folder and find public
app.use(express.static(__dirname+ '/public'))

// ---> Default code executed irrespective of req.method
app.all('/dishes', (req,res,next) => {
  res.statusCode = 200; // Status code ok
  res.setHeader('Content-Type', 'text/plain');
  next(); // ---> This next will now look for the appropriate function to be executed based on req.method and req, req will be passed to thos methods as call back
});

//------------- CRUD FOR ALL DISHES ----------------

// ---> Read
app.get('/dishes', (req,res,next) => {
    res.end('Will send all the dishes to you!');
});
// ---> Create
app.post('/dishes', (req, res, next) => {
 res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});
// ---> Update (Not supported to update all dishes at once)
app.put('/dishes', (req, res, next) => {
  res.statusCode = 403; // Not supoorted status code
  res.end('PUT operation not supported on /dishes');
});
// ---> Delete 
app.delete('/dishes', (req, res, next) => {
    res.end('Deleting all dishes');
});

// ----------- CRUD FOR DISHES WITH DISH ID -------------

app.get('/dishes/:dishId', (req,res,next) => {
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
});
// ---> Does not support push operation on a particular dish since it exists already, rather you you have to update using PUT
app.post('/dishes/:dishId', (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
});

app.put('/dishes/:dishId', (req, res, next) => {
  res.write('Updating the dish: ' + req.params.dishId + '\n'); // res.write Can be use to add a line to reply message
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
});

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});



app.use((req, res, next) => {
//   console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

// ---> It will start the server
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});