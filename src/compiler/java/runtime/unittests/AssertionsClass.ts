import { Interpreter } from "../../../common/interpreter/Interpreter";
import { Helpers, StepParams } from "../../../common/interpreter/StepFunction";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { DummyAssertionObserver } from "./AssertionObserver";

/**
 * Java wrapper class to call methods from {@link AssertionHandler}-object inside {@link Interpreter.assertionObserverList}
 */
export class AssertionsClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Assertions extends Object" },

        // {type: "method", signature: "private Assertions()", native: AssertionsClass.prototype._emptyConstructor},
        {
            type: "method", signature: "public static void assertCodeReached(string message)",
            template: `${Helpers.registerCodeReached}(§1)`  // §1 gets inserted by compiler magic
        },
        {
            type: "method", signature: "public static void assertTrue(boolean condition, string message)",
            template: `for(__ao of ${Helpers.assertionObservers}){__ao.${DummyAssertionObserver.prototype.notifyOnAssertTrue.name}(${StepParams.thread}, this, §1, §2);}`
        },
        {
            type: "method", signature: "public static void assertFalse(boolean condition, string message)",
            template: `for(__ao of ${Helpers.assertionObservers}){__ao.${DummyAssertionObserver.prototype.notifyOnAssertFalse.name}(${StepParams.thread}, this, §1, §2);}`
        },
        {
            type: "method", signature: "public static void assertEquals(int expected, int actual, string message)",
            template: `for(__ao of ${Helpers.assertionObservers}){__ao.${DummyAssertionObserver.prototype.notifyOnAssertEqualsNumber.name}(${StepParams.thread}, this, §1, §2, §3);}`
        },
        {
            type: "method", signature: "public static void assertEquals(string expected, string actual, string message)",
            template: `for(__ao of ${Helpers.assertionObservers}){__ao.${DummyAssertionObserver.prototype.notifyOnAssertEqualsString.name}(${StepParams.thread}, this, §1, §2, §3);}`
        },
        {
            type: "method", signature: "public static void fail(string message)",
            template: `for(__ao of ${Helpers.assertionObservers}){__ao.${DummyAssertionObserver.prototype.notifyOnFail.name}(${StepParams.thread}, this, §1);}`
        },
    ]

    static type: NonPrimitiveType;

    constructor() {
        super();
    }

    // _emptyConstructor(){
    //     return this;
    // }

}