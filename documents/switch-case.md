```javascript
switch(x) {
    case 1: print("A"); // no break
    case 2: print("B"); break;
    case 3: print("C"); break;
    default: print("D"); break;
}
// translates to
if (x!=1) {
    jump Label2
}
Block1
Label2:
if(x!=2) {
    jump Label 3
}
Block 2
jump LabelOut
Label 3:
if(x!=3) {
    jump LabelDefault
}
Block 3
jump LabelOut

Label1:
if(!i < 100){
    jump Label2;
}
block;
i++;
jump Label1

Label2:
continue...


```


## What remains to be done:

- Handle `String`s, enums, boxed types.
- Check wether switch-expression is a constant term (https://docs.oracle.com/javase/specs/jls/se12/preview/switch-expressions.html#jep325-15.29)
- Handle 
```
case 0:
case 1: // Statement
...
```

Maybe handle in parser? Anyways we also have to take care of
```
case 0,1:
    // Statement
```
Change `ASTCaseNode` to 
```
export interface ASTCaseNode extends ASTNode {
    kind: TokenType.keywordCase;
    constant: ASTTermNode[];  // [] in case of default:
    statements: ASTStatementNode[];
}
```

Handle "new" switch-statement:

```
int numLetters = 0;
Day day = Day.WEDNESDAY;
switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> numLetters = 6;
    case TUESDAY                -> numLetters = 7;
    case THURSDAY, SATURDAY     -> numLetters = 8;
    case WEDNESDAY              -> numLetters = 9;
    default -> throw new IllegalStateException("Invalid day: " + day);
};
System.out.println(numLetters);
```