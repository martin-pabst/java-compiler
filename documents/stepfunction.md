#Step function
Each step holds a function
```typescript
/**
 * t: current thread
 * sf: current stackframe
 * ho: helper objects, e.g.
 *  - classes to instantiate new objects
 *  - methods to call
 *  - ... 
 **/
type step = {
    fText: string,    // function of text before compiling to javascript
    hoText: string[] // helper objects as string before resolving to real objects

    f: (t: Thread, s: any[], sb: number, ho: {}) => {

        t.nextStepIndex = 21;
        t.callMethod(ho[3]);       // calls other Method after returning
        return 1;                  // next stepIndex
      }
    

    // 01.11.2023: Only generate one set of steps... second (faster) set later...
    correspondingStepIndex: number,  // if slow version: corresponding stepIndex in fast version and 
                                     // vice versa
}
```