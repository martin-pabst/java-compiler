import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass.ts";
import { ShapeClass } from "../ShapeClass.ts";
import { LineElement, TurtleClass } from "../TurtleClass.ts";
import { GNGBaseFigur, GNGPoint } from "./GNGBaseFigur.ts";
import { GNGFarben } from "./GNGFarben.ts";
import { GNGFigur } from "./GNGFigur.ts";
import { IGNGEventListener } from "./IGNGEventListener.ts";

export class GNGTurtle extends ObjectClass implements IGNGEventListener {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class GTurtle extends Object", comment: "Turtle-Klasse der Graphics'n Games-Bibliothek (Cornelsen-Verlag)" },

        { type: "field", signature: "protected int x", template: `§1.moveAnchor.x`, comment: "x-Position des Grafikobjekts" },
        { type: "field", signature: "protected int y", template: `§1.moveAnchor.y`, comment: "y-Position des Grafikobjekts" },
        { type: "field", signature: "protected int winkel", template: `Math.round(§1.angle)`, comment: "Blickrichtung des Grafikobjekts in Grad" },
        { type: "field", signature: "protected int größe", template: `§1.width`, comment: "Größe des Grafikobjekts (100 entspricht 'normalgroß')" },
        { type: "field", signature: "protected boolean sichtbar", template: `§1.turtle.container.visible`, comment: "true, wenn das Grafikobjekt sichtbar ist" },
        { type: "field", signature: "protected boolean stiftUnten", template: `§1.turtle.container.stiftUnten`, comment: "true, wenn die Turtle beim Gehen zeichnet" },

        { type: "method", signature: "GTurtle()", java: GNGTurtle.prototype._cj$_constructor_$GTurtle$, comment: "Instanziert ein neues Turtle-Objekt." },
        { type: "method", signature: "void GrößeSetzen(int größe)", native: GNGTurtle.prototype._groesseSetzen, comment: "Setzt die Größe des Turtle-Dreiecks." },
        { type: "method", signature: "void FarbeSetzen(string farbe)", native: GNGTurtle.prototype._farbeSetzen, comment: "Setzt die Zeichenfarbe des Turtle-Dreiecks." },
        { type: "method", signature: "void Drehen(int winkelInGrad)", template: `§1.turtle._turn(§2)`, comment: "Dreht die Turtle um den angegebenen Winkel. Positiver Winkel bedeutet Drehung gegen den Uhrzeigersinn." },
        { type: "method", signature: "void Gehen(double länge)", template: `§1.turtle._forward(§2)`, comment: "Bewirkt, dass die Turtle um die angegebene Länge nach vorne geht." },
        { type: "method", signature: "void StiftHeben()", template: `§1.turtle.penIsDown = false;`, comment: "Bewirkt, dass die Turtle beim Gehen ab jetzt nicht mehr zeichnet." },
        { type: "method", signature: "void StiftSenken()", template: `§1.turtle.penIsDown = true;`, comment: "Bewirkt, dass die Turtle beim Gehen ab jetzt wieder zeichnet." },
        { type: "method", signature: "void Löschen()", template: `§1.turtle._clear(100, 200, 0)`, comment: "Löscht alles von der Turtle gezeichnete und versetzt die Turtle in den Ausgangszustand." },
        { type: "method", signature: "void PositionSetzen(int x, int y)", template: `§1.turtle._moveTo(§2, §3)`, comment: "Verschiebt die Turtle an die Position (x, y) ohne eine neue Linie zu zeichnen." },
        { type: "method", signature: "void ZumStartpunktGehen()", template: `§1.turtle._moveTo(100, 200)`, comment: "Verschiebt die Turtle an die Position (100, 200) ohne eine neue Linie zu zeichnen." },
        { type: "method", signature: "void WinkelSetzen(int winkelInGrad)", template: `§1.turtle._setAngle(§2)`, comment: "Setzt den Blickwinkel der Turtle. 0° => nach rechts, 90°: => nach oben, usw.." },
        { type: "method", signature: "int WinkelGeben()", template: `(-§1.turtle.turtleAngleDeg)`, comment: "Gibt den Blickwinkel der Turtle zurück." },
        { type: "method", signature: "int XPositionGeben()", template: `(§1.turtle.getPosition().x)`, comment: "Gibt x-Position der Turtle zurück." },
        { type: "method", signature: "int YPositionGeben()", template: `(§1.turtle.getPosition().y)`, comment: "Gibt y-Position der Turtle zurück." },
        { type: "method", signature: "void SichtbarkeitSetzen(boolean sichtbarkeit)", template: `§1.turtle._setVisible(§2)`, comment: "Schaltet die Sichtbarkeit der Figur ein oder aus." },
        { type: "method", signature: "void Entfernen()", template: `§1.turtle.destroy()`, comment: "Entfernt die Figur von der Zeichenfläche." },

        {type: "method", signature: "void GanzNachVornBringen()", native: GNGTurtle.prototype._ganzNachVornBringen, comment: "Setzt das Grafikobjekt vor alle anderen."},
        {type: "method", signature: "void GanzNachHintenBringen()", native: GNGTurtle.prototype._ganzNachHintenBringen, comment: "Setzt das Grafikobjekt hinter alle anderen."},
        {type: "method", signature: "void NachVornBringen()", native: GNGTurtle.prototype._nachVornBringen, comment: "Setzt das Grafikobjekt eine Ebene nach vorne."},
        {type: "method", signature: "void NachHintenBringen()", native: GNGTurtle.prototype._nachHintenBringen, comment: "Setzt das Grafikobjekt eine Ebene nach hinten."},
        
