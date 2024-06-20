import { le, lm } from "./LanguageManager"

/**
 * Java compiler's messages
 */
export class JRC {


    /**
     * Class Object
     */
    static objectConstructorComment = () => lm({
        "de": "Erstellt ein neues Objekt.",
        "en": "Creates a new object instance.",
    })

    static objectToStringComment = () => lm({
        "de": "Wandelt das Objekt in eine Zeichenkette um und liefert diese zurück.",
        "en": "Returns a String representation of this object.",
    })

    static objectEqualsComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn das Objekt und das übergebene Objekt 'gleich' sind.",
        "en": 'Indicates whether some other object is "equal to" this one.',
    })

    static objectWaitComment = () => lm({
        "de": "Bewirkt, dass der aktuelle Thread wartet bis in einem anderen Thread die Methode notify() oder notifyAll() dieses Objekts aufgerufen wird.",
        "en": "Causes the current thread to wait until another thread invokes the notify() method or the notifyAll() method for this object.",
    })

    static objectWaitWithTimeoutComment = () => lm({
        "de": "Bewirkt, dass der aktuelle Thread wartet bis in einem anderen Thread die Methode notify() oder notifyAll() dieses Objekts aufgerufen wird oder das übergebene Timeout (in ms) abläuft.",
        "en": "Causes the current thread to wait until another thread invokes the notify() method or the notifyAll() method for this object or given timeout elapsed.",
    })

    static objectNotifyComment = () => lm({
        "de": "Weckt einen der Threads auf, der auf den Monitor dieses Objektes wartet.",
        "en": "Wakes up a single thread that is waiting on this object's monitor.",
    })

    static objectNotifyAllComment = () => lm({
        "de": "Weckt alle Threads auf, die auf den Monitor dieses Objektes warten.",
        "en": "Wakes up all threads that are waiting on this object's monitor."
    })

    /**
     * Class String
     */
    static stringClassComment = () => lm({
        "de": "Ein String ist eine Zeichenkette.",
        "en": "A String is a character sequence.",
    })

    static stringConstructorComment = () => lm({
        "de": "Erzeugt ein neues, leeres String-Objekt.",
        "en": "Creates a new empty string object.",
    })

    static stringConstructorComment2 = () => lm({
        "de": "Erzeugt ein String-Objekt auf Grundlage des übergebenen.",
        "en": "Initializes a newly created String object so that it represents the same sequence of characters as the argument; in other words, the newly created string is a copy of the argument string.",
    })

    static stringLengthComment = () => lm({
        "de": "Gibt die Länge des Strings (== Anzahl an Zeichen) zurück.",
        "en": "Returns the length of this string (number of characters).",
    })

    static stringIndexOfComment1 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem der übergebene String zum ersten Mal auftritt. Gibt -1 zurück, falls dieser nicht im String enthalten ist.",
        "en": "Returns the index within this string of the first occurrence of the specified substring. Returns -1 if String does not contain given String.",
    })

    static stringIndexOfComment2 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem der übergebene String NACH fromIndex zum ersten Mal auftritt. Gibt -1 zurück, falls dieser NACH fromIndex nicht im String enthalten ist.",
        "en": "Returns the index within this string of the first occurrence of the specified substring, starting at the specified index. Returns -1 if String does not contain given String after given Index.",
    })

    static stringIndexOfComment3 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem das übergebene Zeichen zum ersten Mal auftritt. Gibt -1 zurück, falls dieses nicht im String enthalten ist.",
        "en": "Returns the index within this string of the first occurrence of the specified character. Returns -1 if String does not contain given character.",
    })

    static stringIndexOfComment4 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem das übergebene Zeichen NACH fromIndex zum ersten Mal auftritt. Gibt -1 zurück, falls dieses NACH fromIndex nicht im String enthalten ist.",
        "en": "Returns the index within this string of the first occurrence of the specified character, starting at the specified index. Returns -1 if String does not contain given character after given Index.",
    })

    static stringCharAtComment = () => lm({
        "de": "Gibt das Zeichen an der angegebenen Position zurück. Das erste Zeichen im String hat Position 0.",
        "en": "Returns the char value at the specified index. An index ranges from 0 to length() - 1. The first char value of the sequence is at index 0, the next at index 1, and so on, as for array indexing.",
    })

    static compareToIgnoreCaseComment = () => lm({
        "de": "Vergleicht die beiden Zeichenketten lexikalisch ohne Berücksichtigung von Klein- und Großschreibung und gibt entsprechend -1, 0 oder 1 zurück.",
        "en": "Compares two strings lexicographically, ignoring case differences. This method returns an integer whose sign is that of calling compareTo with normalized versions of the strings where case differences have been eliminated by calling Character.toLowerCase(Character.toUpperCase(character)) on each character.",
    })

    static stringConcatComment = () => lm({
        "de": "Gibt einen String zurück, der entsteht, indem man den übergebenen String hinter diesen hängt. Verändert den String dabei aber nicht.",
        "en": "Concatenates the specified string to the end of this string",
    })

    static stringContainsComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der String den übergebenen String enthält.",
        "en": "Returns true if this String contains given String.",
    })

    static stringEndsWithComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der String mit dem übergebenen String endet.",
        "en": "Tests if this string ends with the specified suffix.",
    })

    static stringStartsWithComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der String mit dem übergebenen String beginnt.",
        "en": "Tests if this string starts with the specified praefix.",
    })

    static stringEqualsIgnoreCaseComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der übergebene String diesem String bis auf Klein- und Großschreibung gleicht.",
        "en": "Compares this String to another String, ignoring case considerations. Two strings are considered equal ignoring case if they are of the same length and corresponding characters in the two strings are equal ignoring case.",
    })

    static stringIsEmptyComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der String leer ist, sich also keine Zeichen darin befinden. Das ist wiederum genau dann der Fall, wenn die Länge des Strings 0 beträgt.",
        "en": "Returns true if, and only if, length() is 0.",
    })

    static stringLastIndexOfComment1 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem der übergebene String zum letzten Mal auftritt. Gibt -1 zurück, falls dieser nicht im String enthalten ist.",
        "en": "Returns the index within this string of the last occurrence of the specified substring. Returns -1 if String does not contain given String.",
    })

    static stringLastIndexOfComment2 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem der übergebene String VOR fromIndex zum letzten Mal auftritt. Gibt -1 zurück, falls dieser VOR fromIndex nicht im String enthalten ist.",
        "en": "Returns the index within this string of the last occurrence of the specified substring, starting at the specified index backwards. Returns -1 if String does not contain given String before given Index.",
    })

    static stringLastIndexOfComment3 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem das übergebene Zeichen zum letzten Mal auftritt. Gibt -1 zurück, falls dieses nicht im String enthalten ist.",
        "en": "Returns the index within this string of the last occurrence of the specified character. Returns -1 if String does not contain given character.",
    })

    static stringLastIndexOfComment4 = () => lm({
        "de": "Gib den Index innerhalb dieses Strings zurück, ab dem das übergebene Zeichen VOR fromIndex zum letzten Mal auftritt. Gibt -1 zurück, falls dieses VOR fromIndex nicht im String enthalten ist.",
        "en": "Returns the index within this string of the last occurrence of the specified character, starting at the specified index backwards. Returns -1 if String does not contain given character before given Index.",
    })

    static stringToLowerCaseComment = () => lm({
        "de": "Gibt einen String zurück, der den String in Kleinschreibung enthält.",
        "en": "Converts all of the characters in this String to lower case using the rules of the default locale.",
    })

    static stringToUpperCaseComment = () => lm({
        "de": "Gibt einen String zurück, der den String in Großschreibung enthält.",
        "en": "Converts all of the characters in this String to upper case using the rules of the default locale.",
    })

    static stringSubstringComment1 = () => lm({
        "de": "Gibt den Teilstring ab der übergebenen Position zurück. Position 0 ist der Beginn des Strings.",
        "en": "Returns a string that is a substring of this string from given position on. Position 0 is start of string.",
    })

    static stringSubstringComment2 = () => lm({
        "de": "Gibt den Teilstring zwischen den beiden übergebenen Positionen zurück. Position 0 ist der Beginn des Strings.",
        "en": "Returns a string that is a substring of this string between given positions. Position 0 is start of string.",
    })

    static stringTrimComment = () => lm({
        "de": "Gibt den String zurück, der entsteht, wenn man an Beginn und Ende alle unsichtbaren Zeichen (d.h. Leerzeichen, tabs und Zeilenumbrüche) entfernt.",
        "en": "Returns a string whose value is this string, with any leading and trailing whitespace removed.",
    })

    static stringReplaceComment = () => lm({
        "de": "Ersetzt alle Vorkommen von **target** durch **replacement** und gibt die entstandene Zeichenkette zurück. Die Zeichenkette selbst wird nicht verändert.",
        "en": "Replaces each substring of this string that matches the literal target sequence with the specified literal replacement sequence.",
    })

    static stringReplaceAllComment = () => lm({
        "de": "Durchsucht den String mit dem regulären Ausdruck (regex) und ersetzt **alle** Fundstellen durch **replacement**.",
        "en": "Replaces each substring of this string that matches the given regular expression with the given replacement.",
    })

    static stringMatchesComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der Wert der Zeichenkette dem regulären Ausdruck (regex) entspricht.",
        "en": "Tells whether or not this string matches the given regular expression.",
    })

    static stringReplaceFirstComment = () => lm({
        "de": "Durchsucht den String mit dem regulären Ausdruck (regex) und ersetzt **die erste** Fundstelle durch **replacement**.",
        "en": "Replaces the first substring of this string that matches the given regular expression with the given replacement.",
    })

    static stringSplitComment = () => lm({
        "de": "Teilt die Zeichenkette an den Stellen, die durch den regulären Ausdruck (regex) definiert sind, in Teile auf. Die Fundstellen des regex werden dabei weggelassen. Gibt die Teile als String-Array zurück.",
        "en": "Splits this string around matches of the given regular expression.",
    })

    static hashCodeComment = () => lm({
        "de": "Gibt den Hashcode des String zurück. Er wird wie folgt berechnet: s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]. Dabei ist s[i] das i-te Zeichen des Strings.",
        "en": "Returns a hash code for this string. The hash code for a String object is computed as s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]",
    })

    static stringToCharArrayComment = () => lm({
        "de": "Wandelt den String in ein char[] um.",
        "en": "Converts given String to char[].",
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
     * Class Arc
     */

    static ArcClassComment = () => lm({
        "de": "Kreisbogenumriss (wahlweise gefüllt)",
        "en": "Arc (filled/not filled)",
    })

    static ArcConstructorComment = () => lm({
        "de": "Instanziert einen neuen Kreisbogen. (mx, my) ist der Mittelpunt, ri sein Innenradius, ra sein Außenradius. Der Kreisbogen wird von startAngle bis endAngle (beides in Grad) gegen den Uhrzeigersinn gezogen.",
        "en": "Creates a new Arc. (mx, my) is it's center, ri it's inner radius, ra it's outer radius. The arc will be drawn from startAngle up to endAngle (both in degrees) counterclockwise.",
    })

    static ArcSetInnerRadiusComment = () => lm({
        "de": "Setzt den Innenradius des Kreisbogens.",
        "en": "Sets inner radius of arc.",
    })

    static ArcSetOuterRadiusComment = () => lm({
        "de": "Setzt den Außenradius des Kreisbogens.",
        "en": "Sets outer radius of arc.",
    })

    static ArcSetStartAngleComment = () => lm({
        "de": "Setzt den Startwinkel des Kreisbogens (in Grad).",
        "en": "Sets start angle of arc (in degrees).",
    })

    static ArcSetEndAngleComment = () => lm({
        "de": "Setzt den Endwinkel des Kreisbogens (in Grad).",
        "en": "Sets end angle of arc (in degrees).",
    })

    static ArcGetInnerRadiusComment = () => lm({
        "de": "Liefert den Innenradius des Kreisbogens.",
        "en": "Gets inner radius of arc.",
    })

    static ArcGetOuterRadiusComment = () => lm({
        "de": "Liefert den Außenradius des Kreisbogens.",
        "en": "Gets outer radius of arc.",
    })

    static ArcGetStartAngleComment = () => lm({
        "de": "Liefert den Startwinkel des Kreisbogens (in Grad).",
        "en": "Gets start angle of arc (in degrees).",
    })

    static ArcGetEndAngleComment = () => lm({
        "de": "Liefert den Endwinkel des Kreisbogens (in Grad).",
        "en": "Gets end angle of arc (in degrees).",
    })

    static ArcCopyComment = () => lm({
        "de": "Erstellt eine Kopie des arc-Objekts und git sie zurück.",
        "en": "Creates a exact copy of this arc object and returns it.",
    })
    
    /**
     * class Text
     */
    static TextClassComment = () => lm({
        "de": "Text, der innerhalb der Grafikausgabe dargestellt werden kann",
        "en": "Text inside graphic panel",
    })

    static TextEmptyConstructorComment = () => lm({
        "de": "Instanziert ein neues Textobjekt. Der Textanker (default: links oben) liegt bei (0, 0).",
        "en": "Creates a new Text object. It's anchor (default: top left) is positioned at (0, 0).",
    })

    static TextConstructorComment1 = () => lm({
        "de": "Instanziert ein neues Textobjekt. (x, y) sind die Koordinaten des Textankers (default: links oben), fontsize die Höhe des Textes in Pixeln.",
        "en": "Creates a new Text object. (x, y) is it's anchor's position, fontSize it's height in pixels.",
    })

    static TextCopyComment = () => lm({
        "de": "Erstellt eine Kopie dieses Text-Objekts",
        "en": "Creates a copy of this text object",
    })

    static TextSetFontsizeComment = () => lm({
    "de": "Setzt die Schriftgröße des Textes (Einheit: Pixel).",
    "en": "Sets fontsize of text (unit: pixels).",
    })

    static TextSetAlignmentComment = () => lm({
    "de": "Setzt die Ausrichtung des Textes, z.B. Alignment.center, Alignment.right.",
    "en": "Sets Alignment of text, e.g. Alignment.center, Alignment.right.",
    })

    static TextSetTextComment = () => lm({
    "de": "Setzt den Text dieses graphischen Text-Objektes.",
    "en": "Sets text of this graphical Text object.",
    })

    static TextGetWidthComment = () => lm({
    "de": "Gibt die Breite des Textes zurück.",
    "en": "Returns width of this text.",
    })

    static TextGetHeightComment = () => lm({
    "de": "Gibt die Höhe des Textes zurück.",
    "en": "Returns height of this text.",
    })

    static TextGetFontsizeComment = () => lm({
    "de": "Gibt die Schriftgröße zurück.",
    "en": "Returns fontsize.",
    })

    static TextGetTextComment = () => lm({
    "de": "Gibt den Textinhalt zurück.",
    "en": "Returns text content (as string).",
    })

    static TextSetStyleComment = () => lm({
    "de": "Setzt den Stil des Textes: isBold (Fettschrift) und isItalic (Schrägschrift).",
    "en": "Sets style of this text (bold, italic).",
    })

    static TextMoveToComment = () => lm({
    "de": "Verschiebt das Grafikobjekt so, dass sich sein 'Mittelpunkt' an den angegebenen Koordinaten befindet.",
    "en": "Moves this text object. After moving it's 'center' lies at given coordinates.",
    })

    /**
     * Enum Alignment
     */

    static AlignmentEnumComment = () => lm({
    "de": "Ausrichtung",
    "en": "Alignment",
    })

    /**
     * Class Sector
     */

    static SectorClassComment = () => lm({
        "de": "Kreisbogen/Kreissektor",
        "en": "Sector",
    })

    static SectorConstructorComment = () => lm({
        "de": "Instanziert einen neuen Kreisbogen. (mx, my) ist der Mittelpunt, ri sein Innenradius, ra sein Außenradius. Der Kreisbogen wird von startAngle bis endAngle (beides in Grad) gegen den Uhrzeigersinn gezogen.",
        "en": "Creates a new Sector. (mx, my) is it's center, ri it's inner radius, ra it's outer radius. The sector will be drawn from startAngle up to endAngle (both in degrees) counterclockwise.",
    })

    static SectorSetRadiusComment = () => lm({
        "de": "Setzt den Innenradius des Kreisbogens.",
        "en": "Sets inner radius of sector.",
    })

    static SectorSetOuterRadiusComment = () => lm({
        "de": "Setzt den Außenradius des Kreisbogens.",
        "en": "Sets outer radius of sector.",
    })

    static SectorSetStartAngleComment = () => lm({
        "de": "Setzt den Startwinkel des Kreisbogens (in Grad).",
        "en": "Sets start angle of sector (in degrees).",
    })

    static SectorSetEndAngleComment = () => lm({
        "de": "Setzt den Endwinkel des Kreisbogens (in Grad).",
        "en": "Sets end angle of sector (in degrees).",
    })

    static SectorGetRadiusComment = () => lm({
        "de": "Liefert den Innenradius des Kreisbogens.",
        "en": "Gets inner radius of sector.",
    })

    static SectorGetOuterRadiusComment = () => lm({
        "de": "Liefert den Außenradius des Kreisbogens.",
        "en": "Gets outer radius of sector.",
    })

    static SectorGetStartAngleComment = () => lm({
        "de": "Liefert den Startwinkel des Kreisbogens (in Grad).",
        "en": "Gets start angle of sector (in degrees).",
    })

    static SectorGetEndAngleComment = () => lm({
        "de": "Liefert den Endwinkel des Kreisbogens (in Grad).",
        "en": "Gets end angle of sector (in degrees).",
    })

    static SectorDrawRadiiComment = () => lm({
        "de": "Legt fest, ob beim Zeichnen des Umrisses auch die beiden Radii ( = Strecken vom Mittelpunkt zur Kreislinie) mitgezeichnet werden sollen.",
        "en": "Set to true if drawn border should also contain the radii ( = lines from center to the arc perimeter )",
    })

    static SectorCopyComment = () => lm({
        "de": "Erstellt eine Kopie des sector-Objekts und git sie zurück.",
        "en": "Creates a exact copy of this sector object and returns it.",
    })

    /**
     * Class Polygon
     */

    static PolygonClassComment = () => lm({
        "de": "Polygon",
        "en": "polygon",
    })

    static PolygonEmptyConstructorComment = () => lm({
        "de": "Instanziert ein neues Polygon. Der Standardkonstruktor ohne Parameter instanziert ein regelmäßiges Sechseck. \nTipp: Es gibt auch Konstruktoren, denen man ein Array von Koordinaten bzw. einzelne Koordinaten übergeben kann!",
        "en": "Creates a polygon. The parameterless constructor creates a regular hexagon. \nHint: There are constructors that take (an array of) coordinates.",
    })

    static PolygonConstructor1Comment = () => lm({
        "de": "Instanziert ein neues Polygon. Die Punkte werden als Array von double-Werten der Form {x1, y1, x2, y2, ...} übergeben.",
        "en": "Creates a polygon. Points are given as array of double-values in this order: {x1, y1, x2, y2, ...}",
    })

    static PolygonConstructor2Comment = () => lm({
        "de": "Instanziert ein neues Polygon. Die Punkte werden als double-Werte der Form x1, y1, x2, y2, ... übergeben.",
        "en": "Creates a polygon. Points are given as double-values in this order: x1, y1, x2, y2, ...",
    })

    static PolygonConstructorShapeComment = () => lm({
        "de": "Instanziert ein neues Polygon. Seine Punkte sind die Punkte des Hitpolygons der übergebenen Figur.",
        "en": "Creates a polygon based on given shape's hitpolygon.",
    })

    static PolygonCopyComment = () => lm({
        "de": "Erstellt eine Kopie des polygon-Objekts und git sie zurück.",
        "en": "Creates a exact copy of this polygon object and returns it.",
    })

    static PolygonAddPointComment = () => lm({
        "de": "Fügt dem Polygon einen Punkt hinzu.",
        "en": "Adds a point to the polygon.",
    })

    static PolygonSetPointsComment = () => lm({
        "de": "Löscht alle Punkte des Polygons und setzt komplett neue. Diese werden in einem double[] übergeben, das abwechselnd die x- und y-Koordinaten enthält.",
        "en": "Remove all points from polygon and replace them by given ones. Given double-array contains alternating x- and y-coordinates.",
    })


    static PolygonAddPointsComment = () => lm({
        "de": "Fügt dem Polygon mehrere Punkte hinzu. Diese werden in einem double[] übergeben, das abwechselnd die x- und y-Koordinaten enthält.",
        "en": "Add given points to polygon. Given double-array contains alternating x- and y-coordinates.",
    })

    static PolygonInsertPointComment = () => lm({
        "de": "Fügt dem Polygon einen Punkt als 'index-ter' Punkt hinzu. index == 0 => ganz am Anfang; index == Anzahl der bisherigen Punkte => ganz am Ende;",
        "en": "Insert point on given index into polygon. Index == 0 means 'at the beginning', index == number of points means 'at the end'.",
    })

    static PolygonMovePointToComment = () => lm({
        "de": 'Verschiebt Punkt mit dem angegebenen Index nach (x, y). Index == 0 => erster Punkt, index == 1 => zweiter Punkt usw.',
        "en": "Moves point with given index to position (x, y). Index == 0 means 'at the beginning', index == number of points means 'at the end'.",
    })

    static PolygonCloseComment = () => lm({
        "de": "Schließt das Polygon, indem es den ersten und letzten Punkt mit einer Strecke verbindet. Diese Methode hat bei gefüllten Polygonen keinen Effekt.",
        "en": "Closes polygon by joining first and last point with a straight line. This method does nothing when polygon is filled.",
    })

    static PolygonOpenComment = () => lm({
        "de": "Öffnet das Polygon, indem des die Strecke zwischen erstem und letzem Punkt entfernt. Diese Methode hat bei gefüllten Polygonen keinen Effekt.",
        "en": "Opens polygon by removing the line between first and last point. This method does nothing when polygon is filled.",
    })

    /**
     * Class ellipse
     */

    static EllipseClassComment = () => lm({
        "de": "Ellipse",
        "en": "ellipse",
    })

    static EllipseEmptyConstructorComment = () => lm({
        "de": "Instanziert einen neuen Ellipse mit Mittelpunkt (200, 100) und den Radien 100 und 50.",
        "en": "Creates a new ellipse object with center at (200, 100) and radii 100, 50.",
    })

    static EllipseConstructorComment = () => lm({
        "de": "Instanziert eine neuen Ellipse. (mx, my) ist der Mittelpunt, rx ihr Radius in x-Richtung, ry ihr Radius in y-Richtung.",
        "en": "Creates a new ellipse object with center at (mx, my) and given radii in rx, ry.",
    })

    static EllipseSetRadiusXComment = () => lm({
        "de": "Setzt den Radius der Ellipse in X-Richtung.",
        "en": "Set radius of ellipse in x-direction.",
    })

    static EllipseSetRadiusYComment = () => lm({
        "de": "Setzt den Radius der Ellipse in Y-Richtung.",
        "en": "Set radius of ellipse in y-direction.",
    })

    static EllipseGetRadiusXComment = () => lm({
        "de": "Gibt den x-Radius der Ellipse zurück.",
        "en": "Gets x-radius.",
    })

    static EllipseGetRadiusYComment = () => lm({
        "de": "Gibt den y-Radius der Ellipse zurück.",
        "en": "Gets y-radius.",
    })

    static EllipseCopyComment = () => lm({
        "de": "Erstellt eine Kopie des ellipse-Objekts und git sie zurück.",
        "en": "Creates a exact copy of this ellipse object and returns it.",
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
     * class Triangle
     */
    static TriangleClassComment = () => lm({
        "de": "Dreieck",
        "en": "triangle",
    })

    static TriangleConstructorComment = () => lm({
        "de": "Erstellt ein Dreieck mit den gegebenen drei Eckpunkten.",
        "en": "Creates a triangle from given points.",
    })

    static TriangleCopyComment = () => lm({
        "de": "Erstellt eine Kopie des Dreiecks.",
        "en": "Creates a copy of this triangle.",
    })

    /**
     * class Line
     */

    static LineClassComment = () => lm({
        "de": "Die Klasse Line repräsentiert eine Strecke",
        "en": "Line",
    })

    static LineEmptyConstructorComment = () => lm({
        "de": "Erstellt eine gerade Strecke vom Punkt (0, 0) zum Punkt (100, 100).",
        "en": "Creates a straight line from (0, 0) to (100, 100).",
    })

    static LineConstructorComment1 = () => lm({
        "de": "Erstellt eine gerade Strecke von (x1, y1) nach (x2, y2).",
        "en": "Creates a straight line from (x1, y1) to (x2, y2).",
    })

    static LineCopyComment = () => lm({
        "de": "Erstellt eine Kopie der Linie.",
        "en": "Creates a copy of this line.",
    })

    /**
     * class Bitmap
     */
    static BitmapClassComment = () => lm({
        "de": "Rechteckige Bitmap in der Grafikausgabe",
        "en": "Rectangular Bitmap",
    })

    static BitmapConstructorComment = () => lm({
        "de": "Instanziert eine neue Bitmap. pointsX bzw. pointsY bezeichnet Anzahl der Bildpunkte in x bzw. y-Richtung, (left, top) sind die Koordinaten der linken oberen Ecke.",
        "en": "Creates a new Bitmap. pointsX and pointsY are it's resolution, (left, top) is it's top-left corner.",
    })

    static BitmapCopyComment = () => lm({
        "de": "Erzeugt eine Kopie dieser Bitmap.",
        "en": "Creates a copy of this bitmap.",
    })

    static BitmapCoordinatesOutOfBoundsException = (x: number, y: number, maxX: number, maxY: number) => lm({
        "de": `Die Koordinaten x: ${x}, y: ${y} liegen außerhalb der Bitmap mit der Auflösung ${maxX}, ${maxY}.`,
        "en": `Coordinates x: ${x}, y: ${y} are out of bounds ${maxX}, ${maxY}.`,

    })

    static BitmapSetColorComment = () => lm({
        "de": "Setzt die Farbe des angegebenen Bildpunkts auf der Bitmap.",
        "en": "Sets color of given point on Bitmap.",
    })


    static BitmapGetColorComment = () => lm({
        "de": "Gibt die Farbe des angegebenen Punktes als Color-Objekt zurück.",
        "en": "Returns color of given point as Color-object.",
    })

    static BitmapIsColorComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn die Farbe am angegebenen Punkt (x,y) mit der übergebenen Farbe übereinstimmt.",
        "en": "Returns true if and only if color at point (x, y) matches given color.",
    })

    static BitmapFillAllComment = () => lm({
        "de": "Füllt die ganze Bitmap mit der angegebenen Farbe.",
        "en": "Fills whole Bitmap with given color.",
    })

    /**
     * enum Direction
     */

    static DirectionEnumComment = () => lm({
        "de": "Richtung (top, right, bottom, left)",
        "en": "Direction (top, right, bottom, left)",
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

    /**
     * Comparable
     */
    static comparableInterfaceComment = () => lm({
        "en": "This interface imposes a total ordering on the objects of each class that implements it. This ordering is referred to as the class's natural ordering, and the class's compareTo method is referred to as its natural comparison method.\nLists (and arrays) of objects that implement this interface can be sorted automatically by Collections.sort (and Arrays.sort). Objects that implement this interface can be used as keys in a sorted map or as elements in a sorted set, without the need to specify a comparator.",
        "de": "Klassen, die dieses Interface implementieren, haben eine Methode compareTo, mit der sich zwei Objekte der Klasse vergleichen lassen.",
    })

    static comparableCompareToComment = () => lm({
        "de": "Vergleicht das Objekt mit dem übergebenen Objekt. Liefert eine negative Zahl zurück, wenn das Objekt 'kleiner' ist als das übergebene, eine positive, falls es größer ist und 0, wenn beide Objekte gleich sind.",
        "en": "Compares this object with the specified object for order. Returns a negative value if this object is 'smaller' than the specified object, a positive value if it is 'larger' and 0 if they are equal.",
    })

    /**
     * Comparator
     */
    static comparatorInterfaceComment = () => lm({
        "de": "A Comparator<T> is a object that can compare objects of class T.",
        "en": "A comparison function, which imposes a total ordering on some collection of objects.",
    })

    static compataratorCompareComment = () => lm({
        "de": "Vergleicht die zwei angegebenen Objekte. Gibt eine negative Zahl zurück, falls das erste 'kleiner' ist als das zweite, eine positive Zahl, falls es 'größer' ist und 0 falls die beiden Objekte 'gleich' sind.",
        "en": "Compares its two arguments for order. Returns a negative value if the first object is 'smaller' than the second, a positive value if it is 'larger' than the second one and 0 if they are 'equal'.",
    })

    /**
     * Iterable
     */
    static iterableInterfaceComment = () => lm({
        "de": "Objekte von Klassen, die dieses Interface implementieren, können in einer vereinfachten for-loop (for(object o: list){...}) verwendet werden.",
        "en": "Implementing this interface allows an object to be the target of the 'for-each loop' statement. See For-each Loop",
    })

    static iterableIteratorComment = () => lm({
        "de": "Gibt ein Iterator-Objekt für dieses Iterable-Objekt zurück.",
        "en": "Returns an iterator over elements of type T.",
    })

    static iterableForEachComment = () => lm({
        "de": "Führt die angegebene Aktion für jedes Element dieses Iterable-Objekts aus.",
        "en": "Performs the given action for each element of the Iterable until all elements have been processed.",
    })

    /**
     * Iterator
     */

    static iteratorInterfaceComment = () => lm({
        "de": "Ein Iterator ist ein Objekt, das die Elemente einer Liste der Reihe nach einzeln liefern kann.",
        "en": "An Iterator can return all objects of a list one at a time.",
    })

    static iteratorHasNextComment = () => lm({
        "de": "Liefert true zurück falls es noch weitere Elemente gibt, die mit der Methoe next() abgerufen werden können.",
        "en": "Returns true if the iteration has more elements.",
    })

    static iteratorNextComment = () => lm({
        "de": "Liefert das nächste Element.",
        "en": "Returns the next element of the iteration.",
    })

    /**
     * Math
     */
    static mathPIComment = () => lm({
        "de": "Die Zahl Pi (3.14159...) in double-Genauigkeit (ca. 15 Nachkommastellen)",
        "en": "Number Pi (3.14159...) in double precision (around 15 digits)",
    })

    static mathEComment = () => lm({
        "de": "Die Zahl e (2.718281828459045...) in double-Genauigkeit (ca. 15 Nachkommastellen)",
        "en": "Number e (2.718281828459045...) in double precision (around 15 digits)",
    })

    static mathAbsComment = () => lm({
        "de": "Betrag der übergebenen Zahl",
        "en": "Absolute value of given number",
    })

    static mathSinComment = () => lm({
        "de": "Sinus des übergebenen Winkels (im Bogenmaß)",
        "en": "Sine of given angle (in radians)",
    })

    static mathCosinComment = () => lm({
        "de": "Cosinus des übergebenen Winkels (im Bogenmaß)",
        "en": "Cosine of given angle (in radians)",
    })

    static mathTanComment = () => lm({
        "de": "Tangens des übergebenen Winkels (im Bogenmaß)",
        "en": "Tangens of given angle (in radians)",
    })

    static mathArcsinComment = () => lm({
        "de": "Arcussinus der übergebenen Zahl",
        "en": "Arc sine of given number",
    })

    static mathArccosComment = () => lm({
        "de": "Arcuscosinus der übergebenen Zahl",
        "en": "Arc cosinus of given number",
    })

    static mathArctanComment = () => lm({
        "de": "Arcustangens der übergebenen Zahl",
        "en": "Arc tan of given number",
    })

    static mathAtan2Comment = () => lm({
        "de": "Gibt den Winkel (im Bogenmaß) von der positiven x-Achse aus zum Vektor (x/y) zurück.",
        "en": "Returns angle (in radians) from positive x-axis to vector (x/y).",
    })

    static mathRoundComment = () => lm({
        "de": "Rundet die übergebene Zahl auf eine ganze Zahl. Ab '...,5' wird aufgerundet.",
        "en": "Rounds given number.",
    })

    static mathFloorComment = () => lm({
        "de": "Rundet die übergebene Zahl auf eine ganze Zahl ab, d.h. aus 45.9 wird beispielsweise 45.",
        "en": "Rounds given number down.",
    })

    static mathCeilComment = () => lm({
        "de": "Rundet die übergebene Zahl auf eine ganze Zahl auf, d.h. aus 45.1 wird beispielsweise 46.",
        "en": "Rounds given number up.",
    })

    static mathSignComment = () => lm({
        "de": "Vorzeichen einer Zahl, d.h. -1 falls die Zahl negativ ist, +1 falls die Zahl positiv ist und 0, falls die Zahl 0 ist.",
        "en": "Sign of the given number: -1 if number is less then 0, +1 if number is > 0 and 0 if number is 0.",
    })

    static mathSqrtComment = () => lm({
        "de": "Quadratwurzel der Zahl",
        "en": "Square root of given number",
    })

    static mathRandomComment = () => lm({
        "de": "Zufallszahl aus dem Bereich [0; 1[",
        "en": "Random number out of [0; 1[",
    })

    static mathPowComment = () => lm({
        "de": "Potenz 'Basis hoch Exponent'",
        "en": "base to the power of exponent",
    })

    static mathToDegreesComment = () => lm({
        "de": "Wandelt den übergebenen Winkel vom Bogenmaß ins Gradmaß um, d.h. berechnet angle/pi * 180.",
        "en": "Transforms given angle from radians to degrees.",
    })

    static mathToRadiansComment = () => lm({
        "de": "Wandelt den übergebenen Winkel vom Gradmaß ins Bogenmaß um, d.h. berechnet angle/180 * pi.",
        "en": "Transforms given angle from degrees to radians.",
    })

    static mathExpComment = () => lm({
        "de": "Berechnet 'e hoch zahl'",
        "en": "Calculates 'e to the power of given number'",
    })

    static mathLogComment = () => lm({
        "de": "Berechnet den natürlichen Logarithmus der Zahl",
        "en": "Returns the natural logarithm (base e) of a double value.",
    })

    static mathLog10Comment = () => lm({
        "de": "Berechnet den Logarithmus der Zahl zur Basis 10.",
        "en": "Returns the base 10 logarithm of a double value.",
    })

    static mathMaxComment = () => lm({
        "de": "Gibt die größere der beiden Zahlen zurück.",
        "en": "Returns the greater of two values.",
    })

    static mathMinComment = () => lm({
        "de": "Gibt die kleinere der beiden Zahlen zurück.",
        "en": "Returns the smaller of two values.",
    })


    /**
     * Random
     */
    static RandomClassComment = () => lm({
        "de": "Die Klasse Random stellt Methoden zur Erzeugung von Zufallszahlen zur Verfügung.",
        "en": "Class Random provides methods to generate random numbers.",
    })

    static randomRandIntComment = () => lm({
        "de": "Gibt eine ganze Zufallszahl aus dem Bereich {from, from + 1, ... , to} zurück.",
        "en": "Returns a natural random value out of {from, from + 1, ... , to}.",
    })

    static randomRandDoubleComment = () => lm({
        "de": "Gibt eine ganze Zufallszahl aus dem Bereich [from, to[ zurück.",
        "en": "Returns a natural random value out of [from, to[.",
    })

    static randomNextIntComment = () => lm({
        "de": "Gibt eine ganzzahlige Zufallszahl aus der Menge {0, 1, ..., bound - 1} zurück.",
        "en": "Returns a natural number out of {0, 1, ..., bound - 1}.",
    })

    /**
     * DecimalFormat
     */
    static DecimalFormatClassComment = () => lm({
        "de": "Die Klasse DecimalFormat wird zum Formatieren von Zahlen genutzt.",
        "en": "Class DecimalFormat provides methods to format numbers.",
    })

    static decimalFormatConstructorComment = () => lm({
        "de": "Erzeugt ein neues DecimalFormat-Object. Zur Bedeutung von format siehe https://docs.oracle.com/javase/8/docs/api/java/text/DecimalFormat.html",
        "en": "Creates a new DecimalFormat object. For possible values for format see https://docs.oracle.com/javase/8/docs/api/java/text/DecimalFormat.html",
    })

    static decimalFormatFormatComment = () => lm({
        "de": "Die Methode Format gibt die Zahl formatiert als String zurück.",
        "en": "Formats a number to produce a string.",
    })

    /**
     * Optional
     */
    static optionalClassComment = () => lm({
        "de": "Ein Container-Objekt das einen Nicht-null-Wert enthalten kann oder auch nicht. Falls es eine Wert enthält liefert isPresent() true und get() den Wert.",
        "en": "A container object which may or may not contain a non-null value. If a value is present, isPresent() will return true and get() will return the value.",
    })

    static optionalEmptyComment = () => lm({
        "de": "Gibt ein leeres Optional-Objekt zurück.",
        "en": "Returns an empty Optional instance.",
    })

    static optionalEqualsComment = () => lm({
        "de": `Gibt genau dann true zurück, wenn beide Optional-Objekte leer sind oder wenn die enthaltenen Objekte gleich sind, ausgehend von deren equals-Funktion.`,
        "en": `Indicates whether some other object is "equal to" this Optional. The other object is considered equal if:
    it is also an Optional and;
    both instances have no value present or;
    the present values are "equal to" each other via equals().`,
    })

    static optionalIsEmptyComment = () => lm({
        "de": "Gibt genau dann zurück, wenn im Optional-Objekt kein Wert enthalten ist.",
        "en": "If a value is not present, returns true, otherwise false.",
    })

    static optionalMapComment = () => lm({
        "de": "Wenn das Optional-Objekt einen Wert enthält liefert diese Methode Optional.of(f(Wert)) zurück, ansonsten ein leeres Optional-Objekt.",
        "en": "If a value is present, returns an Optional describing (as if by ofNullable(T)) the result of applying the given mapping function to the value, otherwise returns an empty Optional.",
    })

    static optionalFlatMapComment = () => lm({
        "de": "Wenn das Optional-Objekt einen Wert enthält liefert diese Methode f(Wert) zurück, ansonsten ein leeres Optional-Objekt.",
        "en": "If a value is present, returns the result of applying the given Optional-bearing mapping function to the value, otherwise returns an empty Optional.",
    })

    static optionalOfComment = () => lm({
        "de": "Gibt ein Optional-Objekt zurück das den gegebenen (von null verschiedenen) Wert enthält.",
        "en": "Returns an Optional describing the given non-null value.",
    })

    static optionalOrElseComment = () => lm({
        "de": "Wenn das Optional-Objekt einen Wert enthält liefert die Methode diesen zurück, ansonsten den übergebenen Wert t.",
        "en": "If a value is present, returns the value, otherwise returns other.",
    })

    static optionalIfPresentComment = () => lm({
        "de": "Wenn das Optional-Objekt einen Wert enthält wird damit die übergebene Aktion ausgeführt, ansonsten wird nichts gemacht.",
        "en": "If a value is present, performs the given action with the value, otherwise does nothing.",
    })

    static optionalToStringComment = () => lm({
        "de": "Gibt eine nichtleere String-Darstellung des Optional-Objekts zurück, passend zum Debuggen.",
        "en": "Returns a non-empty string representation of this Optional suitable for debugging.",
    })


    /**
     * Runnable
     */
    static RunnableInterfaceComment = () => lm({
        "de": "Das Runnable-Interface wird von Klassen implementiert, die eine Methode run() besitzen, die in einem neuen Thread ausgeführt werden soll.",
        "en": "The Runnable interface should be implemented by any class whose instances are intended to be executed by a thread. The class must define a method of no arguments called run.",
    })

    static runnableRunComment = () => lm({
        "de": "WEnn ein Objekt, das das Interface Runnable implementiert, benutzt wird, um einen Thread zu erstellen, bewirkt das Starten des Threads die Ausführung der run()-Methode in diesem Thread.",
        "en": "When an object implementing interface Runnable is used to create a thread, starting the thread causes the object's run method to be called in that separately executing thread.",
    })

    /**
     * Semaphore
     */
    static semaphoreClassComment = () => lm({
        "de": "Ein zählender Semaphor",
        "en": "A counting semaphore. Conceptually, a semaphore maintains a set of permits. Each acquire() blocks if necessary until a permit is available, and then takes it. Each release() adds a permit, potentially releasing a blocking acquirer. ",
    })

    static semaphoreConstructorComment = () => lm({
        "de": "Erstellt einen Semaphor mit der angegebenen Zahl von Permits.",
        "en": "Creates a Semaphore with the given number of permits.",
    })

    static semaphoreAvailablePermitsComment = () => lm({
        "de": "Gibt die Anzahl an Permits zurück, die in diesem Semaphor aktuell vorhanden ist.",
        "en": "Returns the current number of permits available in this semaphore.",
    })

    static semaphoreAquireComment = () => lm({
        "de": "Beschafft ein Permit. Falls keines vorhanden sind wird der Thread blockiert. Der Thread bleibt blockiert bis wieder ein Permit vorhanden ist oder der Thread unterbrochen (interrupted) wird.",
        "en": "Acquires a permit from this semaphore, blocking until one is available, or the thread is interrupted.",
    })

    static semaphoreReleaseComment = () => lm({
        "de": "Gibt ein Permit frei und führt es dem Semaphor wieder zu.",
        "en": "Releases a permit, returning it to the semaphore.",
    })


    /**
     * Thread
     */
    static threadClassComment = () => lm({
        "de": "Ein Thread ist ein 'Ausführungsstrang' in einem Programm. Die Online IDE ermöglicht die gleichzeitige Ausführung mehrerer Threads.",
        "en": "A thread is a thread of execution in a program. The Online IDE allows an application to have multiple threads of execution running concurrently.",
    })

    static threadConstructorComment = () => lm({
        "de": "Erstellt ein neues Thread-Objekt, startet den Thread aber noch nicht.",
        "en": "Creates a new Thread object.",
    })

    static threadConstructorRunnableComment = () => lm({
        "de": "Erstellt ein neues Thread-Objekt. Wird der Thread gestartet, so wird die run()-Methode des übergebenen Runnable-Objekts ausgeführt.",
        "en": "Creates a new Thread object. When starting this thread method run() of given Runnable-object ist called concurrently to the existing threads.",
    })

    static threadGetStateComment = () => lm({
        "de": "Gibt den state des threads zurück.",
        "en": "Returns the state of this thread.",
    })

    static threadRunComment = () => lm({
        "de": "Führt die run()-Methode des bei diesem Thread gespeicherten Runnable-Objekts im AKTUELLEN thread aus. Die Wirkung ist dieselbe, als würde man die run()-Methode des Runnable-Objekts einfach aufrufen.",
        "en": "Calls run()-Method of this thread's Runnable object in CURRENT thread.",
    })

    static threadStartComment = () => lm({
        "de": "Führt die run()-Methode des bei diesem Thread gespeicherten Runnable-Objekts nebenläufig (parallel) zum aktuellen Thread aus.",
        "en": "Runs the run()-Method of this thread's runnable object CONCURRENTLY to the current thread.",
    })

    static threadJoinComment = () => lm({
        "de": "Wartet bis der Thread beendet (terminated) ist.",
        "en": "Waits for this thread to die (state: terminated).",
    })

    static threadJoinComment2 = () => lm({
        "de": "Wartet bis der Thread beendet (terminated) ist, längstens aber die übergebene Zahl an Millisekunden.",
        "en": "Waits for this thread to die (state: terminated), at most given milliseconds.",
    })

    static threadGetNameComment = () => lm({
        "de": "Gibt den Namen des Threads zurück.",
        "en": "Returns the name of this thread.",
    })

    static threadSetNameComment = () => lm({
        "de": "Ändert den Namen dieses Threads.",
        "en": "Sets the name of this thread.",
    })

    static threadSetSpeedComment = () => lm({
        "de": "Setzt die gewünschte Ausführungsgeschwindigkeit des Threads in Schritten/Sekunde. Werte <= 0 bewirken die Ausführung mit maximaler Geschwidigkeit.",
        "en": "Sets speed of thread in steps/second. Values <= 0 mean 'maximum speed'.",
    })



    // Kürzel: mlc

}            
