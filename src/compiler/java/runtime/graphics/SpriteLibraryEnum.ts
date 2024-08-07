import { Klass } from '../../../common/interpreter/StepFunction';
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

    static addEntry(name: string){

        let value = new SpriteLibraryEnum(name, SpriteLibraryEnum.values.length);
        this.values.push(value);

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
    
}

