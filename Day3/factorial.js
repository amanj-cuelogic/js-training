function factorial(n){
  return n < 2 ? 1 : n*factorial(n-1);
}
var fact = factorial(6);
console.log(fact);