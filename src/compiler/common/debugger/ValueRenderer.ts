import { JavaField } from "../../java/types/JavaField.ts";
import { RuntimeObject } from "./DebuggerSymbolEntry.ts";

type ArrayOutputData = {
    text: string
}

export class ValueRenderer {

    static quickArrayOutput(a: any[], maxLength: number): string {

        let data: ArrayOutputData = {
            text: ""
        }

        this.quickArrayOutputHelper(a, data, maxLength);

        return data.text;
    }

    private static quickArrayOutputHelper(a: any[], data: ArrayOutputData, maxLength: number) {
        let index: number = 0;
        data.text += "[";
        while (index < a.length && data.text.length < maxLength) {
            let element = a[index];
            if (Array.isArray(element)) {
                ValueRenderer.quickArrayOutputHelper(element, data, maxLength);
            } else {
                data.text += ValueRenderer.renderValue(element, maxLength - data.text.length - 3);
            }
            if (index < a.length - 1) data.text += ", ";
            index++;
        }

        if (index < a.length) data.text += "...";

        data.text += "]";
    }


    static renderValue(value: any, maxLength: number): string {
        if (Array.isArray(value)) {
            return ValueRenderer.quickArrayOutput(value, maxLength);
        } else {
            switch (typeof value) {
                case "object":
                    if (value == null) {
                        return "null";
                    } else {
                        return ValueRenderer.renderObject(value, maxLength);
                    }
                case "string":
                    return '"' + value.substring(0, maxLength) + '"';
                case "undefined":
                    return "";
                default:
                    return ("" + value).substring(0, maxLength);
            }
        }


    }

    private static renderObject(value: RuntimeObject | null, maxLength: number): string {
        if(value == null) return "null";

        let s: string = "{";
            let type = value.getType();
            if(type){
                let fields = type.getOwnAndInheritedFields();

                let i: number = 0;
                while(i < fields.length && s.length < maxLength){
                    let field = fields[i] as JavaField;
                    if(field.internalName){
                        s += field.identifier + " = ";
                        s += ValueRenderer.renderValue(value[field.internalName], maxLength - s.length);
                    }
                    i++;
                    if(i < fields.length) s += ", ";
                }

                if(i < fields.length) s += "..."

            }

        return s + "}";
    }

}