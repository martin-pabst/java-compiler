import { le } from "../../tools/language/LanguageManager"

/**
 * Java compiler's messages
 */
export class JCM {

    /**
     * Messages for class BinopCastCodeGenerator  
     */

    static typeLeftOperandNotFound = () => le({
        "de": "Der Typ des linken Operanden kann nicht bestimmt werden.",
        "en": "Couldn't compute type of left operand."
    });

    static typeRightOperandNotFound = () => le({
        "de": "Der Typ des rechten Operanden kann nicht bestimmt werden.",
        "en": "Couldn't compute type of right operand."
    });

    static operatorNotFeasibleForOperands = (operatorIdentifier: string, lIdentifier: string, rIdentifier: string) => le({
        "de": "Der Operator " + operatorIdentifier + " ist für die Typen " + lIdentifier + " und " + rIdentifier + " nicht geeignet.",
        "en": "Operator " + operatorIdentifier + " is not defined for operands of type " + lIdentifier + " and " + rIdentifier + ".",
    });

    static cantAssignValueToTerm = () => le({
        "de": "Dem Term auf der linken Seite des Zuweisungsoperators kann nichts zugewiesen werden.",
        "en": "Can't assign value to expression on left side of assignment operator.",
    });

    static cantCastRightSideToString = () => le({
        "de": "Der Term auf der rechten Seite des Zuweisungsoperators kann nicht in den Typ String umgewandelt werden.",
        "en": "Can't cast expression on right side of assignment operator to type String.",
    })

    static leftOperatorNotFitForAttribute = (operator: string) => le({
        "de": "Mit dem Attribut/der Variablen auf der linken Seite des Zuweisungsoperators kann die Berechnung " + operator + " nicht durchgeführt werden.",
        "en": "Field/variable on left side of operator " + operator + " is not usable for this operation.",
    })

    static rightOperatorNotFitForAttribute = (operator: string) => le({
        "de": "Mit dem Attribut/der Variablen auf der rechten Seite des Zuweisungsoperators kann die Berechnung " + operator + " nicht durchgeführt werden.",
        "en": "Field/variable on right side of operator " + operator + " is not usable for this operation.",
    })

    static cantUseOperatorForLeftRightTypes = (operator: string) => le({
        "de": "Der Wert des Datentyps auf der rechten Seite des Operators " + operator + " kann mit der Variablen/dem Attribut auf der linken Seite nicht verrechnet werden.",
        "en": "Can't use operator " + operator + " for types of given left/right side operands.",
    })

    static cantCastType = (srcIdentifier: string, destIdentifier: string) => le({
        "de": "Der Typ " + srcIdentifier + " kann nicht in den Typ " + destIdentifier + " gecastet werden.",
        "en": `Can't cast ${srcIdentifier} to ${destIdentifier}.`,
    })

    static unneccessaryCast = () => le({
        "de": `Unnötiges Casten`,
        "en": `Unneccessary cast`,
    })

    static leftExpressionHasNoType = (operator: string) => le({
        "de": "Der Term auf der linken Seite des '" + operator + "' - Operators hat keinen Datentyp. ",
        "en": `Expression on left side of operator '${operator}' has no type.`,
    })

    static rightExpressionHasNoType = (operator: string) => le({
        "de": "Der Term auf der rechten Seite des '" + operator + "' - Operators hat keinen Datentyp. ",
        "en": `Expression on right side of operator '${operator}' has no type.`,
    })

    static cantGetTypeOfExpression = () => le({
        "de": "Der Typ des Terms kann nicht bestimmt werden.",
        "en": `Can't compute type of this expression.`,
    })

    static operatorNotUsableForOperands = (operator: string, type: string) => le({
        "de": "Der Operator " + operator + " ist nicht für den Operanden des Typs " + type + "geeignet.",
        "en": `Operator ${operator} is not usable for operands of type ${type}.`,
    })

    static notOperatorNeedsBooleanOperands = (type: string) => le({
        "de": "Der Operator ! (not) ist nur für boolesche Operanden geeignet, nicht für Operanden des Typs " + type + ".",
        "en": `Operator ! (not) needs boolean operands, but given operands are of type ${type}.`,
    })

    static plusPlusMinusMinusOnlyForLeftyOperands = (operatorAsString: string) => le({
        "de": "Der Operator " + operatorAsString + " ist nur für Variablen/Attribute geeignet, deren Wert verändert werden kann.",
        "en": `Operator ${operatorAsString} can only be used for fields/variables which are writable.`,
    })

    


    static dd = () => le({
        "de": ``,
        "en": ``,
    })

}            
