import { le, lm } from "../../tools/language/LanguageManager"

/**
 * Java compiler's messages
 */
export class JRC {

    /**
     * Class Shape
     */

    static shapeClassComment = () => lm({
        "de": "Die Klasse Shape ist Oberklasse aller graphischen Objekte.",
        "en": "Class Shape is base class of all graphical objects.",
    })

    static shapeMoveComment = () => lm({
        "de": "Verschiebt das Grafikobjekt um dx Pixel nach rechts und um dy Pixel nach unten.",
        "en": "Moves object dx pixels to the right and dy pixels down ",
    })

    static shapeRotateComment1 = () => lm({
        "de": "Dreht das Grafikobjekt um den angegebenen Winkel (in Grad!). Drehpunkt ist (centerX, centerY).",
        "en": "Rotates object by given angle (in degrees!). Center of rotation is (centerX, centerY)",
    })

    static shapeRotateComment2 = () => lm({
        "de": "Dreht das Grafikobjekt um den angegebenen Winkel (in Grad!). Der Drehpunkt ist die 'Mitte' des Objekts (abhängig von seiner Form).",
        "en": "Rotates object by given angle (in degrees!). Pivot point is 'center' of object (depends on it's shape).",
    })

    static shapeScaleComment1 = () => lm({
        "de": "Streckt das Grafikobjekt um den angegebenen Faktor. Das Zentrum der Streckung ist der Punkt (centerX, centerY)",
        "en": "Scales object by given factor. Center of scaling is at (centerX, centerY).",
    })

    static shapeScaleComment2 = () => lm({
        "de": "Streckt das Grafikobjekt um den angegebenen Faktor. Das Zentrum der Streckung ist die 'Mitte' des Objekts (abhängig von seiner Form).",
        "en": "Scales object by given factor. Center of scaling is 'center' of object (depends on it's shape).",
    })

    static shapeMirrorXComment = () => lm({
    "de": "Spiegelt das Objekt in X-Richtung",
    "en": "Mirrors object in x-direction",
    })

    static shapeMirrorYComment = () => lm({
    "de": "Spiegelt das Objekt in Y-Richtung",
    "en": "Mirrors object in y-direction",
    })

    static shapeOutsideViewComment = () => lm({
    "de": "Gibt genau dann true zurück, wenn sich die Bounding Box des Objekts außerhalb des sichtbaren Bereichs befindet.",
    "en": "Returns true if and only if bounding box of object is outside world boundaries.",
    })

    static shapeDefineDirectionComment = () => lm({
    "de": "Setzt die Blickrichtung des graphischen Objekts. Dies ist die Richtung, in die es durch Aufruf der Methode forward bewegt wird. \nBemerkung: die Methode rotate ändert auch die Blickrichtung!",
    "en": "Defines direction of object. Direction is used when calling method 'forward'.",
    })

    static shapeForwardComment = () => lm({
    "de": "Bewegt das Objekt um die angegebene Länge in Richtung seiner Blickrichtung.\nBemerkung: Die Blickrichtung kann mit defineDirection gesetzt werden.",
    "en": "Moves object forward by given distance.\n Hint: Set forward direction with method 'defineDirection'.",
    })

    static shapeAngleComment = () => lm({
    "de": "Richtung des Objekts (in Grad)",
    "en": "Angle of object (in degrees)",
    })

    static shapeCenterXComment = () => lm({
    "de": "X-Koordinate des Diagonalenschnittpunkts der BoundingBox des Objekts",
    "en": "X coordinate of the diagonal intersection of the object's BoundingBox",
    })

    static shapeCenterYComment = () => lm({
    "de": "Y-Koordinate des Diagonalenschnittpunkts der BoundingBox des Objekts",
    "en": "Y coordinate of the diagonal intersection of the object's BoundingBox",
    })

    static shapeContainsPointComment = () => lm({
    "de": "Gibt genau dann true zurück, wenn die Figur den angegebenen Punkt enthält.",
    "en": "Returns true if and only if this shape contains given point.",
    })

    static shapeMoveToComment = () => lm({
    "de": "Verschiebt das Grafikobjekt so, dass sich sein 'Mittelpunkt' an den angegebenen Koordinaten befindet.",
    "en": "Moves object in a way so that it's 'center' is at (x,y).",
    })

