import { BaseType } from "../../../common/BaseType";

export type ReplReturnValue = {
    value: any,
    text: string,
    type: BaseType | undefined
} | undefined;
