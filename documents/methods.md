#methods
## storing
Each object contains its attributes as members. It's prototype is the corresponding class object which itself has it's base class as prototype.
### Example:
```java
class Test1 extends Test {
    String name;
    String getName(){...},
    void setName(String n){...}
}

class Test {
    String name;
    String toString(){...},
    String getName(){...}
}
```

Leads to this object structure:

```typescript
{  // Object of class Test1
    _name: string,  // member of java object
    name: string,   // in java: super.name
    age: number,

    prototype: {    // class-Object of class Test1
        _m$getName$$string: (t: Thread) => Promise<string>,       // overwrites _m$getName() of prototype
        _m$setName$String$void: (t: Thread, n: string) => Promise<void>,

        protoype: {  // class-object of class Test
            _m$toString$$string: (t: Thread) => Promise<string>,
            _m$getName$$String: (t: Thread) => Promise<string>,
        }
    }
}
```

## naming conventions:
  * method: _m$<identifier><>$<parametertypes>$<returntype>
  * static method: _sm$<identifier>$<parametertypes>$<returntype>
  * constructor: _c$<identifier>$<parametertypes>
  * parametertypes are separated by _
  * parametertypes and returntypes are given **without generics**, so ArrayList instead of ArrayList<String>

## calling methods
  * Parameter 1: thread-object
  * Parameter 2..n: method parameters
  * If it's a static method then it's called with this == static class object, otherwise with this == object
  * Method returns a promise

### Example:
```java
   println(student.toString("Mister"));
```
Let's assume, student-object is on top of stack and ho[0] is the println-method, then this code is compiled to
```javascript
   // step 21:
   sf.pop()._m$toString$string$string(t, "Mister").then(
    (ret: string) => {
        push(ret);
        t.nextStepIndex = 22;
    }
   )
    // step 22:
    ho[0](t, pop());
```

## Methods written in Typescript
```typescript

    doSomething(t: Thread, s: string): Promise<string> {
        return new Promise
    }


```




Alternative: 
  * method call is always last call of step
  * return values are always pushed to current stackframe with t.push(value)
  * Java methods only do
```javascript
m(t: thread, p1, p2){
    t.pushMethod(program); // pushes Method to method stack and opens new stackframe
    t.push(this, p1, p2);  // pushes, this, p1, p2 to new stackframe
    return;  // after this the calling method returns and the thread continues with called method on next step
}
```

 * Typescript methods can be quite simple:
 ```javascript
   m(t: thread, p1, p2): void {
        // do something with p1 and p2
        t.push(returnvalue); // t pushes this on top of current stackframe
   }
 ```

 * If typescript method wants to call other method which could be a Java method:
 ```javascript
   m(t: thread, p1, p2): void {

        // we want to call p1.doSomething(p2)
        t.call(p1, p1.doSomething, p2).then((ret) => {
            
        })

   }
 ```
