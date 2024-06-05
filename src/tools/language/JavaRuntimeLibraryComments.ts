import { le, lm } from "./LanguageManager"

/**
 * Java compiler's messages
 */
export class JRC {


    /**
     * Class Object
     */
    static objectToStringComment = () => lm({
    "de": "Wandelt das Objekt in eine Zeichenkette um und liefert diese zurück.",
    "en": "Returns a String representation of this object.",
    })

    /**
     * Class World
     */

    static worldSetBackgroundColorIntComment = () => lm({
        "de": "Setzt die Hintergrundfarbe. Die Farbe wird als integer-Zahl erwartet. Am besten schreibt man sie als Hexadezimalzahl, also z.B. setBackgroundColor(0xff8080).",
        "en": "Sets world's background color. Color is coded as integer number, e.g. in hexadecimal writing (setBackgroundColor(0xff8080)).",
    })

    static worldSetBackgroundColorStringComment = () => lm({
        "de": 'Setzt die Hintergrundfarbe. Die Farbe ist entweder eine vordefinierte Farbe ("schwarz", "rot", ...) oder eine css-Farbe der Art "#ffa7b3" (ohne alpha), "#ffa7b380" (mit alpha), "rgb(172, 22, 18)" oder "rgba(123, 22,18, 0.3)',
        "en": 'Sets world\'s background color. Color is coded as predefined color ("black", "red", ...) or css color like "#ffa7b3" (ohne alpha), "#ffa7b380" (mit alpha), "rgb(172, 22, 18)" oder "rgba(123, 22,18, 0.3).',
    })

    static worldAddMouseListenerComment = () => lm({
        "de": "Fügt einen neuen MouseListener hinzu, dessen Methoden bei Mausereignissen aufgerufen werden.",
        "en": "Adds a MouseLister object. It's methods are called every time a mouse event occurs.",
    })

    static worldMoveComment = () => lm({
        "de": "Verschiebt alle Objekte der Welt um dx nach rechts und dy nach unten.\nTipp: Falls Objekte NICHT mitverschoben werden sollen, rufe die Methode setStatic(true) auf.",
        "en": "Moves all objects in this word by dx to the right and by dy down.\n Hint: If objects should NOT move with world, invoke method setStatic(true) for them.",
    })

    static worldRotateComment = () => lm({
        "de": "Rotiert die Welt um den angegebenen Winkel (in Grad!) im Urzeigersinn. Drehpunkt ist der Punkt (centerX, centerY).\nTipp: Falls Objekte NICHT mitgedreht werden sollen, rufe die Methode setStatic(true) auf.",
        "en": "Rotates world by angleInDeg clockwise.\n Hint: If objects should NOT rotate with world, invoke method setStatic(true) for them.",
    })

    static worldScaleComment = () => lm({
        "de": "Streckt die Welt um den angegebenen Faktor. Zentrum der Streckung ist (CenterX, centerY). Drehpunkt ist der Punkt (centerX, centerY).\nTipp: Falls Objekte NICHT mitgedreht werden sollen, rufe die Methode setStatic(true) auf.",
        "en": "Scales world by given factorr. Pivot of scaling is (centerX, centerY).\n Hint: If objects should NOT scale with world, invoke method setStatic(true) for them.",
    })

    static worldSetCoordinateSystemComment = () => lm({
        "de": "Setzt das Koordinatensystem der Welt so, dass (left, top) die linke obere Ecke des sichtbaren Bereiches ist, width seine Breite und height seine Höhe.",
        "en": "Sets coordinate system of world in a way so that (left, top) is top-left corner of visible view, width is it's width and height it's height.",
    })

    static worldSetCursorComment = () => lm({
        "de": "Ändert die Form des Mauscursors im gesamten Grafikbereich. Mögliche Werte: siehe https://developer.mozilla.org/en-US/docs/Web/CSS/cursor.",
        "en": "Sets mouse cursor image inside graphic window. For valid values see: https://developer.mozilla.org/en-US/docs/Web/CSS/cursor",
    })

    static worldClearComment = () => lm({
        "de": "Löscht alle Grafikobjekte in der Welt, indem es ihre destroy()-Methode aufruft.",
        "en": "Clears all graphic objects inside this world by calling it's destroy() method.",
    })

    static worldGetWidthComment = () => lm({
        "de": "Gibt die Breite des sichtbaren Bereichs der Welt zurück.",
        "en": "Returns width of visible part of world.",
    })

    static worldGetHeightComment = () => lm({
        "de": "Gibt die Höhe des sichtbaren Bereichs der Welt zurück.",
        "en": "Returns height of visible part of world.",
    })

