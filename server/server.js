/**
 * Lisa Donohoo
 * Prime Digital Academy
 * April 5, 2024
 */

// Data structure model:-------------------------------------------------------

// let calculations = [
//       {firstNumber: 2,
//        secondNumber: 1,
//        operator: '+',
//        result: 3
//       }
// ];

// calculations data structure ------------------------------------------------
const calculation = [];


function calculateResult(number1, number2, operator) {
  number1 = Number(number1);
  number2 = Number(number2);
  switch (operator) {
    case '+':
      return number1 + number2;
      break;
    case '-':
      return number1 - number2;
      break;
    case '*':
      return number1 * number2;
      break;
    case '/':
      return number1 / number2;
      break;
    default:
      return `error, invalid calculation, operator is: '${operator}'!`;
  }
}

// SERVER information ---------------------------------------------------------
const express = require('express');
const app = express();

let PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static('server/public'));

// Global variable that will contain all of the
// calculation objects:
let calculations = []


// ROUTES ----------------------------------------------------------------



// GET ROUTE with url of '/calculations' 
//  (Tell the server what do DO when it RECIEVES a GET with /calculations)
app.get('/calculations', (req, res) => {
  console.log('GET /calculations received a request!');
  // respond to the GET request by sending the calculations object
  //    back to the client (with history and current results)
  console.log('Sending calculations:', calculations);
  res.send(calculations);
});


// POST ROUTE with url of '/calculations' 
//  (Tell the server what do DO when it RECIEVES a POST with /calculations)
//      - update the the two numbers and the operand in out data structure
//      - calculate the result and update the data structure
//      - return the entire 'calculations' data structure so
//          we can write results and calculation history to page
app.post('/calculations', (req, res) => {
  console.log('POST /calculations received a request!');
  // grab the data passed to the server in req.body
  let newCalculations = req.body;
  let number1 = newCalculations.numOne;
  let number2 = newCalculations.numTwo;
  let operator = newCalculations.operator;
  // calculate the result to the calculator operation
  let result = calculateResult(number1, number2, operator);
  // update the calculations data structure to store all data on server
  //      by pushing a single calculation to calculations
  let calculation = { numOne: number1,
                      numTwo: number2,
                      operator: operator,
                      result: result };
  calculations.push(calculation);
  console.log(`POST complete, current value of calculations:`, calculations);
  // Send back a HTTP status code to indicate that
  //    this route did its job successfully!
  res.sendStatus(201); //  Send "CREATED" back to client.
});


// end ROUTES ----------------------------------------------------------------




// PLEASE DO NOT MODIFY ANY CODE BELOW THESE BEARS:
// 🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸

// Makes it so you don't have to kill the server
// on 5000 in order to run the tests:
if (process.env.NODE_ENV === 'test') {
  PORT = 5001;
}

// This starts the server...but also stores it in a variable.
// This is weird. We have to do it for testing reasons. There
// is absolutely no need for you to reason about this.
const server = app.listen(PORT, () => {
  console.log('server running on: ', PORT);
});

// server.setTimeout(500)

// This is more weird "for testing reasons" code. There is
// absolutely no need for you to reason about this.
app.closeServer = () => {
  server.close();
}

app.setCalculations = (calculationsToSet) => {
  calculations = calculationsToSet;
}

module.exports = app;
