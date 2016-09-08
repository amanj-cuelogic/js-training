 class Student{
        constructor(name,mob){
          this.name = name;
          this.mob = mob;
        }
        
        printName(){
            document.write(this.name);
        }
    }
        
    var s1 = new Student("Aman","1234567");
    console.log(s1);
    var s2 = new Student("Rahul","2345678");
    console.log(s2);
    var s3 = new Student("Steve","11111111");
    console.log(s3);
    Student.prototype.displayDetails = function(){
        console.log(this.name+' / '+this.mob);
    };
    var s4 = new Student("Tim","2211224454");
    s4.displayDetails();
    s4.printName();