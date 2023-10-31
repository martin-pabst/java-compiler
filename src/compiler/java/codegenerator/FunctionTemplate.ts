
export class FunctionTemplate {

    static identity: FunctionTemplate = new FunctionTemplate('$1', '$1');
    variables: string[];

    constructor(public template: string, ...variables: string[]) {
        this.variables = variables;
    }

    apply(values: string[]): string {
        let s: string = this.template;
        for (let i = 0; i < this.variables.length; i++) {
            var regex = new RegExp(this.variables[i], 'g');
            s = s.replace(regex, values[i]);
        }
        return s;
    }


}