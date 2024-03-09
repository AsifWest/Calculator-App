// Access DOM elements of the calculator
const inputBOX = document.getElementById('input')
const expressionDiv = document.getElementById('expression')
const resultDiv = document.getElementById('result')

// Define expression and result variable 
let expression = '';
let result = '';

// Define an event handler for buttons click 

function buttonClick(event) {
    // Get valued from clicked button
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;
    // console.log(target,action,value);

    //switch case to control the calculator
    switch (action) {
        case 'number':
            addValue(value);
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;

        //Add the result to the expression as a starting point if expression is empty
        case 'addition':
        case 'substraction':
        case 'multiplication':
        case 'division':
            if (expression === '' && result !== '') {
                startFromResult(value);
            }
            else if (expression !=='' && !isLastCharOperator()){
                addValue(value);
            }
            break;

        case 'submit':
            submit();
            break;

        case 'negate':
            negate();
            break;
            
        case 'percentage':
            percentage();
            break;

        case 'decimal':
            decimal(value);
            break;
    }
    //update display
    updateDisplay(expression, result);
}

inputBOX.addEventListener('click', buttonClick);

function addValue(value) {
    // Add the value to the expression 
    // expression += value;
    // console.log(expression);

    if (value == '.'){
        //find the last index of the last decimal in the expression
    const lastOperatorIndex = expression.search(/[+\-*/]/) // we're checking for these symbols +\-*/
    const lastDecimalIndex = expression.lastIndexOf('.');
    //find the last index of the last number in the expression
    const lastnumberIndex = Math.max(
        expression.lastIndexOf('+'),
        expression.lastIndexOf('-'),
        expression.lastIndexOf('*'),
        expression.lastIndexOf('/')
    );

    // Check if this is the first decimal in the currrent number or if expresiosn is empty 
    if ((lastDecimalIndex < lastOperatorIndex || lastDecimalIndex < lastnumberIndex || lastDecimalIndex === -1) && (expression === '' || expression.slice(lastnumberIndex + 1).indexOf('-') === -1 )) {
        expression += value;
    }
    }
    else {
        expression += value;
    }
}

function updateDisplay(expression, result) {
    expressionDiv.textContent = expression;
    resultDiv.textContent = result;
}

function clear() {
    expression = '';
    result  = '';
}

function backspace() {
    expression = expression.slice(0, -1);
}

function isLastCharOperator() {
    return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
    expression += result + value;
}

function submit() {
    result = evaluateExpression();
    expression = '';
}

function evaluateExpression() {
    const evalResult = eval(expression);
    //eval fun evaluates a string like 5+6*6/7...it will evaluate this string
    return isNaN(evalResult) || !isFinite(evalResult) ? ''
    : evalResult < 1 
    ? parseFloat(evalResult.toFixed(10))
    : parseFloat(evalResult.toFixed(2));
    // Checks if evalResult isNaN or infinite, if it is, return a space character ' 
}

function negate() {
    //negate the result if the expression is empty and the result is present 
    if (expression === '' && result !== '') {
        result = -result;
        //Toggle the sign of the exprssion if its not already negative and its not empty
    }
    else if (!expression.startsWith('-' && expression !== '')) {
        expression = '-' + expression;

        //remove the negative sign from the expression if its already neagtive 
    }
    else if (expression.startsWith('-')) {
        expression = expression .slice(1);
    }
}

function percentage() {
    // Evaluate the expression else it will take the percentage of only the first number
    if (expression !== '') {
        result = evaluateExpression();
        expression = '';
        if (!isNaN(result) && isFinite(result)) {
            result /= 100;
        } else {
            result = '';
        }
    }
    else if (result !== '') {
        // If expression is empty but the result exists, divide by 100
        result = parseFloat(result) / 100;
    }
}

function decimal(value) {
    if (!expression.endsWith('.') && !isNaN(expression.slice(-1))) {
        addValue(value);
    }
}
