## Compiler
  * The compiler gets a list of files.
  * Each (uncompiled) file is transformed to a (compiled) module.
    * Step 1: Lexer reads file and generates list of tokens.
    * Step 2: For each Module: Parser reads tokens and generates AST.
    * Step 3a (type-crawling): Type-Crawler traverses each AST in search for type
      * foreach type: create object with type information and store it inside type-store (global typestore or typestore of enclosing class)
      * type information stores class/enum/interface/record identifier with attributes and methods
      * generic Types are also types. they may have upper and lower class bounds
      * global typestore includes primitive types and library-types
    * Step 3b (type-resolving): Type-Resolver traverses AST and enriches type-nodes with reference to type
    * Step 4 (code generation pass 1): Code generator traverses AST and generates programs (statements only as strings, jumps not resolved)
      * global program for each module
      * static initialization program for each class
      * program for each method
    * Step 5 (linking, code generation pass 2): Code generator resolves jumps and compiles statements to javascript

## Compiler for library classes:

Library classes declare all java-fields and java-methods with string literals:

```javascript
export class StringClass extends ObjectClass {

    static __declareType(): string[] {
        return [
            "class String extends Object",          // first entry: class declaration
            "public String toString(): _toString"   // next entries: fields and methods
        ]
    }

    static type: NonPrimitiveType;

    constructor(public text: string){
        super();
    }

    _toString(t: Thread) {
        t.stack.push(this.text);        
    }
...
}

```