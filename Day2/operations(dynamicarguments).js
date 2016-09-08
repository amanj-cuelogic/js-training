/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */

//function for adding 2 numbers
function sum() {
  sum_result = 0;
  if(arguments.length >= 2){
    for(var i=0;i<arguments.length;i++){
      if(typeof(arguments[i]) === "number"){
        sum_result += arguments[i];
      }else{
        throw new Error("Only Numebrs are expected");
      }
    }
  }else{
    throw new Error("Minimum 2 arguments required");
  }
  console.log(sum_result);
}
//function for subtracting 2 numbers

function subtract() {
  var subtract_result = arguments[0];
  if(arguments.length >= 2){
    for(var i=1;i<arguments.length;i++){
      if(typeof(arguments[i]) === "number"){
        subtract_result -= arguments[i];
      }else{
        throw new Error("Only Numebrs are expected");
      }
    }
  }else{
    throw new Error("Minimum 2 arguments required");
  }
  console.log(subtract_result);
} 
//function for dividing 2 numbers

function divide() {
  var divide_result = arguments[0];
  if(arguments.length >= 2){
    for(var i=1;i<arguments.length;i++){
      if(typeof(arguments[i]) === "number"){
        divide_result = divide_result/arguments[i];
      }else{
        throw new Error("Only Numebrs are expected");
      }
    }
  }else{
    throw new Error("Minimum 2 arguments required");
  }
  console.log(divide_result);
} 
//function for mutilpying 2 numbers

function multiply() {
  var multiply_result = 1;
  if(arguments.length >= 2){
    for(var i=0;i<arguments.length;i++){
      if(typeof(arguments[i]) === "number"){
        multiply_result = multiply_result*arguments[i];
      }else{
        throw new Error("Only Numebrs are expected");
      }
    }
  }else{
    throw new Error("Minimum 2 arguments required");
  }
  console.log(multiply_result);
}
sum(2,2,5,6,7);
subtract(10, 50,-40,9);
divide(20,10,2);
multiply(10, 0.99,10);
