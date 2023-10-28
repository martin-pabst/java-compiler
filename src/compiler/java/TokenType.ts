export enum TokenType {
    identifier,
    // constants
    integerConstant,
    longConstant,
    shortConstant,
    floatingPointConstant,
    booleanConstant,
    stringConstant,
    charConstant,
    true,
    false,
    // keywords
    keywordPrint,
    keywordPrintln,
    keywordClass,
    keywordThis,
    keywordSuper,
    keywordNew,
    keywordInterface,
    keywordEnum,
    keywordVoid,
    keywordAbstract,
    keywordPublic,
    keywordProtected,
    keywordPrivate,
    keywordTransient,
    keywordStatic,
    keywordExtends,
    keywordImplements,
    keywordWhile,
    keywordDo,
    keywordFor,
    keywordSwitch,
    keywordCase,
    keywordDefault,
    keywordIf,
    keywordThen,
    keywordElse,
    keywordReturn,
    keywordBreak,
    keywordContinue,
    keywordNull,
    keywordFinal,
    keywordInstanceof,
    keywordTry,
    keywordCatch,
    // keywordInt,
    // keywordBoolean,
    // keywordString,
    // keywordFloat,
    // keywordChar,

    // brackets
    leftBracket, // ()
    rightBracket,
    leftSquareBracket, // []
    rightSquareBracket,
    leftCurlyBracket, // {}
    rightCurlyBracket,
    leftRightSquareBracket, // []

    // operators -- ++
    minusMinus, plusPlus,

    // binary operators
    dot, //.
    modulo,
    minus, plus, multiplication, division,
    lower, greater, lowerOrEqual, greaterOrEqual,
    equal, // ==
    notEqual, // !=
    assignment, // =
    plusAssignment, // +=
    minusAssignment, // -=
    multiplicationAssignment, // *=
    divisionAssignment, // /=
    divisionAssignmentInteger, // /=
    moduloAssignment, // /%=
    and, or,   // &&, ||
    ampersand, // &
    lambda, // ->

    singleQuote, doubleQuote, // ', "

    ANDAssigment,
    XORAssigment,
    ORAssigment,
    shiftLeftAssigment,
    shiftRightAssigment,
    shiftRightUnsignedAssigment,
    OR, // |
    XOR, // ^
    // AND, // & see TokenType.ampersand above
    tilde, // ~
    shiftRightUnsigned, // >>>
    shiftRight, // >>
    shiftLeft, // <<

    ternaryOperator,  // ?-Operator
    colon, //:
    ellipsis, // ...

    not,    // !
    // used by parser
    negation,


    // semicolon
    semicolon, // ;

    // comma
    comma, // ,

    // backslash
    backslash,

    // @
    at,

    // whitespace
    space,

    tab,

    // newline
    newline,

    // line feed
    linefeed,

    // only lexer-internal
    identifierChar,  // none of the special chars above a..zA..Z_Äö...

    // Comment
    comment,

    referenceElement, // for arrays

    endofSourcecode, // will be generated after sourcecode end

    // Program statement types:
    binaryOp, // +, -, *, <=, ...
    unaryPrefixOp, // ! and - 
    localVariableDeclaration,
    heapVariableDeclaration,
    pushLocalVariableToStack, // push value of a local variable to stack
    popAndStoreIntoVariable,
    pushFromHeapToStack, // push value from heap to stack
    pushAttribute, // value of a attribute to stack
    pushArrayLength,
    pushConstant, // literal
    pushStaticClassObject, // push class-Object to stack (which holds static attributes)
    pushStaticAttribute, // push static attribute to stack
    pushStaticAttributeIntrinsic, // push static attribute to stack
    checkCast, // check if object may get casted to class or interface
    castValue, // cast value on top of stack to other type
    selectArrayElement, // select Element from Array (e.g. a[20])
    callMethod,
    callMainMethod,
    processPostConstructorCallbacks,
    callInputMethod, // Methods of Input class
    makeEllipsisArray,
    decreaseStackpointer, // decrease stack-pointer, nothing else
    initStackframe,
    closeStackframe,
    increaseSpaceForLocalVariables,
    return,
    newObject,
    jumpIfFalse,
    jumpIfTrue,
    jumpIfFalseAndLeaveOnStack,
    jumpIfTrueAndLeaveOnStack,
    jumpAlways,
    noOp, // acts as jump destination
    incrementDecrementBefore, // ++i, --i
    incrementDecrementAfter, // i++, i--
    incrementDecrementCharBefore, // ++i, --i
    incrementDecrementCharAfter, // i++, i--
    programEnd,
    beginArray, // push empty array to stack
    addToArray, // pop element form stack and add it to array (on second stack position)
    pushEmptyArray, // push multidimensional empty array to stack
    forLoopOverCollection,

    // additional AST node types
    global,
    program,
    block,    // block of statements
    multiNode,  // used for debugging output
    plusPlusMinusMinusSuffix,
    genericParameterDefinition,
    variable,
    annotation,

    type, // e.g. int[][]
    typeParameter, // e.g. <E extends String implements Comparable<E>>
    attributeDeclaration,
    methodDeclaration,
    parameterDeclaration,
    superConstructorCall,
    constructorCall,       // call constructor with this() inside another constructor
    newArray,
    arrayInitialization,
    print,
    println,
    pushEnumValue,
    initializeEnumValue,
    scopeNode,
    returnIfDestroyed,
    extendedForLoopInit,
    extendedForLoopCheckCounterAndGetElement,
    setPauseDuration,
    pause
}

