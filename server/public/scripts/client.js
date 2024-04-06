/**
 * Lisa Donohoo
 * Tier II, Weekend Server Calculator, version STRETCH
 * April, 6, 2024
 */

/*-------- Global Variables --------------------------------------------------*/

// variable to *
// varaiable to prevent multiple decimal points in one number
let decimalUsed = false;
// variable to prevent just a decimal (with no assoicated number) being entered
let numberUsedWithDecimal = false;

/**
 * expression datastructure to store input:
 *      either number or operator in each object but not both,
 *               should alternate
 *      this should provide framework for multiple operator calculation 
 *
 *          expression = [
 *                  {number: 4},
 *                  {operator: '+'},
 *                  {number: 5},
 *                  {operator: '-'},
 *                  {number: 32.3}
 *          ]
 */
let expression = [];

// store input in string until parsed in validateInput function
let expressionString = '';


/*-------- Main logic on page load -------------------------------------------*/
/**
 * Initial page load contains:
 *      - inital fetch (and subsequent render) of calculator history
 *      - start of event listeners for calculator buttons, clear history buttons
 */
fetchCalculations();
document.getElementById('calculator-buttons').addEventListener(onclick, calculatorButtonPressed);
document.getElementById('clear-history-button').addEventListener(onclick, clearHistory);

/*-------- Functions ---------------------------------------------------------*/

/**
 *  function to parse & validate calculator input string,
 *      updating the expression array (used in POST)
 *  This function checks for these patterns:
 *    check for number --> operator --> number pattern
 *            - must start with a number
 *            - must end with a number
 *            - only one operator at a time allowed
 *  validate numbers:
 *            - each number has only one decimal
 *            - each number has at least one number
 */
function validateInput() {
    //-----------------------------------------------------
    // initial check for empty/blank calculator input
    //-----------------------------------------------------
    if (expressionString = '') {
        return 'Error: You have not entered any calculations!'
    } 
    //-----------------------------------------------------
    // setup
    //-----------------------------------------------------
    let inputString = expressionString;
    // to hold the current number to build a number object:
    let currentNumber = '';
x   // to make sure operations start with a number first
    let alreadyAddedNumber = false;
    // to make sure numbers don't just have a decimal
    let oneNumericCharacter = false;
    //-----------------------------------------------------
    // reformat whole string (blanks, operators)
    //-----------------------------------------------------
    // reformat multiplication and division operators
    inputString.replace('×', '*');
    inputString.replace('÷', '/');
    // pull out blanks
    inputString.replace(' ', '');
    //-----------------------------------------------------
    // whole string tests with regular expressions
    //-----------------------------------------------------
    // test for operators strung together: ( +++ +* -/ ) etc.
    let twoPlusOperatorsTogether = /[\+\-\*\/]{2,}/g;
    if (twoPlusOperatorsTogether.test(inputString)) {
        return `Invalid operation: operators must be separated by numbers`;
    }
    //----------------------------------------------------------
    // setup and run tests while going through string
    //   a character at a time
    //   (this is where we create number & operator objects)
    //-------------------------------------------------------------
    // regular expressions to hold tests 
    let isOperator = /[\+\-\*\/]/;  // is it any one of the four operators
    let isNumString = /[\d]/;  // is it a number 
    for (i=0; i<inputString.length; i++) {
        let currChar = inputString[i];
        // IF a decimal point or a number, ADD to currentNumber string
        if (currChar === '.' || isNumString.test(currChar)) {
            currentNumber += currChar;
            if (currChar !== '.') { 
                oneNumericCharacter = true;
            } 
        // IF an operator, (and there was a number first)
        } else if (isOperator.test(currChar)) {
            // make sure number came first
            if (!alreadyAddedNumber) {
                return 'Error: You must start calculation with a number!';
            }
            // - CREATE operator object, add to expression array
            expression.push({operator: currChar});
        } else if (currChar === ' ') {
        //IF a blank, ignore and keep going
        } else {
            return 'Error: Invalid character, use only numbers and operators';
        }
        // If the current character is either:
        //         - an operator or 
        //         - the last character in the string
        //      Bundle up the currentNumber, convert to number from string,
        //      and add as object to the expression array
        if (isOperator.test(currChar) || i === inputString.length-1) {
            // if currentNumber has more than one decimal, error
            if (currentNumber.count('.') > 1) {
                return 'Error: you can only have one decimal per number.'
            } else if (!oneNumericCharacter) {
                return 'Error: you must have at least one numeric character in a decimal number.';
            }
            let newNumber = Number(currentNumber);
            //  - CREATE number object, add to expression array
            expression.push({number: newNumber});
            alreadyAddedNumber = true;
            oneNumericCharacter = false;
            currentNumber = '';
        }
    }
}