    static worldGetLeftComment = () => lm({
        "de": "Gibt die X-Koordinate der linken oberen Ecke des sichtbaren Bereichs der Welt zurück.",
        "en": "Returns x-coordinate of top-left corner of visible part of world.",
    })

    static worldGetTopComment = () => lm({
        "de": "Gibt die Y-Koordinate der linken oberen Ecke des sichtbaren Bereichs der Welt zurück.",
        "en": "Returns y-coordinate of top-left corner of visible part of world.",
    })

    static worldGetDefaultGroupComment = () => lm({
        "de": "Gibt die Gruppe zurück, zu der aktuell alle neuen Objekte automatisch hinzugefügt werden. Falls gerade keine defaultGroup festgelegt ist, wird null zurückgegeben.",
        "en": "Returns group to which all new graphic objects are added by default. If no default group is set, this method returns null.",
    })

    static worldSetDefaultGroupComment = () => lm({
        "de": "Legt die Gruppe fest, zu der aktuell alle neuen Objekte automatisch hinzugefügt werden. Falls keine defaultGroup gewünscht ist, rufen Sie setDefaultGroup(null) auf.",
        "en": "Sets group to which all new graphic objects are added by default. For 'no default group' call setDefaultGroup(null).",
    })

    /**
     * Class Actor
     */

    static actorActMethodComment = () => lm({
        "de": "Die Methode act wird 30-mal pro Sekunde aufgerufen. Wenn Sie sie in einer Unterklasse überschreiben, so wird Ihre Methode 30-mal pro Sekunde aufgerufen.",
        "en": "Method act is called 30 times per second. Overwrite it to get your own method being called 30 times per second.",
    })

    static actorActMethodComment2 = () => lm({
        "de": "Die Methode act wird 30-mal pro Sekunde aufgerufen. Wenn Sie sie in einer Unterklasse überschreiben, so wird Ihre Methode 30-mal pro Sekunde aufgerufen. DletaTime ist die seit dem letzten Aufruf verstrichene Zeit in ms.",
        "en": "Method act gets called 30 times per second. Overwrite it to get your own method being called 30 times per second. DeltaTime is time since last call in ms.",
    })

    static actorOnKeyTypedComment = () => lm({
        "de": "onKeyTyped wird jedes Mal dann aufgerufen, wenn eine Taste heruntergedrückt und anschließend losgelassen wird. Der Parameter key enthält die gedrückte Taste. Im Fall von Sondertasten (Enter, Pfeiltasten...) wird eine der Konstanten Key.Enter, Key.ArrowUp, ... übergeben.",
        "en": "onKeyTyped gets called after a key had been pressed and subsequently released. The key is stored in parameter key. For special keys (like enter, arrow keys, ...) use constants Key.Enter, Key.ArrowUp, ...",
    })

    static actorOnKeyUpComment = () => lm({
        "de": "onKeyUp wird jedes Mal dann aufgerufen, wenn eine Taste losgelassen wird. Der Parameter key enthält die gedrückte Taste. Im Fall von Sondertasten (Enter, Pfeiltasten...) wird eine der Konstanten Key.Enter, Key.ArrowUp, ... übergeben.",
        "en": "onKeyUP gets called after a key had been released. The key is stored in parameter key. For special keys (like enter, arrow keys, ...) use constants Key.Enter, Key.ArrowUp, ...",
    })

    static actorOnKeyDownComment = () => lm({
        "de": "onKeyDown wird jedes Mal dann aufgerufen, wenn eine Taste gedrückt wird. Der Parameter key enthält die gedrückte Taste. Im Fall von Sondertasten (Enter, Pfeiltasten...) wird eine der Konstanten Key.Enter, Key.ArrowUp, ... übergeben.",
        "en": "onKeyDown gets called after a key had been pressed down. The key is stored in parameter key. For special keys (like enter, arrow keys, ...) use constants Key.Enter, Key.ArrowUp, ...",
    })

    static getWorldComment = () => lm({
        "de": "Gibt das aktuelle World-Objekt zurück.",
        "en": "Returns current world object.",
    })

