# TODO-List

## done:
  * wire up interpreter  -> done!
  * CodeGenerator: while-loop, then test performance... -> done. Looks great!
  * CodeGenerator: implicit casting -> done, needs testing...
  * CodeGenerator: class declaration -> done
  * CodeGenerator: method-declaration -> done (without ellipsis yet...)
  * CodeGenerator: method-call -> done
  * CodeGenerator: object instantiation -> done
  * CodeGenerator: field access -> done
  * CodeGenerator: constant folding -> done
  * try ... catch ... finally -> done
  * check if return statement happened in every execution line
  * check if local variables have been initialized before first access
  * wire up step over, step into, step out
  * enums...    -> needs more testing
  * interfaces...  -> needs more testing
  * use templates to generate fast code for static library functions like Math.sin, Math.atan2, ...
  * invoke methods on expressions wich evaluate to a string primitive (with constant folding)

## working status on current issue:
  * current project: named inner classes
  * added path to ASTClassDefinitionNode, ASTInterfaceDefinitionNode, ASTEnumDefinitionNode
  * added parent to ...
  * added path to ...
  * added path to NonPrimitiveType
  * above mentioned path and parent attributes get written in TypeResolver
  * TypeResolver finds types with dots in identifier
  * CodeGenerator invokes compileClass/compileEnum/compileInterface for named inner classes/enums/interfaces

### fine-grained next todos on current issue:
  * for non-static inner classes:
    * add invisible parameter "outer" to constructor of inner classes
    * add invisible attribute "ouber" to inner classes
    * on access to attribute of outer class: compile s[sb + 0].outer (.outer...).attributeIdentifier

## next todos
  * generics (status: mostly done)
  * anonymous inner classes
  * Array constants
  * library method to gather information for automated tests
  * library method examples
  * Lambda Functions



  

