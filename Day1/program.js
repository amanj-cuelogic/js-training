var variable1 = 9;
var variable2 = "test";
var variable3 = true;
var variable4 = ['1','2'];
var variable5 = {'key':'1'};
document.writeln('Type of variable1 - : '+ typeof(variable1)+'<br>');
document.writeln('Type of variable2 - : '+ typeof(variable2)+'<br>');
document.writeln('Type of variable3 - : '+ typeof(variable3)+'<br>');
document.writeln('Type of variable4 - : '+ typeof(variable4)+'<br>');
document.writeln('Type of variable5 - : '+ typeof(variable5)+'<br>');
document.writeln('Original Array Values ==> <br>');
document.writeln(variable4);
variable4.push('3','4','.333','6');
document.writeln(variable4);
variable4.pop();
document.writeln(variable4);
variable2 += 'User added successfully<br>';
document.writeln(variable2);
document.writeln('Boolean Val :- '+variable3+'<br>');
if (variable4.length >= 3) {
    variable3 = false;
}
document.writeln('Boolean Val :- '+variable3+'<br>');