    static actorIsActingComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn die act-Methode 30-mal pro Sekunden aufgerufen wird. Nutzen Sie die Methoden stopActing und restartActing um dies zu deaktivieren bzw. zu aktivieren.",
        "en": "Returns true if act method is called regularly 30 time sper second. Use Methods stopActing and restartActing to disable/enable this behaviour.",
    })

    static actorIsDestroyedComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn das Objekt durch Aufruf der Methode destroy() zerstört worden ist.",
        "en": "Returns true if object had been destroyed by calling method destroy().",
    })

    static actorStopActingComment = () => lm({
        "de": "Sorgt dafür, dass die act-Methode dieses Objekts zukünftig nicht mehr 30-mal pro Sekunde aufgerufen wird.",
        "en": "Stops the act method of this object being called 30 times per second.",
    })

    static actorRestartActingComment = () => lm({
        "de": "Sorgt dafür, dass die act-Methode dieses Objekts zukünftig wieder 30-mal pro Sekunde aufgerufen wird.",
        "en": "Restarts the act method of this object being called 30 times per second.",
    })

    /**
     * Class Shape
     */

    static shapeClassComment = () => lm({
        "de": "Die Klasse Shape ist Oberklasse aller graphischen Objekte.",
        "en": "Class Shape is base class of all graphical objects.",
    })

    static shapeOnMouseUpComment = () => lm({
        "de": "Wird aufgerufen, wenn sich der Mauspfeil über dem Objekt befindet und der Benutzer eine Maustaste loslässt.",
        "en": "Is called if mouse cursor is on object and user releases a mouse button.",
    })

    static shapeOnMouseDownComment = () => lm({
        "de": "Wird aufgerufen, wenn sich der Mauspfeil über dem Objekt befindet und der Benutzer eine Maustaste drückt.",
        "en": "Is called if mouse cursor is on object and user presses a mouse button.",
    })

    static shapeOnMouseMoveComment = () => lm({
        "de": "Wird aufgerufen, wenn sich der Mauspfeil über dem Objekt befindet und der Benutzer die Maus bewegt.",
        "en": "Is called if mouse cursor is on object and user moves mouse.",
    })

    static shapeOnMouseEnterComment = () => lm({
        "de": "Wird aufgerufen, wenn der Mauspfeil das Objekt betritt.",
        "en": "Is called if mouse cursor enters object.",
    })

    static shapeOnMouseLeaveComment = () => lm({
        "de": "Wird aufgerufen, wenn der Mauspfeil das Objekt verlässt.",
        "en": "Is called if mouse cursor leaves object.",
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
     * Class FilledShape
     */

    static fsGetFillColorComment = () => lm({
        "de": "Gibt die Füllfarbe dieses Objekts als Color-Objekt zurück.",
        "en": "Returns fill color of this object as ",
    })

    static fsSetFillColorCommentInt = () => lm({
        "de": "Setzt die Füllfarbe des Objekts. Die Farbe wird als integer-Wert angegeben.\n Tipp: Schreibe die Farbe in der Form 0xffffff, dann zeigt die IDE ein kleines Farbquadrat, mit dem Du einen Color Picker öffnen kannst.",
        "en": "Set fill color as int value.\n Hint: If you write fillcolor as hex value like 0xffffff then the IDE shows a little color patch. Hover over it to open a color picker.",
    })

    static fsSetFillColorCommentIntDouble = () => lm({
        "de": "Setzt die Füllfarbe des Objekts. Die Farbe wird als integer-Wert angegeben, der alpha-Wert (Durchsichtigkeit) als double-Wert. 0.0 bedeutet komplett durchsichtig, 1.0 bedeutet kompett undurchsichtig.\n Tipp: Schreibe die Farbe in der Form 0xffffff, dann zeigt die IDE ein kleines Farbquadrat, mit dem Du einen Color Picker öffnen kannst.",
        "en": "Set fill color as int value. Alpha-value is given as double value: 0.0 means completely transparent, 1.0 means completely opaque. \n Hint: If you write fillcolor as hex value like 0xffffff then the IDE shows a little color patch. Hover over it to open a color picker.",
    })

    static fsSetFillColorCommentString = () => lm({
        "de": 'Setzt die Füllfarbe des Objekts. Die Farbe wird als Zeichenkette angegeben. Möglich sind Farbkonstanten ("rot", "red", ...) oder css-Syntax wie "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)".',
        "en": 'Set fill color as string value. Possible values are color constants like "red", "green", "blue", ... and css syntax like  "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)"',
    })

    static fsSetFillColorCommentStringDouble = () => lm({
        "de": 'Setzt die Füllfarbe des Objekts. Die Farbe wird als Zeichenkette angegeben, der Alpha-Wert (Undurchsichtigkeit) als double-Wert zwischen 0.0 (komplett durchsichtig) und 1.0 (komplett undurchsichtig). Möglich sind Farbkonstanten ("rot", "red", ...) oder css-Syntax wie "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)".',
        "en": 'Set fill color as string value, alpha-Value (opacity between 0.0 and 1.0) as double value. Possible values are color constants like "red", "green", "blue", ... and css syntax like  "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)"',
    })

    static fsGetBorderColorComment = () => lm({
        "de": "Gibt die Randfarbe dieses Objekts als Color-Objekt zurück.",
        "en": "Returns border color of this object as ",
    })

    static fsSetBorderColorCommentInt = () => lm({
        "de": "Setzt die Randfarbe des Objekts. Die Farbe wird als integer-Wert angegeben.\n Tipp: Schreibe die Farbe in der Form 0xffffff, dann zeigt die IDE ein kleines Farbquadrat, mit dem Du einen Color Picker öffnen kannst.",
        "en": "Set border color as int value.\n Hint: If you write BorderColor as hex value like 0xffffff then the IDE shows a little color patch. Hover over it to open a color picker.",
    })

    static fsSetBorderColorCommentIntDouble = () => lm({
        "de": "Setzt die Randfarbe des Objekts. Die Farbe wird als integer-Wert angegeben, der alpha-Wert (Durchsichtigkeit) als double-Wert. 0.0 bedeutet komplett durchsichtig, 1.0 bedeutet kompett undurchsichtig.\n Tipp: Schreibe die Farbe in der Form 0xffffff, dann zeigt die IDE ein kleines Farbquadrat, mit dem Du einen Color Picker öffnen kannst.",
        "en": "Set border color as int value. Alpha-value is given as double value: 0.0 means completely transparent, 1.0 means completely opaque. \n Hint: If you write BorderColor as hex value like 0xffffff then the IDE shows a little color patch. Hover over it to open a color picker.",
    })

    static fsSetBorderColorCommentString = () => lm({
        "de": 'Setzt die Randfarbe des Objekts. Die Farbe wird als Zeichenkette angegeben. Möglich sind Farbkonstanten ("rot", "red", ...) oder css-Syntax wie "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)".',
        "en": 'Set border color as string value. Possible values are color constants like "red", "green", "blue", ... and css syntax like  "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)"',
    })

    static fsSetBorderColorCommentStringDouble = () => lm({
        "de": 'Setzt die Randfarbe des Objekts. Die Farbe wird als Zeichenkette angegeben, der Alpha-Wert (Undurchsichtigkeit) als double-Wert zwischen 0.0 (komplett durchsichtig) und 1.0 (komplett undurchsichtig). Möglich sind Farbkonstanten ("rot", "red", ...) oder css-Syntax wie "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)".',
        "en": 'Set border color as string value, alpha-Value (opacity between 0.0 and 1.0) as double value. Possible values are color constants like "red", "green", "blue", ... and css syntax like  "#ff034a", "rgb(100, 200, 10)" oder "rgba(100, 10, 10, 0.8)"',
    })

    static fsSetBorderWidthComment = () => lm({
        "de": "Setzt die Randbreite des Objekts in Pixeln.",
        "en": "Sets border width of this object in pixels.",
    })

    static fsGetBorderWidthComment = () => lm({
        "de": "Gibt die Randbreite dieses Objekts in Pixeln zurück.",
        "en": "Returns border width of this object in pixels.",
    })

    static fsSetAlphaComment = () => lm({
        "de": "Setzt den Alphy-Wert des Objekts. Dabei bedeutet 0.0 ganz durchsichtig, 1.0 ganz undurchsichtig.",
        "en": "Sets alpha value (opacity) of this object. 0.0 means completely transparent, 1.0 means completely opaque.",
    })

    static fsGetAlphaComment = () => lm({
        "de": "Gibt den Alphy-Wert des Objekts zurück. Dabei bedeutet 0.0 ganz durchsichtig, 1.0 ganz undurchsichtig.",
        "en": "Returns alpha value (opacity) of this object. 0.0 means completely transparent, 1.0 means completely opaque.",
    })

    static fsSetDefaultBorderComment1 = () => lm({
        "de": "Setzt die Default-Werte für Randbreite und Randfarbe. Allen danach neu erzeugten Objekten werden anfangs diese Eigenschaften zugewiesen.",
        "en": "Sets default border width and border color. All subsequently created objects get these border width and border color.",
    })
    
    static fsSetDefaultBorderComment2 = () => lm({
        "de": "Setzt die Default-Werte für Randbreite, Randfarbe und alpha-Wert (Durchsichtigkeit). Allen danach neu erzeugten Objekten werden anfangs diese Eigenschaften zugewiesen.",
        "en": "Sets default border width and border color and alpha value. All subsequently created objects get these border width and border color.",
    })
    
    static fsSetDefaultFillColor = () => lm({
        "de": "Setzt den Defaultwert für die Füllfarbe. Allen danach neu erzeugten Objekten wird anfangs diese Eigenschaft zugewiesen.",
        "en": "Sets default fill color. All subsequently created objects get this fill color.",
    })



    /**
     * Class Circle
     */

    static circleClassComment = () => lm({
        "de": "Kreis",
        "en": "Circle",
    })

    static circleEmptyConstructorComment = () => lm({
        "de": "Instanziert einen neuen Kreis mit Mittelpunkt (50, 50) und Radius 50.",
        "en": "Creates a new Circle object with center at (50, 50) and radius 50.",
    })

    static circleConstructorComment = () => lm({
        "de": "Instanziert einen neuen Kreis. (mx, my) ist der Mittelpunt, r sein Radius.",
        "en": "Creates a new Circle object with center at (mx, my) and given radius.",
    })

    static circleSetRadiusComment = () => lm({
        "de": "Setzt den Radius des Kreises.",
        "en": "Set radius.",
    })

    static circleGetRadiusComment = () => lm({
        "de": "Gibt den Radius des Kreises zurück.",
        "en": "Gets radius.",
    })

    static circleCopyComment = () => lm({
        "de": "Erstellt eine Kopie des Circle-Objekts und git sie zurück.",
        "en": "Creates a exact copy of this circle object and returns it.",
    })

    /**
     * Interface MouseListener
     */
    static mouseListenerInterfaceComment = () => lm({
        "de": "Interface mit Methoden, die aufgerufen werden, wenn Maus-Ereignisse eintreten. Ein Objekt, das dieses Interface implementiert muss zuvor aber mit world.addMouseListener() registriert werden, wobei world das aktuelle World-Objekt ist.",
        "en": "A MouseListener's methods are called whenever a mouse event occurs. Objects implementing this interface need registering at world by world.addMouseListener().",
    })

    static mouseListenerOnMouseUpComment = () => lm({
        "de": "Wird aufgerufen, wenn eine Maustaste über dem Grafikbereich losgelassen wird.",
        "en": "This method gets called if user releases a mouse button.",
    })

    static mouseListenerOnMouseDownComment = () => lm({
        "de": "Wird aufgerufen, wenn eine Maustaste über dem Grafikbereich gedrückt wird.",
        "en": "This method gets called if user presses a mouse button.",
    })

    static mouseListenerOnMouseMoveComment = () => lm({
        "de": "Wird aufgerufen, wenn der Mauszeiger über dem Grafikbereich bewegt wird.",
        "en": "This method gets called if user moves mouse.",
    })

    static mouseListenerOnMouseEnterComment = () => lm({
        "de": "Wird aufgerufen, wenn der Mauszeiger in den Grafikbereich hineinbewegt wird.",
        "en": "This method gets called if mouse cursor enters graphic view.",
    })

    static mouseListenerOnMouseLeaveComment = () => lm({
        "de": "Wird aufgerufen, wenn der Mauszeiger den Grafikbereich verlässt.",
        "en": "This method gets called if mouse cursor leaves graphic view.",
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


    /**
     * class Sprite
     */

    static spriteClassComment = () => lm({
        "de": "Ein Sprite ist eine kleine Pixelgrafik, die verschoben, gedreht und skaliert werden kann. Zudem besitzt es Methoden zum Erkennen von Kollisionen mit anderen grafischen Objekten.",
        "en": "A sprite is a small image which may be moved, rotated or scaled. It is able to detect collisions with other graphic objects.",
    })

    static spriteConstructorComment1 = () => lm({
        "de": "Instanziert ein neues Sprite und stellt es an der Position (x, y) dar (== Diagonalenschnittpunkt der Boundingbox). SpriteLibrary ist ein Aufzählungstyp (enum). Gib einfach SpriteLibraryEntry gefolgt von einem Punkt ein, dann erhältst Du ein Auswahl von Bildern. Einen Überblick über die Bilder bekommst Du auch über den Menüpunkt Hilfe->Sprite-Bilderübersicht.",
        "en": "Instantiate a new sprite object and move it to position (x,y) (== diagonal intersection of bounding box). SpriteLibrary is a enum. Just enter SpriteLibraryEntry followed by a dot to get a list of library identifiers. To view all sprite libraries got to Help->Sprite Libraries.",
    })

    static spriteConstructorComment2 = () => lm({
        "de": "Zeichnet das graphische Objekt (shape) in eine Bitmap und macht daraus ein Sprite. Dieses wird an der Position (0, 0) dargestellt.",
        "en": "Renders given Shape object into a bitmap and creates a Sprite object from it. This Sprite object is shown at position (0, 0).",
    })

    static spriteErrorImageNotFound = (spriteLibrary: string, imageIndex: number) => lm({
        "de": "Das Spritesheet " + spriteLibrary + " hat kein Bild mit Index " + imageIndex,
        "en": "Spritesheet " + spriteLibrary + " has no image with index " + imageIndex,
    })

    static tileClassComment = () => lm({
        "de": "Eine Kachel in einem Sprite, das mithilfe der Methode makeTiling zu einer Kachelfläche gemacht wurde.",
        "en": "A tile inside a sprite which had been converted to a tiled sprite with method makeTiling.",
    })

    static tileMoveComment = () => lm({
        "de": "Verschiebt das Grafikobjekt um dx Pixel nach rechts und um dy Pixel nach unten.",
        "en": "Moves tile by dx pixels right and dy pixels down.",
    })

    static tileScaleComment = () => lm({
        "de": "Streckt das Grafikobjekt um den angegebenen Faktor. Das Zentrum der Streckung ist der 'Mittelpunkt' des Objekts.",
        "en": "Scales tile by given factor. Scale origin is the diagonal intersection of this tile.",
    })

    static tileMirrorXComment = () => lm({
        "de": "Spiegelt das Objekt in X-Richtung.",
        "en": "Mirrors tile in x-direction.",
    })

    static tileMirrorYComment = () => lm({
        "de": "Spiegelt das Objekt in Y-Richtung.",
        "en": "Mirrors tile in y-direction.",
    })

    static spriteShapeIsNullError = () => lm({
        "de": "Die übergebene Figur hat den Wert null.",
        "en": "Given shape is null.",
    })

    static spriteSetImageComment = () => lm({
        "de": "Ändert das Bild des Sprites. SpriteLibraryEntry ist ein Auzählungstyp (enum). Gib einfach SpriteLibraryEntry gefolgt von einem Punkt ein, dann erhältst Du ein Auswahl von Bildern. Einen Überblick über die Bilder bekommst Du auch über den Menüpunkt Hilfe->Sprite-Bilderübersicht.",
        "en": "sets the image of this sprite. SpriteLibrary is a enum. Just enter SpriteLibraryEntry followed by a dot to get a list of library identifiers. To view all sprite libraries got to Help->Sprite Libraries.",
    })

    static spriteSetImageIndexComment = () => lm({
        "de": "Ändert den Bildindex des Sprites, so dass ein anderes Bild der SpriteLibrary dargestellt wird.",
        "en": "Changes image index of sprite. This makes the sprite show the corresponding image of current SpriteLibrary.",
    })

    static spritePlayAnimationComment = () => lm({
        "de": "Spielt eine Animation ab.",
        "en": "plays an animation",
    })

    static spriteStopAnimationComment = () => lm({
        "de": "Stoppt die gerade laufende Animation",
        "en": "stops currently playing animation",
    })

    static spritePauseAnimationComment = () => lm({
        "de": "Pausiert die gerade laufende Animation",
        "en": "pauses currently playing animation",
    })

    static spriteResumeAnimationComment = () => lm({
        "de": "Fährt mit einer pausierten Animation wieder fort.",
        "en": "resumes currently paused animation",
    })

    static spriteSetAlphaComment = () => lm({
        "de": "Setzt die Durchsichtigkeit. 0.0 bedeutet vollkommen durchsichtig, 1.0 bedeutet vollkommen undurchsichtig.",
        "en": "Sets alpha value of sprite. Alpha value of 0.0 makes sprite completely transparent, value of 1.0 makes it complete opaque.",
    })

    static spriteCopyComment = () => lm({
        "de": "Erstellt eine Kopie des Sprite-Objekts und git sie zurück.",
        "en": "Creates a copy of this Sprite object and returns it.",
    })

    static spriteGetWidthComment = () => lm({
        "de": "Gibt die Breite des Sprites in Pixeln zurück.",
        "en": "Returns width of sprite in pixels.",
    })

    static spriteGetHeightComment = () => lm({
        "de": "Gibt die Höhe des Sprites in Pixeln zurück.",
        "en": "Returns height of sprite in pixels.",
    })

    static spriteGetImageIndexComment = () => lm({
        "de": "Gibt den Index des Bildes innerhalb der Sprite-Library zurück.",
        "en": "Returns index of currently displayed image within sprite library.",
    })

    static spriteMakeTilingComment1 = () => lm({
        "de": "Fügt das identische Bild nach rechts und unten kachelartig ('tile'!) so oft hinzu, bis die angegebene Breite erreicht ist. \nTIPP: Mit der Methode getTileImage() erhält man ein Tile-Objekt, dessen Methoden move, scale, mirrorX und mirrorY sich gleichzeitig auf jede einzelne Kachel auswirken.",
        "en": "Adds the identical image (-> 'tiles') at right and bottom of image until given width and height is reached. \nHINT: Use method getTileImage() to obtain a tile object which can move, scale and mirror all the tiles at once.",
    })

    static spriteMakeTilingComment2 = () => lm({
        "de": "Fügt das identische Bild nach rechts und unten kachelartig ('tile'!) so oft hinzu, bis die angegebene Breite erreicht ist. GapX und GapY sind die Abstände, die zwischen den einzelnen Kacheln eingehalten werden. \nTIPP: Mit der Methode getTileImage() erhält man ein Tile-Objekt, dessen Methoden move, scale, mirrorX und mirrorY sich gleichzeitig auf jede einzelne Kachel auswirken.",
        "en": "Adds the identical image (-> 'tiles') at right and bottom of image until given width and height is reached. GapX and GapY are distances between the tiles. \nHINT: Use method getTileImage() to obtain a tile object which can move, scale and mirror all the tiles at once.",
    })

    static spriteGetTileImageComment = () => lm({
        "de": "Nachdem das Sprite mittels der Methode 'makeTiling' zum TileSprite gemacht wurde, kann wirken die Methoden move, scale und rotate immer auf den ganzen gekachelten Bereich. Will man das verfielfachte Bild ändern, so bekommt man über diese Methode das Sprite-Objekt, das diesem Bild entspricht. Ruft man für dieses Objekt die Methoden move, rotate oder scale auf, so wirken sie auf jede der einzelnen Kacheln.",
        "en": "After sprite is converted to tilesprite via method 'makeTiling' you can modify the tiles with the TileImage object returned by this method.",
    })

    static spriteSpriteIsNoTiledSpriteError = () => lm({
        "de": "Das Sprite hat kein TileImage. Sie müssen es zuerst mit der Methode makeTiling in ein Kachel-Sprite umwandeln.",
        "en": "This sprite has no tileImage as it had not beeen converted to a TileSprite via method 'makeTiling'.",
    })


    /**
     * Enum ScaleMode
     */
    static scaleModeEnumComment = () => lm({
        "de": "Art der Interpolation der Pixelfarben beim Skalieren von Sprites",
        "en": "interpolation type used for scaling Sprites",
    })

    /**
     * Enum RepeatType
     */
    static repeatTypeEnumComment = () => lm({
        "de": "Gibt an, auf welche Art eine Sprite-Animation wiederholt werden soll.",
        "en": "Enumerates how a sprite animation may be repeated.",
    })

    /**
     * Enum SpriteLibrary
     */
    static spriteLibraryComment = () => lm({
        "de": "Aufzählung der Sprite-Grafikbibliotheken",
        "en": "enum of sprite libraries",
    })

    /**
     * Collection
     */
    static collectionToArrayComment = () => lm({
    "de": "Wandelt die Collection in ein Array um und gibt dieses zurück.",
    "en": "Returns an array containing all of the elements in this list in proper sequence (from first to last element).",
    })

    static collectionToArrayComment2 = () => lm({
    "de": "Wandelt die Collection in ein Array um und gibt dieses zurück. Als Parameter muss ein Muster-Array übergeben werden, das den Typ des zurückgegebenen Arrays bestimmt.",
    "en": "Returns an array containing all of the elements in this list in proper sequence (from first to last element); the runtime type of the returned array is that of the specified array.",
    })

    static collectionAddElementComment = () => lm({
    "de": "Fügt das übergebene Element ans Ende der Liste an.",
    "en": "Appends the specified element to the end of this list.",
    })

    static collectionAddAllComment = () => lm({
    "de": "Fügt alle Elemente der übergebenen Collection ans Ende der Liste an.",
    "en": "Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection's Iterator.",
    })

    static collectionClearComment = () => lm({
    "de": "Entleert die Liste. Die Liste ist nach Aufruf dieser Methode leer. Die Elemente der Liste werden dadurch nicht beeinträchtigt.",
    "en": "Removes all of the elements from this list. The list will be empty after this call returns.",
    })

    static collectionContainsComment = () => lm({
    "de": "Gibt genau dann true zurück, wenn die Liste das angegebene Element enthält.",
    "en": "Returns true if this list contains the specified element.",
    })

    static collectionContainsAllComment = () => lm({
    "de": "Gibt genau dann true zurück, wenn die Liste alle Elemente der übergebenen Collection enthält.",
    "en": "Returns true if this collection contains all of the elements in the specified collection.",
    })

    static collectionIsEmptyComment = () => lm({
    "de": "Gibt genau dann true zurück, wenn die Liste leer ist, d.h. keine Elemente enthält.",
    "en": "Returns true if this list contains no elements.",
    })

    static collectionRemoveObjectComment = () => lm({
    "de": "Falls die Liste das übergebene Element enthält, entnimmt diese Methode der Liste das erste solche Element. Die Methode gibt genau dann true zurück, wenn die Liste das Element enthalten hat.",
    "en": "Removes the first occurrence of the specified element from this list, if it is present. Returns true if element is found.",
    })

    static collectionRemoveAllComment = () => lm({
    "de": "Entnimnt der Liste alle Vorkommen aller Elemente der übergebenen Collection.",
    "en": "Removes from this list all of its elements that are contained in the specified collection.",
    })

    static collectionSizeComment = () => lm({
    "de": "Gibt die Anzahl der in der Liste enthaltenen Elemente zurück. Ist ein Element mehrfach enthalten, so wird es dabei mehrfach gezählt.",
    "en": "Returns the number of elements in this list.",
    })

    /**
     * List
     */
    static listAddElementComment = () => lm({
    "de": "Fügt das angegebene Element an der angegebenen Position in die Liste ein. Alle nachfolgendne Elemente werden um eine Position nach hinten verschoben.",
    "en": "Inserts the specified element at the specified position in this list. Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).",
    })

    static listAddAllElementsComment = () => lm({
    "de": "Fügt alle Elemente der übergebenen Collection an der angegebenen Position in die Liste ein. Alle nachfolgendne Elemente werden entsprechend nach hinten verschoben.",
    "en": "Inserts all of the elements in the specified collection into this list, starting at the specified position. Shifts the element currently at that position (if any) and any subsequent elements to the right (increases their indices). The new elements will appear in the list in the order that they are returned by the specified collection's iterator.",
    })

    static listGetComment = () => lm({
    "de": "Gibt das Element an der angegebenen Position zurück.\n Das erste Element der Liste hat Position 0.",
    "en": "Returns the element at the specified position in this list. First element in list has position 0.",
    })

    static listIndexOfComment = () => lm({
    "de": "Gibt den Index des angegebenen Elements in der Liste zurück. Falls das Element nicht in der Liste enthalten ist, wird -1 zurückgegeben.\nTipp: Das erste Element der Liste hat Index 0.",
    "en": "Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.\nHint: First element in List has index 0.",
    })

    static listRemoveComment = () => lm({
    "de": "Entfernt das Element mit dem angegebenen Index aus der Liste.\nTipp: Das erste Element der Liste hat Index 0.",
    "en": "Removes the element at the specified position in this list.\nHint: First element in list has index 0.",
    })

    static listSetComment = () => lm({
    "de": "Setzt das übergebene Element an der angegebenen Position in die Liste anstatt des bisher dort vorhandenen.",
    "en": "Replaces the element at the specified position in this list with the specified element.",
    })

    static listSortComment = () => lm({
    "de": "Sortiert die Liste anhand des übergebenen Comparator-Objekts.",
    "en": "Sorts this list according to the order induced by the specified Comparator.",
    })

    /**
     * ArrayList
     */
    static arrayListConstructorComment = () => lm({
    "de": "Instanziert (d.h. erzeugt) eine neue, leere Liste.",
    "en": "Constructs an empty list.",
    })

    static arrayListIteratorComment = () => lm({
    "de": "Gibt ein Iterator-Objekt zurück, mit dem über alle Elemente der Liste in der gespeicherten Reihenfolge iteriert werden kann.",
    "en": "Returns an iterator over the elements in this list in proper sequence.",
    })

    static arrayListForeachComment = () => lm({
    "de": "Führt die angegebene Methode (Aktion) für jedes Element der ArrayList aus.\nTipp: Die Aktion kann in Lambda-Schreibweise angegeben werden, z.B. foreach((element) -> {...})",
    "en": "Performs the given action for each element of the Iterable until all elements have been processed or the action throws an exception. Unless otherwise specified by the implementing class, actions are performed in the order of iteration (if an iteration order is specified).",
    })



    // Kürzel: mlc

}            
