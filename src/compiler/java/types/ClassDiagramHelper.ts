import { SystemModule } from "../runtime/system/SystemModule";
import { JavaClass } from "./JavaClass";
import { JavaInterface } from "./JavaInterface";

export class ClassDiagramHelper {
    registerUsedSystemClasses(klass: JavaClass, usedSystemClasses: Set<JavaClass | JavaInterface>) {
        if(klass.getExtends() && (klass.getExtends()?.module instanceof SystemModule)){
            usedSystemClasses.add(klass.getExtends()!.getClassWithoutGenerics());
        }

        for(let intf of klass.getImplements()){
            if(intf.module instanceof SystemModule){
                usedSystemClasses.add(intf.getInterfaceWithoutGenerics());
            }
        }

        
        
    }

}