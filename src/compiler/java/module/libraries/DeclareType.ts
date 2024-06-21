export type LMADeclarationType = "declaration" | "field" | "method";

export type LibraryClassDeclaration = {
    type: LMADeclarationType;
    signature: string;
    comment?: string | (() => string);
}

export type LibraryMethodDeclaration = {
    type: LMADeclarationType;
    signature: string;
    native?: Function;
    java?: Function;
    template?: string;
    constantFoldingFunction?: (...parms: any) => any;
    comment?: string | (() => string);
}

export type LibraryAttributeDeclaration = {
    type: LMADeclarationType;
    signature: string;
    nativeIdentifier: string;
    template?: string;
    constantValue: any;
    comment?: string | (() => string);
} 

export type LibraryMethodOrAttributeDeclaration = LibraryClassDeclaration | LibraryMethodDeclaration | LibraryAttributeDeclaration;

export type LibraryDeclarations = LibraryMethodOrAttributeDeclaration[];