export interface IFilesManager {
    read(filename: string): string;
    write(filename: string, content: string): void;
    append(filename: string, content: string): void;
}