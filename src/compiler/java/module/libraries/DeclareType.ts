type LMADeclarationType = "c" | "a" | "m";

type LibraryClassDeclaration = {
    type: LMADeclarationType;
    signature: string;
}

type LibraryMethodDeclaration = {
    type: LMADeclarationType;
    signature: string;
    native?: Function;
    java?: Function;
}

type LibraryAttributeDeclaration = {
    type: LMADeclarationType;
    signature: string;
    nativeIdentifier: string;
} 

type LibraryMethodOrAttributeDeclaration = LibraryClassDeclaration | LibraryMethodDeclaration | LibraryAttributeDeclaration;

type LibraryDeclarations = LibraryMethodOrAttributeDeclaration[];