import { EnumType } from "typescript";
import { JavaRepl } from "../../java/parser/repl/JavaRepl";
import { SystemCollection } from "../../java/runtime/system/collections/SystemCollection";
import { EnumClass } from "../../java/runtime/system/javalang/EnumClass";
import { JavaClass } from "../../java/types/JavaClass";
import { JavaEnum } from "../../java/types/JavaEnum";
import { JavaType } from "../../java/types/JavaType";
import { NonPrimitiveType } from "../../java/types/NonPrimitiveType";
import { IPrimitiveTypeWrapper } from "../../java/runtime/system/primitiveTypes/wrappers/IPrimitiveTypeWrapper";

export type IdentifierValuePair = {
    identifier: string,
    value: any
}

export class ValueTool {

    static isArray(value: any): boolean { return Array.isArray(value); }

    static isObject(value: any): boolean {
        if(typeof value != "object") return false;
        if(!value.constructor["type"]) return false;
        if(value.constructor.isPrimitiveTypeWrapper) return false;
        return true;
    }
    
    static isEnum(value: any): boolean {
        if(typeof value != "object") return false;
        if(value instanceof EnumClass) return true;
        return value.constructor.isPrimitiveTypeWrapper == true;
    }
    
    static isPrimitiveTypeOrNull(value: any): boolean {
        if(typeof value != "object") return false;
        if(Array.isArray(value)) return false;
        return true;
    }

    static getTypeAsString(value: any):string {
        return ValueTool.getTypeIntern(value);
    }

    private static getTypeIntern(v: any): string {
        if(v == null) return "null";

        if(Array.isArray(v)){
            if(v.length == 0) return "<unknown>[]";
            let element = v[0];
            return ValueTool.getTypeIntern(element) + "[]"
        }

        if(typeof v == "object"){
            if(!v.constructor["type"]){
                return "Object";
            }
            let type: NonPrimitiveType = v.constructor.type;
            return type.toString();
        }

        switch(typeof v){
            case "string": return "String";
            case "boolean": return "boolean";
            case "number": return (Math.trunc(v) == v) ? "int" : "double";
        }

        return "<unknown>";

    }

    static hasChildren(value: any){
        return value && (ValueTool.isArray(value) || 
        (ValueTool.isObject(value) && !ValueTool.isPrimitiveTypeOrNull(value) && !ValueTool.isEnum(value)));
    }

    static getChildren(value: any): IdentifierValuePair[] {
        let children: IdentifierValuePair[] = [];

        if(Array.isArray(value)){
            let index = 0;
            for(let v of value){
                children.push({
                    identifier: "" + index++,
                    value: v
                })
            }
        } else if(ValueTool.isObject(value)){
            let type = <JavaClass | JavaEnum>value.constructor.type;

            if(value instanceof SystemCollection){
                let index = 0;
                for(let v of value.getAllElements()){
                    children.push({
                        identifier: "" + index++,
                        value: v
                    })
                }
            } else {
                for(let field of type.getFields()){
                    if(field.internalName){
                        children.push({
                            identifier: field.identifier,
                            value: value[field.internalName]
                        })
                    }
                }    
            }
            
        }

        return children;
    }

    // TODO: Invoke toString()-Method of objects...
    static renderValue(value: any, maxLength: number = 20, repl?: JavaRepl){
        if(value == null) return 'null';
        if(typeof value == 'object'){
            let type = <NonPrimitiveType>value.constructor.type;
            
            if(value instanceof EnumClass){
                return ValueTool.renderEnum(value, <JavaEnum>type).substring(0, maxLength);
            }
            
            if(type.isPrimitiveTypeWrapper){
                return (<IPrimitiveTypeWrapper>value).debugOutput().substring(0, maxLength);
            }

            return type.toString() + "-object";

        } else {
            return ValueTool.renderPrimitiveValue(value).substring(0, maxLength);
        }    
    }

    //TODO: Type hint...
    static renderPrimitiveValue(value: any){
        switch(typeof value){
            case "string": return JSON.stringify(value);
            default: return "" + value;
        }
    }

    static renderEnum(value: EnumClass, type: JavaEnum){
        return type.identifier + "." + value.name;
    }

}