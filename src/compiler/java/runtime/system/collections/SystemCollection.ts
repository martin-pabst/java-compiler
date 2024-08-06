import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { ObjectClass, ObjectClassOrNull } from "../javalang/ObjectClassStringClass.ts";
import { ComparatorInterface } from "./ComparatorInterface.ts";

export abstract class SystemCollection extends ObjectClass {

    abstract getAllElements(): ObjectClassOrNull[];

    static shuffle(list: SystemCollection){
        let elements = list.getAllElements();
        let length = elements.length;
        for(let i = 0; i < length * 2; i++){
            let index1 = Math.floor(Math.random()*length);
            let index2 = Math.floor(Math.random()*length);
            let z = elements[index1];
            elements[index1] = elements[index2];
            elements[index2] = z;
        }                
        return;
    }

    static sortWithComparator(t: Thread, callback: CallbackFunction, comparator: ComparatorInterface, list: SystemCollection) {

        let elements = list.getAllElements();

        if (elements.length <= 1) {
            if (callback) callback(); // nothing to do
        } else {
            SystemCollection.quicksort(t, callback, comparator, 0, elements.length - 1, elements);
        }
    }

    static quicksort(t: Thread, callback: CallbackFunction, comparator: ComparatorInterface, fromIndex: number, toIndex: number, elements: ObjectClassOrNull[]) {
        let that = this;

        if (toIndex - fromIndex <= 1) {
            if (callback) callback(); // nothing to do
            return;
        }

        SystemCollection.partition(t, () => {

            let partitionIndex: number = t.s.pop();
            SystemCollection.quicksort(t, () => {
                SystemCollection.quicksort(t, () => {
                    if (callback) callback();
                    return;
                }, comparator, partitionIndex + 1, toIndex, elements);
            }, comparator, fromIndex, partitionIndex - 1, elements);


        }, comparator, fromIndex, toIndex, elements);

    }

    private static partition(t: Thread, callback: () => void, comparator: ComparatorInterface, begin: number, end: number, elements: ObjectClassOrNull[]) {

        let pivot: ObjectClassOrNull = elements[end];
        let i: number = begin - 1;

        let j = begin;
        let loop = () => {
            if (j < end) {
                comparator._mj$compare$int$T$T(t, () => {
                    if (t.s.pop() <= 0) {
                        i++;

                        let z = elements[i];
                        elements[i] = elements[j];
                        elements[j] = z;
                        j++;
                        loop();
                    } else {
                        j++;
                        loop();
                    }
                }, elements[j], pivot);
            } else {
                // after for-loop
                let z = elements[i + 1];
                elements[i + 1] = elements[end];
                elements[end] = z;
                t.s.push(i + 1);
                callback();
                return;
            }
        }

        loop();


    }



}