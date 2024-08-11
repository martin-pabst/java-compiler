import { CallbackFunction } from "../../../../common/interpreter/StepFunction";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { Vector2Class } from "../../system/additional/Vector2Class";
import { NullPointerExceptionClass } from "../../system/javalang/NullPointerExceptionClass";
import { ObjectClass, StringClass } from "../../system/javalang/ObjectClassStringClass";

export class Vector3Class extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Vector3 extends Object", comment: JRC.Vector3ClassComment },

        { type: "field", signature: "public double x", comment: JRC.Vector3XComment },
        { type: "field", signature: "public double y", comment: JRC.Vector3YComment },
        { type: "field", signature: "public double z", comment: JRC.Vector3YComment },

        { type: "method", signature: "Vector3(double x, double y, double z)", native: Vector3Class.prototype._constructor2, comment: JRC.Vector3ConstructorComment },
        { type: "method", signature: "Vector3(Vector2 xy, double z)", native: Vector3Class.prototype._constructor2xy, comment: JRC.Vector3ConstructorComment },
        { type: "method", signature: "Vector3(double x, Vector2 yz)", native: Vector3Class.prototype._constructor2yz, comment: JRC.Vector3ConstructorComment },

        { type: "method", signature: "final double getLength()", native: Vector3Class.prototype._getLength, comment: JRC.Vector3GetLengthComment },
        { type: "method", signature: "final Vector3 getUnitVector()", native: Vector3Class.prototype._getUnitVector, comment: JRC.Vector3GetUnitVectorComment },
        { type: "method", signature: "final Vector2 xy()", native: Vector3Class.prototype._xy },
        { type: "method", signature: "final Vector2 xz()", native: Vector3Class.prototype._xz },
        { type: "method", signature: "final Vector2 yz()", native: Vector3Class.prototype._yz },
        { type: "method", signature: "final Vector3 setLength(double newLength)", native: Vector3Class.prototype._setLength, comment: JRC.Vector3SetLengthComment },
        { type: "method", signature: "final Vector3 scaledBy(double factor)", native: Vector3Class.prototype._scaledBy, comment: JRC.Vector3ScaledByComment },
        { type: "method", signature: "final Vector3 scale(double factor)", native: Vector3Class.prototype._scale, comment: JRC.Vector3ScaleComment },
        { type: "method", signature: "final Vector3 plus(Vector3 otherVector)", native: Vector3Class.prototype._plus, comment: JRC.Vector3PlusComment },
        { type: "method", signature: "final Vector3 minus(Vector3 otherVector)", native: Vector3Class.prototype._minus, comment: JRC.Vector3MinusComment },
        { type: "method", signature: "final Vector3 add(Vector3 otherVector)", native: Vector3Class.prototype._add, comment: JRC.Vector3AddComment },
        { type: "method", signature: "final Vector3 sub(Vector3 otherVector)", native: Vector3Class.prototype._sub, comment: JRC.Vector3SubComment },
        { type: "method", signature: "final double scalarProduct(Vector3 otherVector)", native: Vector3Class.prototype._scalarProduct, comment: JRC.Vector3ScalarProductComment },
        { type: "method", signature: "final double distanceTo(Vector3 otherVector)", native: Vector3Class.prototype._distanceTo, comment: JRC.Vector3DistanceToComment },
        { type: "method", signature: "final static double distance(double x1, double y1, double z1, double x2, double y2, double z2)", native: Vector3Class._distance, comment: JRC.Vector3DistanceComment },

        { type: "method", signature: "public boolean equals(Vector3 otherVector)", native: Vector3Class.prototype._equals , comment: JRC.objectEqualsComment},
        { type: "method", signature: "String toString()", java: Vector3Class.prototype._mj$toString$String$, comment: JRC.Vector3ToStringComment },
    ];

    static type: NonPrimitiveType;

    constructor(public x: number, public y: number, public z:number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    _constructor2(x: number, y: number,z:number) {
        this.x = x;
        this.y = y;
        this.z=z;
        return this;
    }
    _constructor2xy(xy:Vector2Class,z:number) {
        if(xy===null){
            throw new NullPointerExceptionClass(JRC.Vector3xyNullPointerComment("xy"))
        }
        this.x = xy.x;
        this.y = xy.y;
        this.z=z;
        return this;
    }
    _constructor2yz(x:number,yz:Vector2Class) {
        if(yz===null){
            throw new NullPointerExceptionClass(JRC.Vector3xyNullPointerComment("yz"))
        }
        this.x=x;
        this.y = yz.x;
        this.z = yz.y;
        return this;
    }

    _equals(other: Vector3Class): boolean {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)+ Math.abs(this.z - other.z) < 1e-14;
    }

    _plus(other: Vector3Class) {
        return new Vector3Class(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    _minus(other: Vector3Class) {
        return new Vector3Class(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    _getLength() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    _getUnitVector(){
        let length2 = this.x * this.x + this.y * this.y + this.z * this.z;
        if(length2 < 1e-14) return new Vector3Class(0, 0,0);
        
        let length: number = Math.sqrt(length2);

        return new Vector3Class(this.x/length, this.y/length, this.z/length);

    }

    _xy():Vector2Class{
        return new Vector2Class(this.x,this.y);
    }
    _xz():Vector2Class{
        return new Vector2Class(this.x,this.z);
    }
    _yz():Vector2Class{
        return new Vector2Class(this.y,this.z);
    }

    _setLength(newLength: number): Vector3Class {
        let oldLength = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        if(oldLength > 0){
            let factor = newLength/oldLength;
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;
        }
        return this;
    }

    _add(other: Vector3Class): Vector3Class {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    _sub(other: Vector3Class): Vector3Class {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    _scalarProduct(other: Vector3Class): number {
        return this.x*other.x + this.y*other.y + this.z*other.z;
    }

    _scaledBy(factor: number): Vector3Class {
        return new Vector3Class(this.x*factor, this.y*factor, this.z*factor);
    }

    _scale(factor: number): Vector3Class {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    }

    _distanceTo(other: Vector3Class): number {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let dz = other.z - this.z;
        return Math.sqrt(dx*dx + dy*dy+ dz*dz);
    }

    static _distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let dz = z2 - z1;
        return Math.sqrt(dx*dx + dy*dy+ dz*dz);
    }

    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        t.s.push(new StringClass("(" + this.x + ", " + this.y + ", " + this.z + ")"));
        if (callback) callback();
    }

    _debugOutput(): string {
        return `{x = ${this.x}, y = ${this.y}, z = ${this.z}}`;
    }



}