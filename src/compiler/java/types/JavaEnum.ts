import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType.ts";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { GenericTypeParameter } from "./GenericTypeParameter";
import { JavaClass } from "./JavaClass";
import { JavaTypeWithInstanceInitializer } from "./JavaTypeWithInstanceInitializer.ts";
import { JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility.ts";


export class JavaEnum extends JavaTypeWithInstanceInitializer {
    
    fields: Field[] = [];
    methods: Method[] = [];
    
    private implements: JavaInterface[] = [];
    
    
    constructor(identifier: string, identifierRange: IRange, path: string, module: JavaBaseModule, public baseEnumClass: JavaClass) {
        super(identifier, identifierRange, path, module);
    }
    
    getField(identifier: string, uptoVisibility: Visibility, forceStatic: boolean = false): Field | undefined {
        let field = this.getFields().find(f => f.identifier == identifier && f.visibility <= uptoVisibility && (f.isStatic || !forceStatic));
        if (field) return field;
        if (uptoVisibility == TokenType.keywordPrivate) uptoVisibility = TokenType.keywordProtected;

        return this.baseEnumClass.getField(identifier, uptoVisibility, forceStatic);

    }

    getExtends():JavaClass {
        return this.baseEnumClass;
    }

    isGenericTypeParameter(): boolean {
        return false;
    }

    isGenericVariant(): boolean {
        return false;
    }

    getFile(): File {
        return this.module.file;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, NonPrimitiveType>): JavaEnum {
        return this;
    }

    getImplements(): JavaInterface[] {
        return this.implements;
    }

    public getFields(): Field[] {

        return this.fields;

    }

    public getOwnMethods(): Method[] {
        return this.methods;
    }

    getAllMethods(): Method[] {
        return this.getOwnMethods().concat(this.baseEnumClass.getAllMethods());
    }


    canImplicitlyCastTo(otherType: JavaType): boolean {
        if (otherType.isPrimitive) return false;

        if (otherType instanceof JavaInterface) {
            for (let intf of this.implements) {
                if (intf.canExplicitlyCastTo(otherType)) return true;
            }
            return false;
        }

        if (otherType instanceof JavaEnum) {
            if (otherType == this) return true;
            return false;
        }

        if (otherType instanceof JavaClass) {
            if (otherType.identifier == 'Object') return true;
            return false;
        }

        return false;

    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        return this.canImplicitlyCastTo(otherType);
    }

    toString(): string {
        return this.identifier;
    }

    getDeclaration(): string {
        let decl: string = TokenTypeReadable[this.visibility] + " ";
        if (this.isStatic) decl += "static ";
        decl += "enum " + this.identifier;
        return decl;
    }

    getReifiedIdentifier(): string {
        return this.identifier;
    }

    getCompletionItems(visibilityUpTo: Visibility, leftBracketAlreadyThere: boolean, identifierAndBracketAfterCursor: string, 
        rangeToReplace: monaco.IRange, methodContext: Method, onlyStatic?: false): monaco.languages.CompletionItem[] {

        let itemList: monaco.languages.CompletionItem[] = [];

        for (let field of this.getFields().filter(f => f.visibility <= visibilityUpTo && (f.isStatic || !onlyStatic))) {
            itemList.push({
                label: field.toString(),
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: field.identifier,
                range: rangeToReplace,
                documentation: field.documentation == null ? undefined : {
                    value: typeof field.documentation == "string" ? field.documentation : field.documentation()
                }
            });
        }

        for (let method of this.getAllMethods().filter( m => (m.classEnumInterface == this || m.visibility != TokenType.keywordPrivate) && (m.isStatic || !onlyStatic))) {

            itemList.push({
                label: method.getCompletionLabel(),
                filterText: method.identifier,
                command: {
                    id: "editor.action.triggerParameterHints",
                    title: '123',
                    arguments: []
                },
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: method.getCompletionSnippet(leftBracketAlreadyThere),
                range: rangeToReplace,
                detail: method.returnParameterType ? method.returnParameterType.getDeclaration() : "void",
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: method.documentation == null ? undefined : {
                    value: typeof method.documentation == "string" ? method.documentation : method.documentation()
                }
            });
        }

        return itemList;


    }


}

