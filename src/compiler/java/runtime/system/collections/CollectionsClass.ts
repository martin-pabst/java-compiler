import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../javalang/ObjectClassStringClass";
import { ComparableInterface } from "./ComparableInterface";
import { ComparatorInterface } from "./ComparatorInterface";
import { ListInterface } from "./ListInterface";
import { SystemCollection } from "./SystemCollection";

export class CollectionsClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Collections extends Object", comment: JRC.CollectionsClassComment},
        { type: "method", signature: "static void shuffle(List<?> list)", java: CollectionsClass.shuffle, comment: JRC.CollectionsShuffleComment},
        { type: "method", signature: "static <T extends Comparable> void sort(List<T> list)", java: CollectionsClass.sortComparableList, comment: JRC.CollectionsSortComparableListComment},
        { type: "method", signature: "static <T> void sort(List<T> list, Comparator<? super T> comparator)", java: CollectionsClass.sortComparableList, comment: JRC.CollectionsSortComparableListComment},
    ];

    static type: NonPrimitiveType;

    static shuffle(t: Thread, callback: CallbackFunction, list: ListInterface){

        if(list instanceof SystemCollection){
            SystemCollection.shuffle(list);
            if(callback) callback();
        }

        list._mj$size$int$(t, () => {
            let size = t.s.pop();
            let shuffleCount: number = size * 2;
            
            let f = () => {
                if(shuffleCount > 0){
                    let index1 = Math.floor(Math.random()*size);
                    let index2 = Math.floor(Math.random()*size);
                    
                    list._mj$get$E$int(t, () => {
                        let w1 = t.s.pop();

                        list._mj$get$E$int(t, () => {
                            let w2 = t.s.pop();
                            
                            list._mj$set$E$int$E(t, () => {
                                list._mj$set$E$int$E(t, () => {
                                    
                                    f();
                                
                                }, index2, w1);
    
                            }, index1, w2);

                        }, index2);
    
                    }, index1);

                } else {
                    if(callback) callback();
                }
            }

            if(size > 1) f();

        })
    }

    static sortListWithComparator(t: Thread, callback: CallbackFunction, list: ListInterface, comparator: ComparatorInterface){
        
        if(list instanceof SystemCollection){
            SystemCollection.sortWithComparator(t, callback, comparator, list);
            return;
        }

        list._mj$sort$void$Comparator(t, callback, comparator);

    }


    static sortComparableList(t: Thread, callback: CallbackFunction, list: ListInterface){

        let comparator: ComparatorInterface = {
            _mj$compare$int$T$T: function (t: Thread, callback: CallbackFunction, object1: ObjectClass, object2: ObjectClass): void {
                if(object1 == null){
                    t.s.push(1);
                    if(callback) callback();
                    return;
                }
                
                if(object2 == null){
                    t.s.push(-1);
                    if(callback) callback();
                    return;
                }

                (<ComparableInterface><any>object1)._mj$compareTo$int$T(t, callback, object2);
                return;
            }
        }

        CollectionsClass.sortListWithComparator(t, callback, list, comparator);
        
    }


}