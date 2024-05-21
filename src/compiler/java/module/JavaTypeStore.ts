import { Klass, KlassObjectRegistry } from "../../common/interpreter/StepFunction";
import { JCM } from "../JavaCompilerMessages";
import { TokenType } from "../TokenType";
import { PrimitiveStringClass } from "../runtime/system/javalang/PrimitiveStringClass";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { IJavaInterface, JavaInterface } from "../types/JavaInterface";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType";
import { JavaCompiledModule } from "./JavaCompiledModule";
import { LibraryKlassType } from "./libraries/JavaLibraryModule";

export class JavaTypeStore {

    private typeMap: Map<string, JavaType> = new Map();

    constructor() {

    }

    copy(excludeTypesOfModule?: JavaCompiledModule): JavaTypeStore {
        let jts = new JavaTypeStore();
        if (excludeTypesOfModule) {
            this.typeMap.forEach((value, key) => { if (value.module !== excludeTypesOfModule) jts.typeMap.set(key, value) });
        } else {
            this.typeMap.forEach((value, key) => { jts.typeMap.set(key, value) });
        }
        return jts;
    }

    empty() {
        this.typeMap = new Map();
    }

    addType(type: JavaType) {
        if (type instanceof NonPrimitiveType) {
            this.typeMap.set(type.pathAndIdentifier, type);
        } else {
            this.typeMap.set(type.identifier, type);
        }
    }

    getType(identifierWithPath: string): JavaType | undefined {
        return this.typeMap.get(identifierWithPath);
    }

    populateClassObjectRegistry(klassObjectRegistry: KlassObjectRegistry) {
        this.typeMap.forEach((type, key) => {
            if (type instanceof NonPrimitiveType && type.runtimeClass) {
                klassObjectRegistry[type.pathAndIdentifier] = type.runtimeClass;
            }
        })
    }

    initFastExtendsImplementsLookup() {
        this.typeMap.forEach((type, key) => {
            type.registerExtendsImplementsOnAncestors();
        })
    }

    getClasses(): JavaClass[] {
        let classes: JavaClass[] = [];

        this.typeMap.forEach((type, identifier) => {
            if (type instanceof JavaClass) {
                classes.push(type);
            }
        })

        return classes;
    }

    getNonPrimitiveTypes(): NonPrimitiveType[] {
        let npts: NonPrimitiveType[] = [];

        this.typeMap.forEach((type, identifier) => {
            if (type instanceof NonPrimitiveType) {
                npts.push(type);
            }
        })

        return npts;
    }


    getTypeCompletionItems(classContext: NonPrimitiveType | StaticNonPrimitiveType | undefined, rangeToReplace: monaco.IRange,
        afterNew: boolean, withPrimitiveTypes: boolean): monaco.languages.CompletionItem[] {

        let completionItems: monaco.languages.CompletionItem[] = [];

        this.typeMap.forEach((type, identifier) => {

            if (type instanceof PrimitiveType) {

                if (!withPrimitiveTypes) return;

                completionItems.push({
                    label: type.identifier,
                    detail: JCM.primitiveType(),
                    insertText: type.identifier,
                    kind: monaco.languages.CompletionItemKind.Struct,
                    range: rangeToReplace,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    command: {
                        id: "editor.action.triggerParameterHints",
                        title: '123',
                        arguments: []
                    }
                })
            } else {
                let npt = <NonPrimitiveType>type;
                if (classContext instanceof NonPrimitiveType && !npt.isVisibleFrom(classContext)) return;

                let kind: monaco.languages.CompletionItemKind = monaco.languages.CompletionItemKind.Class;
                if (type instanceof IJavaInterface) kind = monaco.languages.CompletionItemKind.Interface;
                if (type instanceof JavaEnum) kind = monaco.languages.CompletionItemKind.Enum;

                let isGeneric: boolean = type.genericTypeParameters && type.genericTypeParameters.length > 0 ? true : false;

                let suffix = "";
                if (afterNew) {
                    suffix = "($0)";
                    if (isGeneric) {
                        suffix = "<>($0)";
                    }
                }

                completionItems.push({
                    label: type.identifier,
                    detail: isGeneric ? JCM.genericType() : "",
                    insertText: npt.pathAndIdentifier + suffix,
                    kind: kind,
                    range: rangeToReplace,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    command: {
                        id: "editor.action.triggerParameterHints",
                        title: '123',
                        arguments: []
                    }
                })

            }
        })

        return completionItems;

    }


}