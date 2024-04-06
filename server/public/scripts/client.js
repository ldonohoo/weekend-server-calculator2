/**
 * Lisa Donohoo
 * Tier II, Weekend Server Calculator, version BASE
 * April, 5, 2024
 */

console.log('in client.js');

// set a global local variable to hold the current operator
let currentOperator = '+';


function addSelected(event) {
    event.preventDefault();
    currentOperator = '+';
}

function subtractSelected(event) {
    event.preventDefault();
    currentOperator = '-';
}

function multiplySelected(event) {
    event.preventDefault();
    currentOperator = '*';
}

function divideSelected(event) {
    event.preventDefault();
    currentOperator = '/';
}

function calculate(event) {
    console.log('in calculate...')
    // prevent default form behavior from clearing form
    event.preventDefault();
    // get elements for number input fields
    let firstNumberElement = document.getElementById('first-number');
    let secondNumberElement = document.getElementById('second-number');
    // get values for input fields
    let firstNumber = firstNumberElement.value;
    let secondNumber = secondNumberElement.value;
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
       fetchCalculatorData();
      })

}

function renderCalculations(calculations) {
    // get elements for render postions 
    let recentResultElement = document.getElementById('recent-result');
    let resultHistoryElement = document.getElementById('result-history');
    // render the current result to DOM
    recentResultElement.textContent = calculations.result;
    // loop through the current calculation history
    //      - write a list item for each calculation in the history
    for (let calculation of calculations) {
        let HTMLstring = 
        `<li>${calculations.numOne} ${calculations.operator} ${calculations.numTwo} = ${calculations.result}}</li>`
        resultHistoryElement.innerHTML += HTMLstring;
    }
}



function fetchData() {
    axios({
        method: 'GET',
        url: '/calculations',
    }).then((response => {
        let calculations = response.data;
        renderCalculations(calculations);
    }))
}

function clearFields() {
    console.log('clearing fields...');
}