export var TokenTypeReadable: { [tt: number]: string } = {
    [TokenType.identifier]: "Bezeichner",
    // constants
    [TokenType.integerConstant]: "Integer-Konstante",
    [TokenType.floatingPointConstant]: "Fließkomma-Konstante",
    [TokenType.booleanConstant]: "boolesche Konstante",
    [TokenType.stringConstant]: "Zeichenketten-Konstante",
    [TokenType.charConstant]: "char-Konstante",
    [TokenType.true]: "true",
    [TokenType.false]: "false",
    // keywords
    [TokenType.keywordClass]: "class",
    [TokenType.keywordThis]: "this",
    [TokenType.keywordSuper]: "super",
    [TokenType.keywordNew]: "new",
    [TokenType.keywordInterface]: "interface",
    [TokenType.keywordEnum]: "enum",
    [TokenType.keywordVoid]: "void",
    [TokenType.keywordAbstract]: "abstract",
    [TokenType.keywordPublic]: "public",
    [TokenType.keywordProtected]: "protected",
    [TokenType.keywordPrivate]: "private",
    [TokenType.keywordTransient]: "transient",
    [TokenType.keywordStatic]: "static",
    [TokenType.keywordExtends]: "extends",
    [TokenType.keywordImplements]: "implements",
    [TokenType.keywordWhile]: "while",
    [TokenType.keywordDo]: "do",
    [TokenType.keywordFor]: "for",
    [TokenType.keywordSwitch]: "switch",
    [TokenType.keywordCase]: "case",
    [TokenType.keywordDefault]: "default",
    [TokenType.keywordIf]: "if",
    [TokenType.keywordThen]: "then",
    [TokenType.keywordElse]: "else",
    [TokenType.keywordReturn]: "return",
    [TokenType.keywordBreak]: "break",
    [TokenType.keywordContinue]: "continue",
    [TokenType.keywordNull]: "null",
    [TokenType.keywordFinal]: "final",
    [TokenType.keywordInstanceof]: "instanceof",
    [TokenType.keywordTry]: "try",
    [TokenType.keywordCatch]: "catch",
    [TokenType.keywordPrint]: "print",
    [TokenType.keywordPrintln]: "println",
    // keywordInt,
    // keywordBoolean,
    // keywordString,
    // keywordFloat,
    // keywordChar,

    // brackets
    [TokenType.leftBracket]: "(", // ()
    [TokenType.rightBracket]: ")",
    [TokenType.leftSquareBracket]: "[", // []
    [TokenType.rightSquareBracket]: "]",
    [TokenType.leftCurlyBracket]: "{", // {}
    [TokenType.rightCurlyBracket]: "}",
    [TokenType.leftRightSquareBracket]: "[]",

    // operators
    [TokenType.dot]: ".", //.
    [TokenType.minus]: "-",
    [TokenType.modulo]: "%",
    [TokenType.plus]: "+",
    [TokenType.multiplication]: "*",
    [TokenType.division]: "/",
    [TokenType.singleQuote]: "'",
    [TokenType.doubleQuote]: "\"", // ']: "", "
    [TokenType.minusMinus]: "--",
    [TokenType.plusPlus]: "++",
    [TokenType.lower]: "<",
    [TokenType.greater]: ">",
    [TokenType.lowerOrEqual]: "<=",
    [TokenType.greaterOrEqual]: ">=",
    [TokenType.equal]: "==", // ==
    [TokenType.notEqual]: "!=", // !=
    [TokenType.assignment]: "=", // =
    [TokenType.plusAssignment]: "+=", // +=
    [TokenType.minusAssignment]: "-=", // -=
    [TokenType.multiplicationAssignment]: "*=", // *=
    [TokenType.divisionAssignment]: "/=", // /=
    [TokenType.moduloAssignment]: "%=",
    [TokenType.ampersand]: "&",
    [TokenType.lambda]: "->",
    [TokenType.and]: "&&",
    [TokenType.or]: "||",
    [TokenType.not]: "!",

    [TokenType.ANDAssigment]: "&=",
    [TokenType.XORAssigment]: "^=",
    [TokenType.ORAssigment]: "|=",
    [TokenType.shiftLeftAssigment]: "<<=",
    [TokenType.shiftRightAssigment]: ">>=",
    [TokenType.shiftRightUnsignedAssigment]: ">>>=",
    // [TokenType.AND]: "&", 
    [TokenType.OR]: "|",
    [TokenType.XOR]: "^",
    [TokenType.tilde]: "~",
    [TokenType.shiftLeft]: "<<",
    [TokenType.shiftRight]: ">>",
    [TokenType.shiftRightUnsigned]: ">>>",


    [TokenType.ternaryOperator]: "?",

    // semicolon
    [TokenType.semicolon]: ";", // ;

    [TokenType.colon]: ":", // ;
    [TokenType.ellipsis]: "...", // ;

    // comma
    [TokenType.comma]: ",",

    // backslash
    [TokenType.backslash]: "\\",

    // at
    [TokenType.at]: "@",

    // whitespace
    [TokenType.space]: "Leerzeichen",
    [TokenType.tab]: "Tabulatorzeichen",

    // newline
    [TokenType.newline]: "ein Zeilenumbruch",

    // only lexer-internal
    [TokenType.identifierChar]: "eines der Zeichen a..z, A..Z, _",  // none of the special chars above a..zA..Z_Äö...

    // Comment
    [TokenType.comment]: "ein Kommentar",

    [TokenType.endofSourcecode]: "das Ende des Programmes"

}

