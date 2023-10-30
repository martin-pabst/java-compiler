export class FunctionTemplate {
    
    static identity: FunctionTemplate = new FunctionTemplate('$1');

    constructor(private template: string){

    }

    static getNewObjectTemplate(classIdentifier: string, parameters: string){
        return new FunctionTemplate(`new h[0]["${classIdentifier}"](${parameters})`);
    }
}