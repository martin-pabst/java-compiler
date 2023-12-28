import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaModuleManager } from "../module/JavaModuleManager";
import { JavaClass } from "../types/JavaClass";
import { JavaInterface } from "../types/JavaInterface";

type ClassOrInterface = JavaClass | JavaInterface;

export class CycleFinder {

    static findCycle(moduleManager: JavaModuleManager): boolean {
        for(let npt of moduleManager.typestore.getNonPrimitiveTypes()){
            
            if(npt instanceof JavaClass){
                let cycle = CycleFinder.classHelper(npt, []);
                if(cycle){
                    CycleFinder.reportError(cycle, "extends");
                    return true;
                }
            }

            if(npt instanceof JavaInterface){
                let cycle = CycleFinder.interfaceHelper(npt, []);
                if(cycle){
                    CycleFinder.reportError(cycle, "implements");
                    return true;
                }
            }

        }
        return false;
    }

    private static reportError(cycle: ClassOrInterface[], extendsImplements: "extends" | "implements"){
        cycle.push(cycle[0]);

        let message: string = `In der Vererbungshierarchie gibt es einen Zyklus: ${cycle.map(type => type.identifier).join(" " + extendsImplements + " ")}. Daher kann nicht weiterkompiliert werden.`;
        for(let type of cycle){
            let module = type.module;
            if(module instanceof JavaBaseModule){
                module.errors.push({
                    message: message,
                    level: "error",
                    range: type.identifierRange
                })
            }
        }
    }

    private static classHelper(klass: JavaClass, alreadyVisited: ClassOrInterface[]): ClassOrInterface[] | undefined {

        // cycle? -> return it!
        if (alreadyVisited.includes(klass)) {
            return alreadyVisited;
        }

        alreadyVisited.push(klass);

        if (klass.getExtends()) {
            let ret = this.classHelper(<JavaClass>klass.getExtends(), alreadyVisited);
            if (ret) return ret; // cycle found!
        }

        alreadyVisited.pop();
    }

    private static interfaceHelper(intf: JavaInterface, alreadyVisited: ClassOrInterface[]): ClassOrInterface[] | undefined {

        // cycle? -> return it!
        if (alreadyVisited.includes(intf)) {
            return alreadyVisited;
        }

        alreadyVisited.push(intf);

        for (let extendedIntf of intf.getExtends()) {
            let ret = this.interfaceHelper(<JavaInterface>extendedIntf, alreadyVisited);
            if (ret) return ret; // cycle found!
        }

        alreadyVisited.pop();
    }



}