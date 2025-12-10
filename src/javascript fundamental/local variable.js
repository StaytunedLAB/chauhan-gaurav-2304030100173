function showMessage() {
  let message = "Hello, I'm JavaScript!"; // local variable

  console.log( message );
}

showMessage(); // Hello, I'm JavaScript!

console.log( message ); // <-- Error! The variable is local to the function

//outr variable
let userName = 'John';

function showMessage() {
  userName = "Bob"; // (1) changed the outer variable

  let message = 'Hello, ' + userName;
  console.log(message);
}

console.log( userName ); // John before the function call

showMessage();

console.log( userName ); // Bob, the value was modified by the function


//peramiter cariable
function showMessage(from, text) {

  from = '*' + from + '*'; // make "from" look nicer

  console.log( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// the value of "from" is the same, the function modified a local copy
console.log( from ); // Ann


//Alternative default parameters
function checkAge(age) {
  if (age >= 18) {
    return true;
  } else {
    return confirm('Do you have permission from your parents?');
  }
}

let age = prompt('How old are you?', 18);

if ( checkAge(age) ) {
  console.log( 'Access granted' );
} else {
  console.log( 'Access denied' );
}