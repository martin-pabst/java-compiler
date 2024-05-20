import { TokenType } from "../TokenType";
import { GenericVariantOfJavaClass, IJavaClass, JavaClass } from "./JavaClass";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { StaticNonPrimitiveType } from "./StaticNonPrimitiveType";
import { Visibility } from "./Visibility";

/**
 * What fields/methods of objectType are visible inside currentClassContext?
 */
export function getVisibilityUpTo(objectType: NonPrimitiveType | StaticNonPrimitiveType, currentClassContext: NonPrimitiveType | StaticNonPrimitiveType | undefined): Visibility {

    if (currentClassContext == null) {
        return TokenType.keywordPublic;
    }

    if (objectType instanceof StaticNonPrimitiveType) objectType = objectType.nonPrimitiveType;
    if (currentClassContext instanceof StaticNonPrimitiveType) currentClassContext = currentClassContext.nonPrimitiveType;

    if(objectType instanceof GenericVariantOfJavaClass) objectType = objectType.isGenericVariantOf;
    if(currentClassContext instanceof GenericVariantOfJavaClass) currentClassContext = currentClassContext.isGenericVariantOf;

    if (objectType == currentClassContext) {
        return TokenType.keywordPrivate;
    }

    if(!(currentClassContext instanceof JavaClass)){
        return TokenType.keywordPublic;
    }

    if (currentClassContext.hasAncestorOrIs(objectType)) {
        return TokenType.keywordProtected;
    }

    return TokenType.keywordPublic;

}
