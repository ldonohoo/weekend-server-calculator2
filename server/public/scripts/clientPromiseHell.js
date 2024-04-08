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
document.getElementById('clear-history-button').addEventListener("click", deleteCalculationHistory);

/*-------- Functions ---------------------------------------------------------*/

/**
 *  **NOTE: stupid ass replace function was not completing all the time before
 *      other validation checks, so checks were failing bah humbug.
 * this function is direct from stackOverflowLand and will 
 *      hopefully wait for the replace to be finished before
 *      continuing with validation
 */
// async function replaceAsync(string, regexp, replacerFunction) {
//     const replacements = await Promise.all(
//         Array.from(string.matchAll(regexp),
//             match => replacerFunction(...match)));
//     let i = 0;
//     return string.replace(regexp, () => replacements[i++]);
// }


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
    // await new Promise(resolve => setTimeout(resolve, 5000)) .then(() => 
    // { 

    //     //rest of validate function here!!! 

    // });
    // reformat multiplication and division operators & remove spaces
    // DONE with PROMISE so we wait for these to finish!!!!!
    // getUsers()
    // .then(users => {
    //   console.log('Got users:', users);
    // }, error => {
    //   console.error('Failed to load users:', error);  
    // });

    let myPromise = new Promise(function(myResolve, myReject) {
    // "Producing Code" (May take some time)
        inputString = inputString.replace(' ', '');
          myResolve(); // when successful
          myReject();  // when error
        });

    // "Consuming Code" (Must wait for a fulfilled Promise)
    myPromise.then(
     function(value) { 
        
 //    },
//     function(error) { console.log('yeah an error i guess') }
//   );
    // function removeBlanks() {
    //     inputString = inputString.replace(' ', '');
    //     return 'ok';
    // }

    // removeBlanks().then((res) => console.log('done!'));
        // .then((response) => {inputString = inputString.replace('×', '*')})
        // .then((response) => {inputString = inputString.replace('÷', '/')})
        // .then((response) => {  

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
            let decimalPointCount = (inputString.match(/\./g) || []).length;
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
    }

    },
    function(error) { console.log('yeah an error i guess') }
    );
    // });  //  end the promise?  whatever the .then thing is...
} // end validateInput()


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


function calculatorButtonPressed(event) {
    let ElementPressed = event.target;
    let currentCharacter = ElementPressed.innerText;
    processCharacter(currentCharacter);
}

function processCharacter(currentCharacter) {
    // clears user msgs, highlighting, etc 
    clearUserIndicators();
    switch (currentCharacter) {
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
        case 'AC':
            clearCalculator();
            break;
        // if it is not '=' or 'AC' buttons, add the resultant character to 
        //      the expressionString.
        default:
            // if a different button is pressed, write result to expression string
            //   and then render expression string to screen
            expressionString += currentCharacter;
            let calculationBoxElement = document.getElementById('calculation-box');
            calculationBoxElement.textContent = expressionString;
    }
}

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
    if (calculations.length > 1) {
        recentResultElement.textContent = calculations[calculations.length-1].result;
    }
    // clear the current history from the DOM before re-rendering list
    calculationHistoryElement.innerHTML = '';
    // loop through the current calculation history
    //      - write a list item for each calculation in the history
    for (let i=0; i<calculations.length; i++) {
        HTMLstring = `<li>`;
        let calcExpression = calculations[i].expression;
        for (let calcObject of calcExpression) {
            for (let value of Object.values(calcObject)) {
                value = value.replace("/","÷");
                value = value.replace("*","×");
                HTMLstring += `${value} `;
            }
        }
        HTMLstring += '= ' + calculations[i].result;
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
}

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
    // process expression (takes expression, parses and validates,
    //                      builds expression object to post)
    for (let character of expression) {
        processCharacter(character);
    }
    // simulates a user pressing '=', if we want to rerun calculation we don't
    //      want to have to manually hit '=' afterwards
    processCharacter('=');
}

