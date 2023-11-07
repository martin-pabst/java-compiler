## make fast library method calls possible
In most cases library methods 
  * are not overridden by java methods
  * don't call methods which are/may be overridden by java methods

Therefore we don't need java calling conventions for most library methods which has performance benefits:
  * function call doesn't need to be last call in step-function
  * parameter `t: Thread` is not necessary
  * return value can directly be used inside term. We don't have to push/pop it onto/from stack

If 
  * the authors of library classes tag methods which call java methods and
  * the compiler keeps track which methods are overridden by java methods
then the authors of library classes **could write most of their methods in normal style**:
```javascript
   // java-declaration: "public String addAndMakeString(int a, int b): addAndMakeString
   addAndMakeString(a: number, b: number): string {
        return "" + (a + b);
   }
```
The LibraryDeclarationParser 
  * adds new Method `_mn$addAndMakeString$String$int$int` and lets it point to method addAndMakeString (second name for same method)
  * adds second Method `_mj$addAndMakeSTring$String$int$int` which wraps addAndMakeString to follow java calling conventions:

```javascript
   _m$addAndMakeString$String$int$int(t: Thread, a: number, b: number) {
      t.stack.push(this.addAndMakeString(a, b));    
   }

```

Then the compiler can decide which method to call:
  * call `_mn$addAndMakeString$String$int$int` if method is not overriden by java methods
  * call `_mj$addAndMakeSTring$String$int$int` otherwise.


