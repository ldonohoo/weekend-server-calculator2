/**
 * Lisa Donohoo
 * Prime Digital Academy
 *  * Tier II, Weekend Server Calculator, version STRETCH
 * April 6, 2024
 */

// Data structure model:-------------------------------------------------------

// let calculations = [ 
//     { expression: [ {number: 5},
//                     {operator: '+'},
//                     {number: 5},
//                     {operator: '-'},
//                     {number: 2} ],
//       result: 8 },
//     { expression: [ {number: 5},
//                     {operator: '*'},
//                     {number: 4},
//                     {operator: '-'},
//                     {number: 2} ],
//       result: 18 } 
// ];


// calculations data structure ------------------------------------------------
let calculations = [];

// test data structure:
// let calculations = [
//     { expression: [ {number: 5},
//                      {operator: '+'},
//                      {number: 5},
//                      {operator: '-'},
//                      {number: 2} ],
//        result: 8 },
//      { expression: [ {number: 5},
//                      {operator: '*'},
//                      {number: 4},
//                      {operator: '-'},
//                      {number: 2} ],
//        result: 18 } ];

function displayObject(object) {
  for (let thing of object) {
    console.log(thing);
  }
}

function calculateResult(newExpression) {
  return 42;
}

// SERVER information ---------------------------------------------------------
const express = require('express');
const app = express();

let PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static('server/public'));



// ROUTES ----------------------------------------------------------------



// GET ROUTE with url of '/calculations' 
//  (Tell the server what do DO when it RECIEVES a GET with /calculations)
app.get('/calculations', (req, res) => {
  console.log('GET /calculations received a request!');
  // respond to the GET request by sending the calculations object
  //    back to the client (with history and current results)
  console.log('Sending calculations:');
  displayObject(calculations);
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
  let newExpression = req.body.expression;
  console.log('newexpression', newExpression);
  displayObject(newExpression);
  // calculate the result to the calculator operation
  let result = calculateResult(newExpression);
  // update the calculations data structure to store all data on server
  //      by pushing a single calculation to calculations
  let calculation = { expression: newExpression,
                       result: result };
console.log(calculation);
  calculations.push(calculation);
  console.log(`POST complete, current value of calculations:`);

  // Send back a HTTP status code to indicate that
  //    this route did its job successfully!
  res.sendStatus(201); //  Send "CREATED" back to client.
});

// DELETE ROUTE with url of '/single_calculation' 
//  (Tell the server what do DO when it RECEIVES a DELETE with /calculations)
app.delete('/single_calculation', (req, res) => {
  let returnStatus;
  console.log('DELETE /single_calculation received a request!');
  let indexToDelete = req.body.indexToDelete;
  console.log('indexTodelete', indexToDelete);
  let deletedItem = [];
  if (indexToDelete < calculations.length) {
    // delete the specific calculation starting at indexToDelete (delete 1 elem)
    deletedItem = calculations.splice(indexToDelete, 1);
  }
  if (deletedItem.length === 0) {
    returnStatus = 501;  // return not implemented
  } else {
    returnStatus === 204;  // return ok
  }
  console.log(`DELETE complete, current value of calculations:`);
  displayObject(calculations);
  // Send back a HTTP status code to indicate that
  //    this route did its job successfully!
  res.sendStatus(204); //  Send status back to client.
});

// DELETE ROUTE with url of '/calculations' 
//  (Tell the server what do DO when it RECEIVES a DELETE with /calculations)
app.delete('/calculations', (req, res) => {
  console.log('DELETE /calculations received a request!');
  // delete all history
  calculations = [];
  console.log(`POST complete, current value of calculations:`, calculations);
  // Send back a HTTP status code to indicate that
  //    this route did its job successfully!
  res.sendStatus(204); //  Send "CREATED" back to client.
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
