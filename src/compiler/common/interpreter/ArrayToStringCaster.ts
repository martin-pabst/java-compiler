import { CallbackParameter } from "./CallbackParameter";
import { Thread } from "./Thread";

export class ArrayToStringCaster {

    public static arrayOfObjectsToString(t: Thread, array: any[], callback?: CallbackParameter) {
        if (array == null) {
            t.s.push("null");
            if (callback) callback();
            return;
        }

        let text = "[";
        let array1 = array.slice();

        t.s.push(array1);

        let f = (callback1: CallbackParameter) => {
            let array: any[] = t.s.pop();
            if (array.length > 0) {
                let element = array.shift();
                if (element == null) {
                    text += "null";
                    if (array.length > 0) {
                        text += ", ";
                        t.s.push(array);
                        f(callback1);
                        return;
                    } else {
                        text += "]";
                        if (callback1) callback1();
                        return;
                    }
                } else if (Array.isArray(element)) {
                    t.s.push(element);
                    this.arrayOfObjectsToString(t, element, () => {
                        if (array.length > 0) {
                            text += ", ";
                            t.s.push(array);
                            f(callback1);
                            return;
                        } else {
                            text += "]";
                            if (callback1) callback1();
                            return;
                        }
                    })
                    return;
                } else {
                    // element is object => call it's toString()-method! 
                    element._mj$String$toString$(this, () => {
                        text += t.s.pop();
                        if (array.length > 0) {
                            text += ", ";
                            t.s.push(array);
                            f(callback1);
                            return;
                        } else {
                            text += "]";
                            if (callback1) callback1();
                            return;
                        }
                    })
                }

            }
        }

        f(() => {
            text += "]";
            t.s.push(text);
            if (callback) callback();
        });

    }

    

}