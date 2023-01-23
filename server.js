// LOAD IN REQUIRED MODULES FOR SERVER SETUP
const http = require('http'); // Needed to create servers by listening and responding to network requests 
const fs = require('fs'); // Needed to interact with files stored on server
const url = require('url'); // Needed to parse urls 
const querystring = require('querystring'); // Needed to parse query strings
const figlet = require('figlet'); // (Installed for fun, not necessary for server setup) Needed to convert text to ASCII art 


// DEFINE SERVER CREATION
const server = http.createServer((req, res) => { // Create server that listens for url requests from the browser and responds with the desired info 

  // EXTRACT URL AND QUERY PARAMETERS FROM REQUEST
  const page = url.parse(req.url).pathname; // url parse method is used on the url property of incoming request, this returns an object with all the parts of the url string as its properties. The page is the pathname
  const params = querystring.parse(url.parse(req.url).query); // Find the query parameters associated with the querystring passed with the url(if any exist), presented as an array
  
  // HANDLE WEBPAGE ROUTES
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

  // HANDLE API REQUESTS
  else if (page == '/api') { // api requests are received from the client side made by fetch

    if ('base' in params & 'power' in params) { // Handles calculation of last digit of exponent server side and sends it back to client  

      // FUNCTION USED TO CALCULATE RESPONSE
      const lastDigitOfExponent = (str1, str2) => {
        // Define initial parameters
        const lastDigitOfANumber = (number) => {
          if (typeof number !== 'string') {
              number = number.toString()
          }
          return Number(number[number.length-1])
        }   
        const base = lastDigitOfANumber(str1)
        const power = BigInt(str2)
        let lastDigitOfPower = base
        const arrayOfLastDigitExponentCycleValues = []
        let positionInCycle = power - 1n

        // Handle edge case of x^0
        if (power === 0n) {
          return 1
        }
        
        // Populate last digit cycle array 
        for (let i = 0; !arrayOfLastDigitExponentCycleValues.includes(lastDigitOfPower); i++) { // End loop when a value already recorded in the array is produced
            arrayOfLastDigitExponentCycleValues[i] = lastDigitOfPower
            lastDigitOfPower = lastDigitOfANumber(lastDigitOfPower*base)
        }

        // Find the correct position in last digit cycle
        if (power > BigInt(arrayOfLastDigitExponentCycleValues.length)) {
            positionInCycle %= BigInt(arrayOfLastDigitExponentCycleValues.length)
        }

        // Return result
        positionInCycle = Number(positionInCycle) // Convert cycle position from BigInt to number to access array
        return arrayOfLastDigitExponentCycleValues[positionInCycle]
      }

      // MODIFY RESPONSE
      res.writeHead(200, {'Content-Type': 'application/json'}); // Send response header indicating JSON text is being sent
      const objToJson = { // Define object with all data needed for response before conversion to JSON
        base: `${params['base']}`,
        power: `${params['power']}`,
        lastDigit: `${lastDigitOfExponent(params['base'],params['power'])}`,
      }
      res.end(JSON.stringify(objToJson)); // Send object as JSON string as response to client and signify all necessary data has been sent
    }
  }

  // LOAD IN CSS AND JS
  else if (page == '/css/style.css'){ // Loads in style sheet
    fs.readFile('css/style.css', function(err, data) {
      res.write(data);
      res.end();
    });
  }
  else if (page == '/js/main.js'){ // Loads in javascript
    fs.readFile('js/main.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
  }

  // HANDLE INVALID URL REQUESTS
  else{
    figlet('404!!', function(err, data) { // Uses figlet module to display ASCII art of '404!!'
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

// CREATE LISTENER ON SPECIFIED PORT THAT HANDLES REQUESTS WHEN ACCESSED
server.listen(8000);

/* LASTDIGITOFEXPONENT EXPLANATION
      The last digit of any base raised to any power will cycle through a relatively small set of values
      e.g. with base = 2: lastDigit(2^1) = 2, lastDigit(2^2) = 4, lastDigit(2^3) = 8, lastDigit(2^4) = 6, lastDigit(2^5) = 2...
    
      Therefore the last digit of any exponent can be found by finding the last digit cycle.
      By using BigInt to account for very large powers, the remainder of the power divided by the number of last digit cycle members indicates which last digit the exponent will have
*/     