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
document.getElementById('calculator-buttons').addEventListener("click", calculatorButtonPressed);

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
function parseAndValidateInput() {
    //-----------------------------------------------------
    // initial check for empty/blank calculator input
    //-----------------------------------------------------
    if (expressionString === '') {
        return 'Error: You have not entered any calculations!'
    } 
    console.log(expressionString);
    //-----------------------------------------------------
    // setup
    //-----------------------------------------------------
    //copy input string
    let inputString = (' ' + expressionString);
    inputString = inputString.slice(1);
    // to hold the current number to build a number object:
    let currentNumber = '';
    // to make sure operations start with a number before an
    // operator, and numbers don't just have a decimal
    let oneNumericCharacter = false;
    //-----------------------------------------------------
    // reformat whole string (blanks, operators)
    //-----------------------------------------------------
    function reformatString(inputString) {
        let newString = ''
        for (let char of inputString) {
            if (char === '×') {
                newString += '*';
            } else if (char === '÷') {
                newString += '/';
            } else if (char === ' ') {
            newString += '';
            } else {
                newString += char;
            }    
        }
        return newString;
    }
    let newString = reformatString(inputString);
    inputString = (' ' + newString);
    inputString = inputString.slice(1);
    console.log(inputString);
    // this isn't deleted because I want to put back in
    // something is happening with shallow copies of strings that is confusing
    // the heck out of me...
    //      KEEP:
    // // reformat multiplication and division operators
    // inputString = inputString.replace('×', '*');
    // inputString = inputString.replace('÷', '/');
    // // pull out blanks
    // inputString.replace(' ', '');
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
    //-------------------------------------------------------------
    let isOperator = /[\+\-\*\/]/;  // is it any one of the four operators
    let isNumString = /[\d]/;  // is it a number 
    //-------------------------------------------------------------
    // loop through string by character
    for (i=0; i<inputString.length; i++) {
        //-----------------------------------------------------------------
        // set inital variables to make logic more readable
        let currChar = inputString[i];
        let charIsOperator = (isOperator.test(currChar)) ? true : false;
        let charIsDecimal =  (currChar === '.') ? true : false;
        let charIsNumber = (isNumString.test(currChar)) ? true : false;
        let lastCharInString = (i === inputString.length-1) ? true : false;
        //----------------------------------------------------------------
        // IF a decimal point or a number, ADD to currentNumber string
        if (charIsNumber || charIsDecimal) {
            currentNumber += currChar;
            if (charIsNumber) {
                oneNumericCharacter = true;
            }
        // IF an operator, (and there was a number first)
        } else if (charIsOperator) {
            // make sure number came first
            if (!oneNumericCharacter) {
                return 'Error: You must have a number before an operator!';
            }
        // IF invalid character, display error message    
        } else {
            return 'Error: Invalid character, use only numbers and operators';
        }
        // If the current character is either:
        //         - an operator or 
        //         - the last character in the string
        //    THEN check for decimal errors and CREATE number object
        if (charIsOperator || lastCharInString) {
            // check for decimal errors:
            // 1. if currentNumber has more than one decimal, error
            let decimalPointCount = (currentNumber.match(/\./g) || []).length;
            if (decimalPointCount > 1) {
                return 'Error: you can only have one decimal per number.'
            }
            // 2. if current number has a decimal but no numeric values
            if (decimalPointCount === 1 && !oneNumericCharacter) {
                return 'Error: you must have at least one numeric character in a decimal number.';
            } 
            //  - CREATE number object, add to expression array
            expression.push({number: currentNumber});
            oneNumericCharacter = false;
            currentNumber = '';
        }
        if (charIsOperator) {
            // - CREATE operator object, add to expression array
            expression.push({operator: currChar});
        }
        if (lastCharInString && !charIsNumber) {
            return 'Error: Your expression must end with a number!';
        }
    }
} // end validateInput()

/**
 * Hightlights the Calculator Expression Display by adding a class
 */
function highlightInputBox() {
    let calcBoxElement = document.getElementById('calculation-box');
    // toggle on the 'highlight-box' class
    //          - (Second parameter to toggle() is the 'force' parameter,
    //             which creates a one-way 'ON' toggle. This will only
    //             toggle the class on, not off when true)
    calcBoxElement.classList.toggle('highlight-box', true);
}

/**
 * Display a message to the status message area on the screen
 */
