import { Helpers, StepParams } from "../../../common/interpreter/StepFunction";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { DummyAssertions } from "./Assertions";

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
            template: `${Helpers.assertions}.${DummyAssertions.prototype.assertTrue.name}(${StepParams.thread}, this, §1, §2)`
        },
        {
            type: "method", signature: "public static void assertFalse(boolean condition, string message)",
            template: `${Helpers.assertions}.${DummyAssertions.prototype.assertFalse.name}(${StepParams.thread}, this, §1, §2)`
        },
        {
            type: "method", signature: "public static void assertEquals(int expected, int actual, string message)",
            template: `${Helpers.assertions}.${DummyAssertions.prototype.assertEqualsNumber.name}(${StepParams.thread}, this, §1, §2, §3)`
        },
        {
            type: "method", signature: "public static void assertEquals(string expected, string actual, string message)",
            template: `${Helpers.assertions}.${DummyAssertions.prototype.assertEqualsString.name}(${StepParams.thread}, this, §1, §2, §3)`
        },
        {
            type: "method", signature: "public static void fail(string message)",
            template: `${Helpers.assertions}.${DummyAssertions.prototype.fail.name}(${StepParams.thread}, this, §1)`
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