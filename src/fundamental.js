//opareters
alert( true || true );   // true
alert( false || true );  // true
alert( true || false );  // true
alert( false || false ); // false

//while loop
let i = 0;
while (i < 3) { // shows 0, then 1, then 2
  alert( i );
  i++;
}

//do while loop
let i = 0;
do {
  alert( i );
  i++;
} while (i < 3);

//for loop
for (let i = 0; i < 3; i++) { // shows 0, then 1, then 2
  alert(i);
}