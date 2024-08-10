import { CallbackParameter } from "./CallbackParameter";
import { Thread } from "./Thread";

export type TextContainer = {text: string};

export class ArrayToStringCaster {

    public static arrayOfObjectsToString(textContainer: TextContainer, t: Thread, array: any[], callback?: CallbackParameter) {
        if (array == null) {
            t.s.push("null");
            if (callback) callback();
            return;
        }

        textContainer.text += "[";
        let array1 = array.slice();

        t.s.push(array1);

        let f = (callback1: CallbackParameter) => {
            let array: any[] = t.s.pop();
            if (array.length > 0) {
                let element = array.shift();
                if (element == null) {
                    textContainer.text += "null";
                    if (array.length > 0) {
                        textContainer.text += ", ";
                        t.s.push(array);
                        f(callback1);
                        return;
                    } else {
                        textContainer.text += "]";
                        if (callback1) callback1();
                        return;
                    }
                } else if (Array.isArray(element)) {
                    t.s.push(element);
                    this.arrayOfObjectsToString(textContainer, t, element, () => {
                        if (array.length > 0) {
                            textContainer.text += ", ";
                            t.s.push(array);
                            f(callback1);
                            return;
                        } else {
                            textContainer.text += "]";
                            if (callback1) callback1();
                            return;
                        }
                    })
                    return;
                } else if(typeof element == 'object') {
                    // element is object => call it's toString()-method! 
                    element._mj$toString$String$(t, () => {
                        textContainer.text += t.s.pop().value;
                        if (array.length > 0) {
                            textContainer.text += ", ";
                            t.s.push(array);
                            f(callback1);
                            return;
                        } else {
                            textContainer.text += "]";
                            if (callback1) callback1();
                            return;
                        }
                    })
                } else {
                    if(typeof element == "string"){
                        textContainer.text += '"' + element + '"';
                    } else {
                        textContainer.text += "" + element;
                    }
                    if (array.length > 0) {
                        textContainer.text += ", ";
                        t.s.push(array);
                        f(callback1);
                        return;
                    } else {
                        textContainer.text += "]";
                        if (callback1) callback1();
                        return;
                    }
                }

            }
        }

        f(() => {
            if (callback) callback();
        });

    }

    

}