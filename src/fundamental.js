//opareters
console.log( true || true );   // true
console.log( false || true );  // true
console.log( true || false );  // true
console.log( false || false ); // false

//while loop
let i = 0;
while (i < 3) { // shows 0, then 1, then 2
  console.log( i );
  i++;
}

//do while loop
let i = 0;
do {
  console.log( i );
  i++;
} while (i < 3);

//for loop
for (let i = 0; i < 3; i++) { // shows 0, then 1, then 2
  console.log(i);
}