function displayMessage(message) {
    let messageElement = document.getElementById('status-message');
    messageElement.textContent = message;
}

/**
 * Clears the Calculator:
 *      - clears the Calculation Entry Box
 *      - clears the expression string where the Calculation Entry is stored
 *      - clears the expression array which holds the expression until it
 *        is POSTed to the server
 *      - clears the result box where the calculation result is displayed
 */
function clearCalculator() {
    // clear the current calculation field on screen 
    let calcBoxElement = document.getElementById('calculation-box');
    calcBoxElement.textContent = '';
    // and behind the scenes
    expressionString = '';
    expression = [];
    // clear current result field
    document.getElementById('recent-result').textContent = '';
}

/**
 * This function is used to reset the user experience after an error message
 *      - sets the display message at the top of the screen to an empty string
 *      - clears any highlighting done with class .highlight-box
 */
function clearUserIndicators() {
    // clear all messages
    displayMessage('');
    // get the calculation box element to clear any highlighting
    let calcBoxElement = document.getElementById('calculation-box');
    // toggle on the 'highlight-box' class
    //          - (Second parameter to toggle() is the 'force' parameter,
    //             which creates a one-way 'OFF' toggle. This will only
    //             toggle the class off, not on when false)
    calcBoxElement.classList.toggle('highlight-box', false);
}

/**
 * This is called from an event listener when a something in the calculator
 *      section (all the buttons) is pressed.
 *     - then he procesButton function determines the action depending on 
 *       the single button pressed
 * 
 *  note: this functionality was split off of processButton so processButton
 *        can be called with a 'simulated' click when re-running individual
 *        calculations.  
 */
function calculatorButtonPressed(event) {
    let ElementPressed = event.target;
    let currentButton = ElementPressed.innerText;
    processButton(currentButton);
}

/**
 * Processes a click even on the calculator section after clearing the old errors
 *      - If the user hits '=', parse and validate the expressionString that
 *        was built in this function 
 *              (expressionString is what is displayed in the calculation box)
 *        calculation box.
 *              - If no errors during parse & validate, submit to eventually 
 *                  POST the expression to the server
 *      - If clear button is pressed, clear the calculator displays
 *      - If the clearHistory button is pressed, call a function
 *                  to send a DELETE request to the server
 *      - If button is a number/decimal/operation:
 *              - Add the current number/decimal/operation to the current
 *                 expressionString and add it to the calculation Box display
 *      - If button is none of the above:
 *               - ignore the click!  (between the buttons in the 
 *                     calculation button section, etc.)
 */
function processButton(currentButton) {
    // clears user msgs, highlighting, etc  (error msg clearing)
    clearUserIndicators();
    switch (currentButton) {
        // if we hit equals, validate the current calculator input 
        //      and call function to submit to server to calculate
        case '=':
            let inputError = parseAndValidateInput();
            if (!inputError) {
                submitToCalculate();
                // clear out expression array so it can be rebuilt 
                //   by the next run of parseAndValidate
                // ( each time you want to compute a new result,
                //    clear and recreate the expression object to
                //    send/POST to the server/datbase)
                expression = [];
            } else {
                displayMessage(inputError);
                highlightInputBox();
            }
            break;
        // if we hit AC (all clear), clear current calculation and result fields
        case 'C':
            clearCalculator();
            break;
        case `clear\nhistory`:
            deleteCalculationHistory();
            break;
        // if it is not '=' or 'AC' buttons, add the resultant character to 
        //      the expressionString.
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '.':
        case '+':
        case '-':
        case '×':
        case '÷':
            // if a different button is pressed, write result to expression string
            //   and then render expression string to screen
            expressionString += currentButton;
            let calculationBoxElement = document.getElementById('calculation-box');
            calculationBoxElement.textContent = expressionString;
        default:
            // click out side of buttons, do nothing
            break;
    }
}

/**
 * If the expressionString built passes the parse and validate checks, we 
 *    POST the data to the server
 *   
 *     -  after a successful POST, fetch the new calculations and render them
 */
