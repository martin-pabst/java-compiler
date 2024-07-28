import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ConsumerInterface } from "../functional/ConsumerInterface.ts";
import { FunctionInterface } from "../functional/FunctionInterface.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";
import { ObjectClass, StringClass } from "../javalang/ObjectClassStringClass.ts";

export class OptionalClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Optional<T>" , comment: JRC.optionalClassComment},
        { type: "method", signature: "private Optional()", java: OptionalClass.prototype._jconstructor},

        {type: "method", signature: "public static Optional<T> empty()", java: OptionalClass._mj$empty$Optional$ , comment: JRC.optionalEmptyComment},
        {type: "method", signature: "public boolean equals(Object o)", java: OptionalClass.prototype._mj$equals$boolean$Object , comment: JRC.optionalEqualsComment},
        {type: "method", signature: "public boolean isEmpty()", java: OptionalClass.prototype._mj$isEmpty$boolean$ , comment: JRC.optionalIsEmptyComment},
        {type: "method", signature: "public <U> Optional<U> map(Function<T,U> f)", java: OptionalClass.prototype._mj$map$Optional$Function , comment: JRC.optionalMapComment},
        {type: "method", signature: "public <U> Optional<U> flatMap(Function<T,Optional<U>> f)", java: OptionalClass.prototype._mj$flatMap$Optional$Function , comment: JRC.optionalFlatMapComment},
        {type: "method", signature: "public static Optional<T> of(T t)", java: OptionalClass._mj$of$Optional$T , comment: JRC.optionalOfComment},
        {type: "method", signature: "public T orElse(T t)", java: OptionalClass.prototype._mj$orElse$T$T , comment: JRC.optionalOrElseComment},
        {type: "method", signature: "public void ifPresent(Consumer<? super T> c)", java: OptionalClass.prototype._mj$ifPresent$void$Consumer , comment: JRC.optionalIfPresentComment},
        {type: "method", signature: "public String toString()", java: OptionalClass.prototype._mj$toString$String$ , comment: JRC.optionalToStringComment},

    ]

    static type: NonPrimitiveType;

    element: ObjectClass | undefined;

    _jconstructor(t : Thread, element: ObjectClass | undefined) {
        t.s.push(this);
        this.element = element;
    }


    static _mj$empty$Optional$(t: Thread){
        let emptyOptional = new OptionalClass();
        emptyOptional._jconstructor(t, undefined);
    }
    
    static _mj$of$Optional$T(t: Thread, element: ObjectClass){
        let justElement = new OptionalClass();
        justElement._jconstructor(t, element);
    }

    _mj$isEmpty$boolean$(t: Thread){
        t.s.push(this.element==undefined);
    }

    _mj$equals$boolean$Object(t: Thread, callback: CallbackFunction, o: ObjectClass) {
        if (! (o instanceof ObjectClass)) {
            t.s.push(false);
            return;
        }
        let otherOptional = <OptionalClass> o;
        if(this.element==undefined) {
            t.s.push(otherOptional.element == undefined);
            return;
        } 
        else {
            if(otherOptional.element == undefined) {
                t.s.push(false);
            }
            else {
                t.s.push(this.element._mj$equals$boolean$Object(otherOptional.element));
            }
        }  
    }

    _mj$map$Optional$Function(t: Thread, callback: CallbackFunction, f: FunctionInterface){
        let result = new OptionalClass();
        if (this.element) {
             f._mj$apply$F$E(t,() => {
                result.element = t.s.pop();
                t.s.push(result);
                }
            ,this.element);
        }
        else {
            t.s.push(result);
        }
    }

    _mj$flatMap$Optional$Function(t: Thread, callback: CallbackFunction, f: FunctionInterface){
        let result = new OptionalClass();
        if (this.element) {
             f._mj$apply$F$E(t,() => {
                // do nothing
                t.s.push(t.s.pop());
                }
            ,this.element);
        }
        else {
            t.s.push(result);
        }
    }

    _mj$orElse$T$T(t: Thread, callback: CallbackFunction, elseObject: ObjectClass) {
        let result = (this.element == undefined) ? elseObject : this.element;
        t.s.push(result);
    }

    _mj$ifPresent$void$Consumer(t: Thread, callback: CallbackFunction, consumer: ConsumerInterface) {
        if (this.element) {
            consumer._mj$accept$void$T(t, callback, this.element);
        }
    }

    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        let s = "Nothing";
        if(this.element) {
            let content = this.element._nToString().value;
            s = `Just ${content}`;
        }
        t.s.push(new StringClass(s));
    }

}
