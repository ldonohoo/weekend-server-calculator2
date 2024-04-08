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




// functions ------------------------------------------------------------------


function displayObject(object) {
  for (let thing of object) {
    console.log(thing);
  }
}

/**
 * This function will calculate the result of an arithmetic expression:
 *       i.e.  4+5/9*3+6
 *    -the function simulates order of operations by going through
 *     left to right and resolving the multipication and division operators
 *     first
 *    -then the function goes through all the operators from left to right
 *     and resolves them in order
 *    - returns the result of the expression
 *   
 *    - this would have been easier with eval()   :(
 */
function calculateResult(newExpression) {
  // make a copy of the new expression array to use
  let expressionArray = [...newExpression];
  let operator;
  console.log('newExpression in calculateResult:', newExpression);
  console.log('expressionArray is: ', expressionArray);
  //----------------------------------------------------------------------- 
  // Function calculateTwoNumbers()
  //----------------------------------------------------------------------- 
  // calculate the result of a two number operation,
  //      then return result
  //----------------------------------------------------------------------- 
  function calculateTwoNumbers(num1, operator, num2) {
    // since our object stores it all in strings, convert to number for 
    //   calculation and then convert back to string
    actualNumber1 = Number(num1);
    actualNumber2 = Number(num2);
    switch (operator) {
      case '+':
        result = actualNumber1 + actualNumber2;
        result = result.toString();
        return result;
        break;
      case '-':
        result = actualNumber1 - actualNumber2;
        result = result.toString();
        return result;
        break;
      case '*':
        result = actualNumber1 * actualNumber2;
        result = result.toString();
        return result;
        break;
      case '/':
        result = actualNumber1 / actualNumber2;
        result = result.toString();
        return result;
        break;
    }
  } 
  //----------------------------------------------------------------------- 
  // Function iterateArrayAndCalc()
  //----------------------------------------------------------------------- 
  // CALCULATE an operation and collapse the array:
  //   (for each operator:)
  // 
  //   IF onlyMultAndDivide is false, run over all operators:
  //    -- evaluate the expression:
  //        use the number before the operator,
  //        the number after the operator,
  //        the operator
  //    -- take the result and collapse the current working
  //       expression array
  //          example 1:   4 + 5 - 8 
  //                        -evaluate 4 + 5, replace (4+5) with 9 with splice 
  //                       9 - 8
  //                        -evaluate 9 - 8, replace (9-8) with 1 with splice
  //                        -end of array is true, return number
  //
  //
  //    -- if onlyMultAndDivide is true, run just over * and / operators:
  //          example 1:   4 + 5 * 6 - 3
  //                         -evaluate 5 * 6, replace with 30
  //                       4 + 30 - 3  
  //                         -no more mult/div, evaluate array in order
  //          example 2:   4 + 5 * 6 / 3
  //                         -evaluate 5 * 6, replace with 30
  //                       4 + 30 / 3  
  //                         -evaluate 30 / 3, replace with 10
  //                       4 + 10
  //                         -no more mult/div, evaluate array in order
  //----------------------------------------------------------------------- 
  function iterateArrayAndCalc(array, onlyMultAndDivide) {
    let calcResult;
    // go through all operators in array (they will start at index 1)
    for (i=1; i< expressionArray.length; i+=2) {
      operator = expressionArray[i].operator;
      // IF this isn't calculating only multiply or divide
      //   OR this is only calculating mult & div and we have the correct operator
      //      --then do the operation, and replace the three elements
      //         with a single resultant value
      if (!onlyMultAndDivide || 
           (onlyMultAndDivide && (operator === '*' || operator === '/'))) {
          calcResult = calculateTwoNumbers(expressionArray[i-1].number, 
                                           operator,
                                           expressionArray[i+1].number);
          // .splice(startIndex, numToDelete, additem)
          // replaces the n1 * n2 with the result by pulling the three
          //   objects out, and replacing them with one object
          expressionArray.splice(i-1, 3, {number: calcResult});
          // now since we just effectively removed 2 elements, subtract
          //   two from the index i so this loop isn't wonky
          i-=2;  
      }  // end (calculate this operator if true)
    } // end do an operation and collapse array
  } // end iterateArrayAndCalc
  //----------------------------------------------------------------------- 
  // MAIN LOGIC:
  // Simulating order of operations:
  //----------------------------------------------------------------------- 
  console.log('ready to iterate and calc');
  console.log('..........');
  // FIRST, iterate array and calculate all multiply/divides from left to right
  iterateArrayAndCalc(expressionArray, true);
  // check if array only has one number left, if so, return that number
  if (expressionArray.length === 1) { 
    console.log('expressionArray is now1:', expressionArray);
    
    return expressionArray[0].number;
  } else {
    console.log('expressionArray is now2:', expressionArray);
    // SECOND, iterate array and calculate each operation left to right
    iterateArrayAndCalc(expressionArray, false);
  }
  console.log('expressionArray is now3:', expressionArray);
  // return the only item in the array, which is the result with property number
  return expressionArray[0].number;
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