function submitToCalculate() {
    console.log('expression to post', expression);
    axios({
        method: 'POST',
        url: '/calculations',
        data: {expression}  
    }).then((response) => {
        // on successful post:
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
    // if there's a current calculation, render the current result to DOM
    if (calculations.length > 0) {
        let displayResult = calculations[calculations.length-1].result;
        // reformat number, round to a 11-digit precision number if over 11 digits
        // only limit the significant digits if it's over 11 sigfigs
        if (displayResult.length > 11) {
            displayResult = Number(displayResult);
            // if the number is an integer, do not limit sigfigs
            if (!Number.isInteger(displayResult)) {
                displayResult = displayResult.toPrecision(10);
            }
        }
        recentResultElement.textContent = displayResult;
    } else {
        recentResultElement.textContent = '';
    }
    // clear the current history from the DOM before re-rendering list
    calculationHistoryElement.innerHTML = '';
    // loop through the current calculation history
    //      - write a list item for each calculation in the history
    for (let i=0; i<calculations.length; i++) {
        // reformat number, round to a 11-digit precision number
        displayResult = calculations[i].result;
        // only limit the significant digits if it's over 11 sigfigs
        if (displayResult.length > 11) {
            displayResult = Number(displayResult);
            // if the number is an integer, do not limit sigfigs
            if (!Number.isInteger(displayResult)) {
                displayResult = displayResult.toPrecision(10);
            }
        }
        recentResultElement.textContent = displayResult;
        HTMLstring = `<li>`;
        let calcExpression = calculations[i].expression;
        for (let calcObject of calcExpression) {
            for (let value of Object.values(calcObject)) {
                value = value.replace("/","÷");
                value = value.replace("*","×");
                HTMLstring += `${value} `;
            }
        }
        HTMLstring += '= ' + displayResult;
        HTMLstring += `  
                <button data-index="${i}" 
                        onclick="deleteSingleCalculation(event)">🆑
                </button>
                <button data-index="${i}" 
                        onclick="rerunSingleCalculation(event)">🔃
                </button>
            </li>`;
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
 * Delete the entire calculation history and clear out all calculator fields
 *      - first send DELETE request to server
 *      - on successful DELETE, fetch and render the calculations (there will 
 *           be none)
 *      - then go ahead and clear the calculator fields
 */
function deleteCalculationHistory() {
    // clear the current history from the server
    console.log('DELETE request from server')
    axios({
        method: 'DELETE',
        url: '/calculations'
    }).then((response) => {
        // on successful delete:
        // and fetch the new calculations after the data is updated on server
        //          --( fetchCalculations will update the DOM/screen
        //              afterwards with a call to renderCalculations )
        fetchCalculations();
    });
    clearCalculator();
}

/**
 * Delete just a single calculation when the red X next to the calc is clicked
 *    --pass in the index number to delete to the server 
 *              (index number is stored on the delete button itself)
 *    --on successful delete, fetch and render the calculations
 */
function deleteSingleCalculation(event) {
    let ElementToDelete = event.target;
    let indexToDelete = ElementToDelete.getAttribute('data-index');
    axios({
        method: 'DELETE',
        url: '/single_calculation', 
        data: { indexToDelete: indexToDelete }
    })
    .then((response) => {
        // on successful delete: 
        // and fetch the new calculations after the data is updated on server
        //          --( fetchCalculations will update the DOM/screen
        //              afterwards with a call to renderCalculations )
        fetchCalculations();
    });  
}

/**
 * Re-run a single calculation event when the recycle button is pressed
 *      -- Parse the calculation directly from the history string
 *      -- take the parsed information and use it to re-submit a 
 *         request using processButton. This re-creates the process as if
 *         the user had JUST TYPED the string and hit '='
 *      -- the string is parsed, validated, and POSTED to the server,
 *         and after a successful POST (re-POST ha), the calculation history
 *         is fetched and rendered again.
 */
function rerunSingleCalculation(event) {
    let ElementToRerun = event.target;
    // clear calculator (same as clear button)
    clearCalculator();
    // parse expression data from list item to rerun 
    let calculationData = ElementToRerun.parentElement.innerText;
    let indexOfEqualsSign = calculationData.indexOf('=');
    // set global variable expression to simulate user input
    //      (get from beginning of calculation string up until but not incl. '=')
    expressionString = calculationData.substr(0, indexOfEqualsSign);
    document.getElementById('calculation-box').textContent = expressionString;
    // process expression (takes expression, parses and validates,
    //                      builds expression object to post)
    for (let character of expression) {
        processButton(character);
    }
    // simulates a user pressing '=', if we want to rerun calculation we don't
    //      want to have to manually hit '=' afterwards
    processButton('=');
}

