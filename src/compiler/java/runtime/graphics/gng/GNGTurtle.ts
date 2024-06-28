import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass.ts";
import { TurtleClass } from "../TurtleClass.ts";
import { GNGPoint } from "./GNGBaseFigur.ts";
import { GNGFarben } from "./GNGFarben.ts";

export class GNGTurtle extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class GTurtle extends Object", comment: "Turtle-Klasse der Graphics'n Games-Bibliothek (Cornelsen-Verlag)" },

        { type: "field", signature: "protected int x", template: `§1.moveAnchor.x`, comment: "x-Position des Grafikobjekts" },
        { type: "field", signature: "protected int y", template: `§1.moveAnchor.y`, comment: "y-Position des Grafikobjekts" },
        { type: "field", signature: "protected int winkel", template: `Math.round(§1.angle)`, comment: "Blickrichtung des Grafikobjekts in Grad" },
        { type: "field", signature: "protected int größe", template: `§1.width`, comment: "Größe des Grafikobjekts (100 entspricht 'normalgroß')" },
        { type: "field", signature: "protected boolean sichtbar", template: `§1.turtle.container.visible`, comment: "true, wenn das Grafikobjekt sichtbar ist" },
        { type: "field", signature: "protected boolean stiftUnten", template: `§1.turtle.container.stiftUnten`, comment: "true, wenn die Turtle beim Gehen zeichnet" },

        { type: "method", signature: "GTurtle()", java: GNGTurtle.prototype._cj$_constructor_$GTurtle$, comment: "Instanziert ein neues Turtle-Objekt." },
        { type: "method", signature: "void GrößeSetzen(int größe)", java: GNGTurtle.prototype._groesseSetzen, comment: "Setzt die Größe des Turtle-Dreiecks." },
        { type: "method", signature: "void FarbeSetzen(string farbe)", java: GNGTurtle.prototype._farbeSetzen, comment: "Setzt die Zeichenfarbe des Turtle-Dreiecks." },
        { type: "method", signature: "void Drehen(int winkelInGrad)", template: `§1.turtle._turn(§2)`, comment: "Dreht die Turtle um den angegebenen Winkel. Positiver Winkel bedeutet Drehung gegen den Uhrzeigersinn." },
        { type: "method", signature: "void Gehen(double länge)", template: `§1.turtle._forward(§2)`, comment: "Bewirkt, dass die Turtle um die angegebene Länge nach vorne geht." },
        { type: "method", signature: "void StiftHeben()", template: `§1.turtle.penIsDown = false;`, comment: "Bewirkt, dass die Turtle beim Gehen ab jetzt nicht mehr zeichnet." },
        { type: "method", signature: "void StiftSenken()", template: `§1.turtle.penIsDown = true;`, comment: "Bewirkt, dass die Turtle beim Gehen ab jetzt wieder zeichnet." },
        { type: "method", signature: "void Löschen()", template: `§1.turtle._clear(100, 200, 0)`, comment: "Löscht alles von der Turtle gezeichnete und versetzt die Turtle in den Ausgangszustand." },
        { type: "method", signature: "void PositionSetzen(int x, int y)", template: `§1.turtle._moveTo(§2, §3)`, comment: "Verschiebt die Turtle an die Position (x, y) ohne eine neue Linie zu zeichnen." },
        { type: "method", signature: "void ZumStartpunktGehen()", template: `§1.turtle._moveTo(100, 200)`, comment: "Verschiebt die Turtle an die Position (100, 200) ohne eine neue Linie zu zeichnen." },
        { type: "method", signature: "void WinkelSetzen(int winkelInGrad)", template: `§1.turtle._turn(§2 - )`, comment: "Verschiebt die Turtle an die Position (100, 200) ohne eine neue Linie zu zeichnen." },


    ];


    turtle!: TurtleClass;

    // visible fields:
    moveAnchor: GNGPoint = { x: 0, y: 0 };
    colorString: string = "schwarz";


    _cj$_constructor_$GTurtle$(t: Thread, callback: CallableFunction) {

        this.turtle = new TurtleClass();

        this.turtle._cj$_constructor_$Turtle$double$double(t, () => {
            t.s.pop();
            t.s.push(this);

            this.turtle.borderWidth = 1;
            this.turtle.showTurtle = true;
            this.turtle.borderColor = 0x000000;

            this.turtle.render();

            this.moveAnchor = {x: 10, y: 10};

            this.setGNGBackgroundColor();

            if (callback) callback();
        }, 100, 200);



    }

    setGNGBackgroundColor() {
        if (this.turtle.world.shapesWhichBelongToNoGroup.length == 1) {
            this.turtle.world._setBackgroundColor("#e6e6e6");
        }
    }

    _groesseSetzen(groesse: number){
        this.turtle.turtleSize = groesse;
        this.turtle.borderWidth = groesse/100;
        this.turtle.moveTurtleTo(0,0, 0);
        this.turtle.initTurtle(0, 0, this.turtle.angle);
        this.turtle.moveTurtleTo(this.turtle.lineElements[this.turtle.lineElements.length - 1].x, this.turtle.lineElements[this.turtle.lineElements.length - 1].y, this.turtle.angle)
        this.turtle._turn(0);
    }

    _farbeSetzen(farbe: string){
        this.colorString = farbe;
        if(!farbe) farbe = "schwarz";
        let color: number = GNGFarben[farbe.toLocaleLowerCase()];
        this.turtle._setBorderColorInt(color);
    }


}