import { TokenType } from "../TokenType";

/**
 * Convert Visibility v to identifier: Visibility[v]
 * Convert TokenType tt to Visibility: Visibility[tt]  
 */
export enum Visibility {
    private = TokenType.keywordPrivate, 
    protected = TokenType.keywordProtected, 
    public = TokenType.keywordPublic
}

