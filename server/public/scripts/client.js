/**
 * Lisa Donohoo
 * Tier II, Weekend Server Calculator, version BASE
 * April, 5, 2024
 */


/**
 *  Set a global client variable to hold the current selected operator
 *      and a global client variable to see if first time screen rendered
 */
let currentOperator = ' ';


/**
 * Initial fetch of data from server on page load,
 */
fetchCalculations();

/**
 * Changes the current operator to add
 */
function addOperatorOn(event) {
    event.preventDefault();
    currentOperator = '+';
}

/**
 * Changes the current operator to subtract
 */
function subtractOperatorOn(event) {
    // prevent default form behavior from clearing form
    event.preventDefault();
    currentOperator = '-';
}

/**
 * Changes the current operator to multiply
 */
function multiplyOperatorOn(event) {
    // prevent default form behavior from clearing form
    event.preventDefault();
    currentOperator = '*';
}

/**
 * Changes the current operator to delete
 */
function divideOperatorOn(event) {
    // prevent default form behavior from clearing form
    event.preventDefault();
    currentOperator = '/';
}

/**
 * Calculate the results of the calculator operation:
 *   -- Called upon clicking the '=' sign, this will pull the numbers from 
 *      the screen and POST the numbers and the operand to the server
 *      where it will calculate the result and return all calculations data
 */
function calculate(event) {
    console.log('in calculate...')
    // prevent default form behavior from clearing form
    event.preventDefault();
    // get elements for number input fields
    let firstNumberElement = document.getElementById('first-number');
    let secondNumberElement = document.getElementById('second-number');
    // get values from input fields
    let firstNumber = firstNumberElement.value;
    let secondNumber = secondNumberElement.value;
    // if no operator selected, give error message and return control to screen
    if (currentOperator === ' ') {
        alert('Please select an operator for your calculation!');
    // else, POST information to server for calculation
    } else {
        // post number1, number2, and operator to server to calculate 
        //      our result
        //      (server will return result)
        axios({
            method: 'POST',
            url: '/calculations',
            data: { numOne: firstNumber, 
                    numTwo: secondNumber,
                    operator: currentOperator }   
        }).then((response) => {
            // on successful post:
            //   - clear number input fields
            firstNumberElement.value = '';
            secondNumberElement.value = '';
            //   - reset the operator
            currentOperator = ' ';
            // and fetch the new calculations after the data is updated on 
            //      the server 
            //          --( fetchCalculations will update the DOM/screen
            //              afterwards with a call to renderCalculations )
            fetchCalculations();
        })
    }
}

/**
 * Take the entire calculations data object fetched from the server and 
 *      render both the current calculation result and the calculation
 *      history to the screen
 */
function renderCalculations(calculations) {
    // get elements for render postions 
    let recentResultElement = document.getElementById('recent-result');
    let calculationHistoryElement = document.getElementById('calculation-history');
    // render the current result to DOM
    recentResultElement.textContent = calculations[calculations.length-1].result;
    // clear the current history from the DOM before re-rendering list
    calculationHistoryElement.innerHTML = '';
    // loop through the current calculation history
    //      - write a list item for each calculation in the history
    for (let calculation of calculations) {
        let HTMLstring = 
        `<li>${calculation.numOne} ${calculation.operator} ${calculation.numTwo} = ${calculation.result}</li>`
        calculationHistoryElement.innerHTML += HTMLstring;
    }
}


/**
 * Fetch the entire calculations object from the server so the calculations
 *      history and result can be rendered to the screen.
 *      -- this is done after the calculations data has been updated on the
 *         server with a POST
 */
function fetchCalculations() {
    axios({
        method: 'GET',
        url: '/calculations',
    }).then((response => {
        // after a sucessful GET from the server, put the calculations object
        //      in a object called calculations
        let calculations = response.data;
        console.log('just received', calculations);
        // render the calculations data to the DOM/screen by calling the 
        //      function renderCalculations
        renderCalculations(calculations);
    }))
}

/**
 * Clear the input values on the screen:
 *      - clear number1 and number2
 *      - clear out the selected operator
 *      - clear out the current result field
 */
function clearFields(event) {
    event.preventDefault();
    // get elements for number input fields
    let firstNumberElement = document.getElementById('first-number');
    let secondNumberElement = document.getElementById('second-number');
    // clear number input fields
    firstNumberElement.value = '';
    secondNumberElement.value = '';
    // reset the operator
    currentOperator = ' ';
    // clear the result field as no current calculation now
    let recentResultElement = document.getElementById('recent-result');
    recentResultElement.textContent = '';

}