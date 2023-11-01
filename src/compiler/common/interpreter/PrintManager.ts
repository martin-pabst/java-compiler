export interface PrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void;
}