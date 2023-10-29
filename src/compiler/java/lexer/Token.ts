import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";

export type Token = {
    tt: TokenType,
    value: string|number|boolean,
    range: IRange,
    commentBefore?: Token,
    spaceBefore?: Token
}

export type TokenList = Token[];

function tokenToString(t: Token){
    return "<div><span style='font-weight: bold'>" + TokenType[t.tt] + "</span>" +
            "<span style='color: blue'> &nbsp;'" + t.value + "'</span> (l&nbsp;" + t.range.startLineNumber + ", c&nbsp;" + t.range.startColumn + ")</div>";
}
 
export function tokenListToString(tl: TokenList):string{
    let s = "";
    for(let t of tl){
        s += tokenToString(t) + "\n";
    }
    return s;
}