# Variable adressing
## local variables, parameters
```java
int a = 12;
println(a);
```
The value of a lies on the stack at position p relative to current stackframe:
### compiled code:
```javascript
   s[sb + 7] = 12;
   t.methods.print(s[sb + 7]);
```

## member variable
`s[sb + 0]` holds `this`-object, so 
```java
class Test {
    name: String;

    public String getName(){
        return name;
    }
}
```
compiles to
```javascript
sf.push(s[sb + 0].name);
return;
```

### accessing memeber variables of base classes
If base class Test1 contains member `name` and child class Test2 contains member `name` and it's child class Test3 also contains member `name` then objects look like this:
```typescript
{
    name: string; // member of Test1
    __name: string; // member of Test2
    ___name: string; // member of Test3
}
```
So for example `super.name` in class Test3 is compiled to `sf[0].__name`;

## use member of outer class in inner class -> 01.11.2023: later!
Inner object has member `_$outer` which references outer object, so accessing member `x` of outer class is achieved with
```javascript
sf[0]._$outer.x
``` 

## static variables
If static member `name` of `class Test` is used anywhere then class-object for class `Test` is put into map `ho.classes` by compiler. `name` is then used this way:
```javascript
ho.classes["Test"].name
```

