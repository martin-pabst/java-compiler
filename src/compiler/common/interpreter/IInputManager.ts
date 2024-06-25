export type InputManagerValidator = (value: string) => {
    convertedValue: any,
    errorMessage: string | undefined
}

export type InputManagerCallback = (value: any) => void;

export interface IInputManager {
    readInput(question: string, defaultValue: string | undefined, validator: InputManagerValidator, successCallback: InputManagerCallback): void;
}

