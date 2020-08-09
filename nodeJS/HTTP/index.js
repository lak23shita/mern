
//import of the http request
const http =require('http');
//read and write files from your local system
const fs=require('fs');
//it helps to specify the path is your local system
const path=require('path');

const hostname='localhost';
const port = 3000

const server = http.createServer((req,res)=>{
    //console.log(req.headers);
    console.log("Request for"+ req.url + 'by method' + req.method);
    //this will enable us to form a status code for thr response message
    //res.statusCode= 200;
    //this means that we are getting the response of the body in the form of html
    //res.setHeader('Content-Type','Text/html');
    //valid html response from server is
    //res.end('<html><body><h1>Hello World!</h1></body></html>');
    if(req.method=='GET'){
        var fileUrl;
        if(req.url == '/') fileUrl='/index.html';
        else fileUrl = req.url;

        var filePath = path.resolve('./HTTPRequest'+fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            //exists is the return variable
          fs.exists(filePath, (exists) => {
            if (!exists) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/html');
              res.end('<html><body><h1>Error 404: ' + fileUrl + 
                          ' not found</h1></body></html>');
              return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            //this means that agar error aya toh vo response ayega server se and vo response pipe hoga
            fs.createReadStream(filePath).pipe(res);
          });
        }
        else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end('<html><body><h1>Error 404: ' + fileUrl + 
                  ' not a HTML file</h1></body></html>');
        }
      }
      else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end('<html><body><h1>Error 404: ' + req.method + 
                  ' not supported</h1></body></html>');
      }
    })

//now we want to start the server so we will use the listen so that the server will listen the port no on which it will receive the response
//the function will be called when the server starts
server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`)
})