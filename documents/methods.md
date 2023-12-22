#methods
## storing
Each object contains its attributes as members. It's prototype is the corresponding class object which itself has it's base class as prototype.
### Example:
```java
class Test1 extends Test {
    String name;                  // Problem1: Test.name and Test1.name are ONE field in Javascript due to prototype inheritance
    String getName(){...},        // Problem2: in Javascript getName() overrides getName(int x) although it has a different signature. In Java we have method-overloading...
    void setName(String n){...}
}

class Test {
    String name;
    String toString(){...},
    String getName(int x){...}
}
```

Leads to this object structure:

```typescript
{  // Object of class Test1
    _name: string,  // member of java object
    name: string,   // in java: super.name
    age: number,

    prototype: {    // class-Object of class Test1
        _m$getName$String: (t: Thread) => void,       // return value is pushed to current stackframe t.sf
        _m$setName$void$String: (t: Thread, n: string) => void,
        _mo1249: { ... }  // method-objects, see later
        _mo1250: { ... }

        protoype: {  // class-object of class Test
            _m$toString$string: (t: Thread) => void, // return value is pushed to current stackframe t.sf
            _m$getName$String$int: (t: Thread) => void,  // return value is pushed to current stackframe t.sf
            _mo1248: { ... }
            _mo1247: { ... }
        }
    }
}
```

## naming conventions:
  * method: _m$<identifier>$<returntype>$<parametertypes>
  * static method: _sm$<identifier>$<returntype>$<parametertypes>
  * constructor: _c$<identifier>$<parametertypes>
  * parametertypes and returntypes are given **without generics**, so ArrayList instead of ArrayList<String>
  * parametertypes are separated by $
  * if return type is void, don't write $void$, but $$

## calling methods
Async/await and (even more so...) promises are slow, see [this test case](https://madelinemiller.dev/blog/javascript-promise-overhead/). So the compiler
should use them only if necessary. We therefore want to have as many library methods as possible returning their values with simple return statements.
On the other hand there may be library methods overridden by java methods or library methods and java methods implementing the same interface. 

We have these cases:
### a) library method wich is static or (final and doesn't implement an interface method) and does only call other such library methods
  * Implement as simple javascript method and return values by return statement.
  * tag this method as `simple` so that the compiler knows that return value doesn't lie on the stack and it can be inlined inside a term.

### b) other method
  * signature is `methodIdentifier(t: Thread, callback: () => void, p1, ..., pn)`
  * when calling other methods that don't belong to case a) then use the **unified method call**: 
```javascript
let callback1 = () => {
  let returnValue = t.sf.pop();
  // ... go on ...  
  t.sf.push(myReturnValue);
  if(callback != null) callback();
}
object.methodIdentifier(t: Thread, callback1, p1, ..., pn) 
 
```  
  

### c) java method (NOT static)
  * in order to make unified method calls possible, a java-method is represented by a javascript-proxy-method:
```javascript
methodIdentifier(t: Thread, callback, p1, ..., pn){
  push(this, p1, ..., pn);
  t.pushMethod(this._mo1248, callback);   // methodObject encapsulates all in
}
```
  * calling a unified method in java:
```javascript
// ... code before ...
// subsequent method call is last statement of this step:
object.methodIdentifier(t, null, p1, ..., pn);   // we don't need a callback as thread won't execute next step before method is complete   
```
  * if method returns a value you can get it via ``t.sf.pop()`` in the next step.

### d) static java method
  * static methods don't get called from library methods, so we don't need the callback-parameter.



## method objects
```javascript
type MethodObject = {
  steps: Step[]
}
```