import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { ASTNode, ASTTypeNode } from "./AST";
import { Parser } from "./Parser";

export class ASTNodeFactory {

    constructor(private parser: Parser){

    }

    buildTypeNode(startRange?: IRange): ASTTypeNode {

        if(!startRange) startRange = this.parser.cct.range;

        return {
            type: TokenType.type,
            range: Object.assign({}, startRange),
            identifier: "",
            arrayDimensions: 0,
            genericParameterAssignments: []
        }

    }



}