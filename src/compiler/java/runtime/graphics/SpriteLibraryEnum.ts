import { Klass } from '../../../common/interpreter/StepFunction.js';
import { EmptyRange } from '../../../common/range/Range';
import { TokenType } from '../../TokenType';
import { JRC } from '../../language/JavaRuntimeLibraryComments.js';
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { JavaEnum } from '../../types/JavaEnum';
import { JavaField } from '../../types/JavaField';
import { EnumClass } from '../system/javalang/EnumClass';

//@ts-ignore
import { SpriteLibrary } from "./SpriteLibrary.js";

declare var SpriteLibrary :{index: number, name: string}[];

export class SpriteLibraryEnum extends EnumClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "enum SpriteLibrary", comment: JRC.spriteLibraryComment },

    ]

    static type: JavaEnum;

    static values: SpriteLibraryEnum[] = SpriteLibraryEnum.initValues();
    static typeIdToUserSpritesheetsMap: Map<number, Map<string, SpriteLibraryEnum>> = new Map();

    constructor(name: string, index: number, isUserSpritesheet: boolean = false){
        super(name, index);
    }

    static initValues(): SpriteLibraryEnum[]{
        let i: number = 0;
        
        return SpriteLibrary.filter(
            (sle) => {
                return sle.index == null || sle.index == 0
            }
        ).map((sle) => {
            return new SpriteLibraryEnum(sle.name, i++);
        })
    }

    private static getSpritesheetsForTypeId(typeId: number): Map<string, SpriteLibraryEnum>{
        let map: Map<string, SpriteLibraryEnum> | undefined = this.typeIdToUserSpritesheetsMap.get(typeId);
        if(!map){
            map = new Map();
            this.typeIdToUserSpritesheetsMap.set(typeId, map);
        }
        return map;
    }

    static addEntry(name: string, typeId?: number){

        let value = new SpriteLibraryEnum(name, SpriteLibraryEnum.values.length);
        
        if(typeId){
            SpriteLibraryEnum.getSpritesheetsForTypeId(typeId).set(name, value);

        } else {
            this.values.push(value);
        }
        

        // if type is already constructed we have to add a appropriate attribute object:
        if(SpriteLibraryEnum.type){
            let sle: Klass = SpriteLibraryEnum;
            sle[name] = value;

            let field = new JavaField(name, EmptyRange.instance, 
                SpriteLibraryEnum.type.module, SpriteLibraryEnum.type, TokenType.keywordPublic
            );
            field._isStatic = true;
            field._isFinal = true;
            field.type = SpriteLibraryEnum.type;

            SpriteLibraryEnum.type.fields.push(field);
        } 

    }

    static removeUserSpritesheets(typeId: number){
        this.typeIdToUserSpritesheetsMap.delete(typeId);
    }
    
    static getSpriteLibrary(typeId: number, identifier: string){
        //@ts-ignore
        let v = SpriteLibraryEnum[identifier];
        if(v) return v;
        let map = this.getSpritesheetsForTypeId(typeId);
        return map.get(identifier) || null;
    }
    
}