        {type: "method", signature: "boolean Berührt()", template: `§1.turtle.touchesAtLeastOneFigure()`, comment: "Gibt genau dann true zurück, wenn sich an der aktuellen Position der Turtle mindestens eine andere Figur befindet."},
        {type: "method", signature: "boolean Berührt(String farbe)", template: `§1.touchesShape()`, comment: "Gibt genau dann true zurück, wenn sich an der aktuellen Position der Turtle mindestens eine andere Figur mit der angegebenen Farbe befindet."},
        {type: "method", signature: "boolean Berührt(Object object)", template: `§1.touchesColor()`, comment: "Gibt genau dann true zurück, wenn die übergebene Figur die aktuelle Turtleposition enthält."},

        { type: "method", signature: "void AktionAusführen()", java: GNGTurtle.prototype._mj$AktionAusführen$void$, comment: "Diese Methode wird vom Taktgeber aufgerufen." },
        { type: "method", signature: "void TasteGedrückt(char taste)", java: GNGTurtle.prototype._mj$TasteGedrückt$void$char, comment: "Wird aufgerufen, wenn eine Taste gedrückt wird." },
        { type: "method", signature: "void SonderTasteGedrückt(int sondertaste)", java: GNGTurtle.prototype._mj$SondertasteGedrückt$void$int, comment: "Wird aufgerufen, wenn eine SonderTaste gedrückt wird." },
        { type: "method", signature: "void MausGeklickt(int x, int y, int anzahl)", java: GNGTurtle.prototype._mj$MausGeklickt$void$int$int$int, comment: "Wird aufgerufen, wenn eine die linke Maustaste gedrückt wird." },


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
            this.turtle._setBorderColorInt(0x000000);
            this.turtle.render();

            this.moveAnchor = {x: 10, y: 10};

            this.setGNGBackgroundColor();

            if (callback) callback();
        }, 100, 200);

        if(this._mj$AktionAusführen$void$ != GNGTurtle.prototype._mj$AktionAusführen$void$){
            this.turtle.world.registerGNGEventListener(this, "aktionAusführen");
        }

        if(this._mj$TasteGedrückt$void$char != GNGTurtle.prototype._mj$TasteGedrückt$void$char){
            this.turtle.world.registerGNGEventListener(this, "tasteGedrückt");
        }

        if(this._mj$SondertasteGedrückt$void$int != GNGTurtle.prototype._mj$SondertasteGedrückt$void$int){
            this.turtle.world.registerGNGEventListener(this, "sondertasteGedrückt");
        }

        if(this._mj$MausGeklickt$void$int$int$int != GNGTurtle.prototype._mj$MausGeklickt$void$int$int$int){
            this.turtle.world.registerGNGEventListener(this, "mausGeklickt");
        }

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

    _ganzNachVornBringen(){
        this.turtle.bringToFront();
    }

    _ganzNachHintenBringen(){
        this.turtle.sendToBack();
    }

    _nachVornBringen(){
        this.turtle.bringOnePlaneFurtherToFront();
    }

    _nachHintenBringen(){
        this.turtle.bringOnePlaneFurtherToBack();
    }

    touchesShape(object: any) {
        let lastLineElement = this.turtle.lineElements[this.turtle.lineElements.length - 1];
        let x = lastLineElement.x;
        let y = lastLineElement.y;
        if(object instanceof ShapeClass || object instanceof GNGBaseFigur || object instanceof GNGFigur || object instanceof GNGTurtle) return object._containsPoint(x, y);

        return false;
    }


        // Eventlistener-dummies:
        _mj$AktionAusführen$void$(t: Thread, callback: () => void | undefined): void {
            throw new Error("Method not implemented.");
        }
        _mj$TasteGedrückt$void$char(t: Thread, callback: () => void | undefined, key: string): void {
            throw new Error("Method not implemented.");
        }
        _mj$SondertasteGedrückt$void$int(t: Thread, callback: () => void | undefined, key: number): void {
            throw new Error("Method not implemented.");
        }
        _mj$MausGeklickt$void$int$int$int(t: Thread, callback: () => void | undefined, x: number, y: number, anzahl: number): void {
            throw new Error("Method not implemented.");
        }
    
        _mj$TaktImpulsAusführen$void$(t: Thread, callback: (() => void) | undefined): void {
            throw new Error("Method not implemented.");
        }
    
        _mj$Ausführen$void$(t: Thread, callback: (() => void) | undefined): void {
            throw new Error("Method not implemented.");
        }
        _mj$Taste$void$char(t: Thread, callback: (() => void) | undefined, key: string): void {
            throw new Error("Method not implemented.");
        }
        _mj$SonderTaste$void$int(t: Thread, callback: (() => void) | undefined, key: number): void {
            throw new Error("Method not implemented.");
        }
        _mj$Geklickt$void$int$int$int(t: Thread, callback: (() => void) | undefined, x: number, y: number, anzahl: number): void {
            throw new Error("Method not implemented.");
        }
    
        _containsPoint(x: number, y: number){
            return this.turtle._containsPoint(x, y);
        }
}