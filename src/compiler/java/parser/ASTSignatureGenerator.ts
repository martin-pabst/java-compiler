import { TokenType, TokenTypeReadable } from "../TokenType.ts";
import { ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTGlobalNode, ASTInterfaceDefinitionNode } from "./AST.ts";

export class TypeSignatures {
    symbolDeclarations: Map<string, boolean> = new Map();

    constructor(public declaration: string){



    }
}


export class ASTSignatureGenerator {

    signatures: Map<string, TypeSignatures> = new Map();

    constructor(globalNode: ASTGlobalNode ){
        if(!globalNode) return;
        for(let innerType of globalNode.innerTypes){

            switch(innerType.kind){
                case TokenType.keywordClass:
                    this.generateClassSignatures(innerType);
                    break;
                case TokenType.keywordInterface:
                    this.generateInterfaceSignatures(innerType);
                    break;
                case TokenType.keywordEnum:
                    this.generateEnumSignatures(innerType);
                    break;
            }
        }
    }

    generateClassSignatures(innerType: ASTClassDefinitionNode) {
        let signature = TokenTypeReadable[innerType.visibility] + " class " + innerType.identifier;
        if(innerType.genericParameterDeclarations.length > 0) signature += generateGenericDeclarations(innerType.genericParameterDeclarations);
        if(innerType.extends) signature += " extends " + this.generateTypeSignature(innerType.extends);
        if(innerType.implements.length > 0) signature += " implements " + innerType.implements.map(impl => this.generateTypeSignature(impl)).join(", ");
        
        let typeSignature = new TypeSignatures(signature);
        for(let m of innerType.methods){
            this.generateMethodSignature(m, typeSignature);
        }

        for(let f of innerType.fieldsOrInstanceInitializers.filter(decl => decl.kind = TokenType.fieldDeclaration)){
            this.generateFieldSignature(f, typeSignature);
        }

    }


    generateInterfaceSignatures(innerType: ASTInterfaceDefinitionNode) {
        let signature = TokenTypeReadable[innerType.visibility] + " class " + innerType.identifier;
        if(innerType.genericParameterDeclarations.length > 0) signature += generateGenericDeclarations(innerType.genericParameterDeclarations);
        if(innerType.implements.length > 0) signature += " extends " + innerType.implements.map(impl => this.generateTypeSignature(impl)).join(", ");
        
        let typeSignature = new TypeSignatures(signature);
        for(let m of innerType.methods){
            this.generateMethodSignature(m, typeSignature);
        }

        for(let f of innerType.fieldsOrInstanceInitializers.filter(decl => decl.kind = TokenType.fieldDeclaration)){
            this.generateFieldSignature(f, typeSignature);
        }

    }







}