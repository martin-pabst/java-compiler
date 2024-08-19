import { InterpreterMessages } from "../../../common/language/InterpreterMessages";
import { MethodOfDestroyedGOExceptionClass } from "../system/javalang/MethodOfDestroyedGOExceptionClass";

export class ContainerProxy {

    public static instance: any = this.getInstance();

    private constructor(){

    }

    private static getInstance(){
        const handler = {
            get(target, prop, receiver) {
                
                throw new MethodOfDestroyedGOExceptionClass(InterpreterMessages.MethodOfDestroyedGraphicObjectCalled());
                
                // return function (...args) {
                //     // console.log(`Intercepted '${prop}' with arguments ${JSON.stringify(args)}`);
                //     // target.callMethod(prop);
                // };
            }
        };

        return new Proxy({}, handler);

    }
}