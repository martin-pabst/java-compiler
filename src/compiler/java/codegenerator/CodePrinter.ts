import { Program, Step } from "../../common/interpreter/Program";
import { JavaBaseModule } from "../module/JavaBaseModule";

export class CodePrinter{

    formatCode(module: JavaBaseModule): string {
        let code: string = "";
        code += this.getJavaDocHeading("Main Program:");
        code += this.printProgram(module.getMainProgram());

        return code;
    }

    printProgram(p: Program | undefined): string {
        if(!p) return "//Kein Hauptprogramm vorhanden.";
        let s = "";
        for(let i = 0; i < p.stepsSingle.length; i++){
            let step = p.stepsSingle[i];

            let catchBlockInfos = step.catchBlockInfoList ? " (with CatchBlockInfos: " + JSON.stringify(step.catchBlockInfoList) + ")" : "";
            let finallyBlockIndex = step.finallyBlockIndex ? " (finallyBlockIndex: " + step.finallyBlockIndex + ")" : "";

            s += "\n\n// Step " + step.index + catchBlockInfos + finallyBlockIndex + "\n";
            s += this.printStep(step);
        }
        return s;
    }

    printStep(step: Step): string {
        return step.codeAsString;
    }

    getJavaDocHeading(heading: string){
        let s: string = "/**\n";
        s += heading.split("\n").map(line => " * " + line).join("\n");
        s += "\n */\n";
        return s;
    }


}