    static shapeDefineCenterComment = () => lm({
    "de": "Setzt fest, wo der 'Mittelpunkt' des Objekts liegen soll. Dieser Punkt wird als Drehpunkt der Methode rotate, als Zentrum der Methode Scale und als Referenzpunkt der Methode moveTo benutzt.",
    "en": "Defines 'center' of object. This center is used in methods rotate, scale and moveTo.",
    })

    static shapeDefineCenterRelativeComment = () => lm({
    "de": "Setzt fest, wo der 'Mittelpunkt' des Objekts liegen soll. Dabei bedeutet (XRel/YRel) = (0/0) die linke obere Ecke der Bounding Box des Objekts, (XRel/YRel) = (1/1) die rechte untere Ecke. Defaultwert ist (XRel/YRel) = (0.5/0.5), also der Diagonalenschnittpunkt der Bounding Box. Dieser Punkt wird als Drehpunkt der Methode rotate, als Zentrum der Methode Scale und als Referenzpunkt der Methode moveTo benutzt.\n\nVORSICHT: Diese Methode arbeitet nicht mehr korrekt, wenn das Objekt schon gedreht wurde!",
    "en": "Definec center of object relative to it's bounding box. (0,0) means: center at top left oft boundingbox, (1/1) means: center at bottom right of bounding box. Beware: this method doesn't work as expected if object had been rotated.",
    })

    static shapeSetDefaultVisibilityComment = () => lm({
    "de": "Setzt den Standardwert für das Attribut 'visible'. Dieser wird nachfolgend immer dann verwendet, wenn ein neues grafisches Objekt instanziert wird.",
    "en": "Sets default value for field 'visibility' for all subsequently instantiated graphic objects.",
    })

    static shapeSetVisibleComment = () => lm({
    "de": "Macht das Grafikobjekt sichtbar (visible == true) bzw. unsichtbar (visible == false).",
    "en": "Sets graphic object visible or invisible.",
    })

    static shapeSetStaticComment = () => lm({
    "de": "setStatic(true) hat zur Folge, dass die Ansicht des Objekts durch Transformationen des World-Objekts nicht verändert wird.",
    "en": "setStatic(true) makes the object not follow subsequent transformations of world object.",
    })


    /**
     * Class Rectangle
     */
    static rectangleClassComment = () => lm({
        "de": "Ein Objekt der Klasse Rectangle zeichnet ein Rechteck in den Grafikbereich.",
        "en": "Objects of class Rectangle draw rectangles."
    })

    static rectangleEmptyConstructorComment = () => lm({
        "de": "Instanziert ein Retangle-Objekt mit Standardmaßen. Seine linke obere Ecke liegt bei (0/0). Breite und Höhe betragen jeweils 100. Die Rechteckseiten sind zunächst parallel zu den Koordinatenachsen.",
        "en": "Instantiates a rectangle object with default geometry. It's left top edge is located at (0/0). Width and height are 100 each. Initial orientation is parallel to x- and y-axis."
    })

    static rectangleConstructorComment = () => lm({
        "de": "Instanziert ein Retangle-Objekt. Seine linke obere Ecke liegt bei (top/left). Width ist seine Breite, height seine Höhe. Das Rechteck ist zunächst achsenparallel.",
        "en": "Instantiates a rectangle object with given width and height. It's left top edge is located at (top/left). Initial orientation is parallel to x- and y-axis."
    })

    static rectangleSetWidthComment = () => lm({
        "de": "setzt die Breite des Rechtecks.",
        "en": "sets width of rectangle",
    })

    static rectangleSetHeightComment = () => lm({
        "de": "setzt die Höhe des Rechtecks.",
        "en": "sets height of rectangle",
    })

    static rectangleGetWidthComment = () => lm({
        "de": "gibt die Breite des Rechtecks zurück",
        "en": "gets rectangle width",
    })

    static rectangleGetHeightComment = () => lm({
        "de": "gibt die Höhe des Rechtecks zurück",
        "en": "gets rectangle height",
    })

    static rectangleCopyComment = () => lm({
        "de": "Erstellt eine Kopie des Rectangle-Objekts und git sie zurück.",
        "en": "returns a copy of this rectangle object",
    })

    static rectangleMoveToComment = () => lm({
        "de": "Verschiebt das Grafikobjekt so, dass sich sein Diagonalenschnittpunkt an den angegebenen Koordinaten befindet.",
        "en": "Moves the graphic object so that its diagonal intersection is at the specified coordinates",
    })

    // Kürzel: mlc

}            
