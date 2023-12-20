type LMADeclarationType = "declaration" | "field" | "method";

type LibraryClassDeclaration = {
    type: LMADeclarationType;
    signature: string;
}

type LibraryMethodDeclaration = {
    type: LMADeclarationType;
    signature: string;
    native?: Function;
    java?: Function;
    template?: string;
    constantFoldingFunction?: (...parms: any) => any;
}

type LibraryAttributeDeclaration = {
    type: LMADeclarationType;
    signature: string;
    nativeIdentifier: string;
    constantValue: any;
} 

type LibraryMethodOrAttributeDeclaration = LibraryClassDeclaration | LibraryMethodDeclaration | LibraryAttributeDeclaration;

type LibraryDeclarations = LibraryMethodOrAttributeDeclaration[];