export var specialCharList: { [keyword: string]: TokenType } = {
    '(': TokenType.leftBracket, // ()
    ')': TokenType.rightBracket,
    '[': TokenType.leftSquareBracket, // []
    ']': TokenType.rightSquareBracket,
    '{': TokenType.leftCurlyBracket, // {}
    '}': TokenType.rightCurlyBracket,

    // operators
    '.': TokenType.dot, //.
    ',': TokenType.comma, //.
    '-': TokenType.minus,
    '%': TokenType.modulo,
    '+': TokenType.plus,
    '*': TokenType.multiplication,
    '/': TokenType.division,
    '\\': TokenType.backslash,
    '@': TokenType.at,
    '\'': TokenType.singleQuote,
    '"': TokenType.doubleQuote, // ', "
    "<": TokenType.lower,
    ">": TokenType.greater,
    "=": TokenType.assignment,
    "&": TokenType.and,
    "|": TokenType.or,
    "!": TokenType.not,
    "?": TokenType.ternaryOperator,

    "^": TokenType.XOR,
    "~": TokenType.tilde,

    ';': TokenType.semicolon, // ;
    ':': TokenType.colon, // ;

    '...': TokenType.ellipsis,

    // whitespace
    ' ': TokenType.space,
    '\t': TokenType.tab,

    // newline
    '\n': TokenType.newline,
    '\r': TokenType.linefeed
}

export var keywordList: { [keyword: string]: TokenType } = {
    "class": TokenType.keywordClass,
    "this": TokenType.keywordThis,
    "super": TokenType.keywordSuper,
    "new": TokenType.keywordNew,
    "interface": TokenType.keywordInterface,
    "enum": TokenType.keywordEnum,
    "void": TokenType.keywordVoid,
    "abstract": TokenType.keywordAbstract,
    "public": TokenType.keywordPublic,
    "protected": TokenType.keywordProtected,
    "private": TokenType.keywordPrivate,
    "transient": TokenType.keywordTransient,
    "static": TokenType.keywordStatic,
    "extends": TokenType.keywordExtends,
    "implements": TokenType.keywordImplements,
    "while": TokenType.keywordWhile,
    "do": TokenType.keywordDo,
    "for": TokenType.keywordFor,
    "switch": TokenType.keywordSwitch,
    "case": TokenType.keywordCase,
    "default": TokenType.keywordDefault,
    "if": TokenType.keywordIf,
    "then": TokenType.keywordThen,
    "else": TokenType.keywordElse,
    "return": TokenType.keywordReturn,
    "break": TokenType.keywordBreak,
    "continue": TokenType.keywordContinue,
    "null": TokenType.keywordNull,
    "final": TokenType.keywordFinal,
    "instanceof": TokenType.keywordInstanceof,
    "try": TokenType.keywordTry,
    "catch": TokenType.keywordCatch,
    "true": TokenType.true,
    "false": TokenType.false,
    "print": TokenType.keywordPrint,
    "println": TokenType.keywordPrintln,
    // "int": TokenType.keywordInt,
    // "boolean": TokenType.keywordBoolean,
    // "String": TokenType.keywordString,
    // "float": TokenType.keywordFloat,
    // "char": TokenType.keywordChar
};

export var EscapeSequenceList: { [keyword: string]: string } = {
    "n": "\n",
    "r": "\r",
    "t": "\t",
    "\"": "\"",
    "'": "'",
    "\\": "\\"
}