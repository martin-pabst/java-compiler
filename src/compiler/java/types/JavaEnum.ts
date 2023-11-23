import { UsagePosition } from "../../common/UsagePosition";
import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType.ts";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { EnumClass } from "../runtime/system/javalang/EnumClass.ts";
import { Field } from "./Field";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaClassOrEnum } from "./JavaClassOrEnum.ts";
import { JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility.ts";


export class JavaEnum extends JavaClassOrEnum {

    fields: Field[] = [];
    methods: Method[] = [];

    enclosingParent: JavaClass | undefined = undefined;

    public usagePositions: UsagePosition[] = [];

    private implements: JavaInterface[] = [];

    constructor(identifier: string, module: JavaBaseModule, identifierRange: IRange, public baseEnumClass: EnumClass) {
        super(identifier, identifierRange, module);
    }

    getField(identifier: string, uptoVisibility: Visibility, forceStatic: boolean = false): Field | undefined {
        let field = this.getFields().find(f => f.identifier == identifier && f.visibility <= uptoVisibility && (f.isStatic || !forceStatic));
        if (field) return field;
        if (uptoVisibility == TokenType.keywordPrivate) uptoVisibility = TokenType.keywordProtected;

        return this.baseEnumClass.getType().getField(identifier, uptoVisibility, forceStatic);

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

    public getMethods(): Method[] {
        return this.methods;
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

}