function highlightInputBox() {
    let calcBoxElement = document.getElementById('calculation-box');
    // toggle on the 'highlight-box' class
    //          - (Second parameter to toggle() is the 'force' parameter,
    //             which creates a one-way 'ON' toggle. This will only
    //             toggle the class on, not off when true)
    calcBoxElement.toggle('highlight-box', true);
}

/**
 * Display a message to the status message area on the screen
 */
function displayMessage(message) {
    let messageElement = document.getElementById('status-message');
    messageElement.textContent = message;
}

function clearCalculatorDisplay() {
                // clear the current calculation field on screen
                document.getElementById('calculation-box') = '';
                // and behind the scenes
                expressionString = '';
                // clear current result field
                document.getElementById('recent-result').textContent = '';
}

function clearUserIndicators() {
    // clear all messages
    displayMessage('');
    // get the calculation box element to clear any highlighting
    let calcBoxElement = document.getElementById('calculation-box');
    // toggle on the 'highlight-box' class
    //          - (Second parameter to toggle() is the 'force' parameter,
    //             which creates a one-way 'OFF' toggle. This will only
    //             toggle the class off, not on when false)
    calcBoxElement.toggle('highlight-box', false);
}


function calculatorButtonPressed(event) {
    let ElementPressed = event.target;
    let currentCharacter = ElementPressed.innerText;
    // clears user msgs, highlighting, etc 
    clearUserIndicators();
    switch (currentCharacter) {
        // if we hit equals, validate the current calculator input 
        //      and call function to submit to server to calculate
        case '=':
            let inputError = validateInput();
            if (!inputError) {
                submitToCalculate();
            } else {
                displayMessage(inputError);
                highlightInputBox();
            }
            break;
        // if we hit AC (all clear), clear current calculation and result fields
        case 'AC':
            clearCalculatorDisplay();
            break;
        // if it is not '=' or 'AC' buttons, add the resultant character to 
        //      the expressionString.
        default:
            expressionString += currentCharacter;
    }
}

function submitToCalculate() {
    axios({
        method: 'POST',
        url: '/calculations',
        data: {expression}  
    }).then((response) => {
        // on successful post:
        clearCalculatorDisplay();
        // and fetch the new calculations after the data is updated on 
        //      the server 
        //          --( fetchCalculations will update the DOM/screen
        //              afterwards with a call to renderCalculations )
        fetchCalculations();
    });
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
    for (let expression of calculations) {
        let HTMLstring = `<li>`;
        for (let expressionPart of expression) {
            HTMLstring += `${expressionPart} `;
        }
        HTMLstring += '</li>';
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
// function clearFields(event) {
//     event.preventDefault();
//     // get elements for number input fields
//     let firstNumberElement = document.getElementById('first-number');
//     let secondNumberElement = document.getElementById('second-number');
//     // clear number input fields
//     firstNumberElement.value = '';
//     secondNumberElement.value = '';
//     // reset the operator
//     currentOperator = ' ';
//     // clear the result field as no current calculation now
//     let recentResultElement = document.getElementById('recent-result');
//     recentResultElement.textContent = '';

// }