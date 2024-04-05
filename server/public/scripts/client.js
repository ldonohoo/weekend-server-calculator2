console.log('client.js is sourced!');
// set a global local variable to hold the current operator
let currentOperator = '+';


function addSelected() {
    currentOperator = '+';
}

function subtractSelected() {
    currentOperator = '-';
}

function multiplySelected() {
    currentOperator = '*';
}

function divideSelected() {
    currentOperator = '/';
}

function calculate(event) {
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


}