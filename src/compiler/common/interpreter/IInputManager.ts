export type InputManagerCallback = (value: string) => string;  // Return parameter for error message

export interface IInputManager {
    readInput(question: string, defaultValue: string, callback: InputManagerCallback): void;
}

