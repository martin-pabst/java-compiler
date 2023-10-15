import { TokenList } from "../../java/Token";
import { ASTGlobalNode, ASTNodes } from "../../java/parser/AST";
import { Error } from "../Error";

export class Module {

    tokens?: TokenList;
    ast?: ASTGlobalNode;
    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = []

    constructor(public text: string){

    }

}