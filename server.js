// LOAD IN REQUIRED MODULES FOR SERVER SETUP
const http = require('http');
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');
const figlet = require('figlet')


//DEFINE SERVER CREATION
const server = http.createServer((req, res) => {
  const page = url.parse(req.url).pathname; // url parse method is used on the url property of incoming request, this returns an object with all the parts of the url string as its properties. The page is the pathname
  const params = querystring.parse(url.parse(req.url).query); // Find the query parameters associated with the querystring passed with the url(if any exist), presented as an array
  function lastDigit(str1, str2) { 
    /*
    The last digit of any base raised to any power will cycle through a small set of values
    e.g. with base= 2: lastDigit(2^1) = 2, lastDigit(2^2) = 4, lastDigit(2^3) = 8, lastDigit(2^4) = 6, lastDigit(2^5) = 2...
  
    Therefore the last digit of any exponent can be found by finding the last digit cycle.
    By using BigInt to account for very large powers, the remainder of the power divided by the number of last digit cycle members indicates which last digit the exponent will have
    */
  
    let base = lastDigitOfANumber(str1)
    let power = BigInt(str2)
    if (power === 0n) { // Handles edge case of x^0
      return 1
    }
    let lastDigitOfExponent = lastDigitOfANumber(str1)
    let arrayOfLastDigitExponentCycleValues = []
    for (let i = 0; !arrayOfLastDigitExponentCycleValues.includes(lastDigitOfExponent); i++) { //Populates last digit cycle array, ends when a value already recorded in the array is produced
        arrayOfLastDigitExponentCycleValues[i] = lastDigitOfExponent
        lastDigitOfExponent = lastDigitOfANumber(lastDigitOfExponent*base)
    }
    let positionInCycle = power - 1n 
    if (power>BigInt(arrayOfLastDigitExponentCycleValues.length)) {
        positionInCycle %= BigInt(arrayOfLastDigitExponentCycleValues.length)
    }
    positionInCycle = Number(positionInCycle)
    return arrayOfLastDigitExponentCycleValues[positionInCycle]
  }
  
  function lastDigitOfANumber(number) {
    if (typeof number !== 'string') {
        number = number.toString()
    }
    let lastDigit = Number(number[number.length-1])
    return lastDigit  
  }

  if (page == '/') { // The default homepage is '/'
    fs.readFile('index.html', function(err, data) { // Read the index file
      res.writeHead(200, {'Content-Type': 'text/html'}); // Sends a response header to the request indicating text content that is html is being sent
      res.write(data); // Sends data to the client (web browser in this case)
      res.end(); // Signifies all data has been sent to the client
    });
  }
  else if (page == '/otherpage') { // A placeholder page that can only be accessed by directly entering the url into the browser
    fs.readFile('otherpage.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if (page == '/otherotherpage') { // A placeholder page that can only be accessed by directly entering the url into the browser
    fs.readFile('otherotherpage.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if (page == '/api') { // Handles api requests from the client side 
    if ('base' in params & 'exponent' in params) {
      res.writeHead(200, {'Content-Type': 'application/json'})
    }

    const base = params['base'][0]; // Within the query parameter object
    const power = params['exponent'][1]; //
    const result = lastDigit(base,power)
    res.writeHead(200, {'Content-Type': 'application/json'});
    const objToJson = {
      lastDigit: result,
    }
    res.end(JSON.stringify(objToJson));

    // if('student' in params){
    //   if(params['student']== 'leon'){
    //     res.writeHead(200, {'Content-Type': 'application/json'});
    //     const objToJson = {
    //       name: "leon",
    //       status: "Boss Man",
    //       currentOccupation: "Baller"
    //     }
    //     res.end(JSON.stringify(objToJson));
    //   }//student = leon
    //   else if(params['student'] != 'leon'){
    //     res.writeHead(200, {'Content-Type': 'application/json'});
    //     const objToJson = {
    //       name: "unknown",
    //       status: "unknown",
    //       currentOccupation: "unknown"
    //     }
    //     res.end(JSON.stringify(objToJson));
    //   }//student != leon
    // }//student if
  }//else if
  else if (page == '/css/style.css'){
    fs.readFile('css/style.css', function(err, data) {
      res.write(data);
      res.end();
    });
  }else if (page == '/js/main.js'){
    fs.readFile('js/main.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
  }
  else{
    figlet('404!!', function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      res.write(data);
      res.end();
    });
  }
});

server.listen(8000);
