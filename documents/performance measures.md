# Performance measures


# String as primitive type

```javascript
String s = "Test"; // => internal type of s is String; "Test" gets casted from string to String
                   // compiled code: s[sb + 0] = new String("Test");

void doIt(String s){...}; // => internal type of s is String
String s;
int i = 12;
s = "Test" + i;            // "Test" has type string. "Test + i has also type string and gets casted to String before assignment. Compiled: s = new String("Test" + s[sb + 7]);

println("Test" + i);       // all library functions expect string, not String, so this compiles to h["..."].println("Test" + s[sb + 7]);


doIt("Test");              // "Test" is cast to String before assignment, so this compiles to doIt(new String("Test"));

String s = new DecimalFormat("###.00").format(7.23943);   // library functions return string. This gets casted to String before assignment to s

String s = "a";             // is compiled to s[sb + 7] = new t.classes["String"]("a")
s += "x";                  // is compiled to (s[sb + 7]||t.npe(...)).value += "x";
                           // n.B..: t.npe(...) handles NullPointerException, see below

s = "x";                    // compiles to s[sb + 7].value = "x";
s.length;                  // length is public attribute of s => no problem
s.compareTo(...);          // s is object with all methods => no problem

"Test".length              // compiler magic needed: compile to "Test".length

String s1 = s + "Test";    // s + "Test" has type string and is compiled to s[sb + 7].value + "Test". It gets casted to String before assignment, so
                           // this statement compiles to s[sb + 8] = new h["classes"].String(s[sb + 7].value + "Test");
```

# Catching NullpointerExceptions
The helper object has a property 
```javascript
ho = {
    npe: function(exceptionCode: number){...}
}
```
It stores information about a (later to happen...) NullpointerException outside the step function.
```javascript
a.doIt(b, c);
// compiles to:
(a||t.npe(1249)).doIt(b, c);

```
Each program has a Map which maps Exception codes to detailed information (range, term: string, ...).


# Throwing ArithmeticExceptions
The helper object has a property 
```javascript
ho = {
    ae: function(exceptionCode: number){...}
}
```
It stores information about a (later to happen...) ArithmeticException outside the step function.
```javascript
int a = ...;
int b = 12/a;
// compiles to:
int a = ...;
s[sb + 7] = 12/(s[sb + 8]||t.ae(1249));

```
Each program has a Map which maps Exception codes to detailed information (range, term: string, ...).
Function ae stores information about the Exception and then throws javascript exception to halt program execution...

# Indexing arrays with correct OutOfBoundsException
```javascript
int b, x;
int a = v[b + 3][x];
// compiles to: (v lies on pos 7, b on pos 12, x on pos 13)
s[sb + 2] = t.arr(s[sb + 7], 1370, s[sb + 12] + 3, s[sb + 13])
```


