export type LMADeclarationType = "declaration" | "field" | "method";

export type LibraryClassDeclaration = {
    type: LMADeclarationType;
    signature: string;
}

export type LibraryMethodDeclaration = {
    type: LMADeclarationType;
    signature: string;
    native?: Function;
    java?: Function;
    template?: string;
    constantFoldingFunction?: (...parms: any) => any;
}

export type LibraryAttributeDeclaration = {
    type: LMADeclarationType;
    signature: string;
    nativeIdentifier: string;
    constantValue: any;
} 

export type LibraryMethodOrAttributeDeclaration = LibraryClassDeclaration | LibraryMethodDeclaration | LibraryAttributeDeclaration;

export type LibraryDeclarations = LibraryMethodOrAttributeDeclaration[];