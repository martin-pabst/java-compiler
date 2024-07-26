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

    static shapeSetAngleComment = () => lm({
        "de": "Dreht das Objekt hin zur angegebenen Richtung (in Grad)",
        "en": "Rotates object to given angle.",
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
     * enum DayOfWeek
     */
    static DayOfWeekEnumComment = () => lm({
        "de": "Wochentag",
        "en": "day of week",
    })

    static DayOfWeekMondayConst = () => lm({
        "de": "Montag",
        "en": "Monday",
    })

    static DayOfWeekTuesdayConst = () => lm({
        "de": "Dienstag",
        "en": "Tuesday",
    })

    static DayOfWeekWednesdayConst = () => lm({
        "de": "Mittwoch",
        "en": "Wednesday",
    })

    static DayOfWeekThursdayConst = () => lm({
        "de": "Donnerstag",
        "en": "Thursday",
    })

    static DayOfWeekFridayConst = () => lm({
        "de": "Freitag",
        "en": "Friday",
    })

    static DayOfWeekSaturdayConst = () => lm({
        "de": "Samstag",
        "en": "Saturday",
    })

    static DayOfWeekSundayConst = () => lm({
        "de": "Sonntag",
        "en": "Sunday",
    })

    /**
     * class LocalDateTime
     */
    static LocalDateTimeClassComment = () => lm({
        "de": "Ein LocalDate-Objekt speichert einen Zeitpunkt (Datum und Uhrzeit) und kann auch die Systemzeit auslesen.",
        "en": "LocalDateTime is an immutable date-time object that represents a date-time, often viewed as year-month-day-hour-minute-second.",
    })

    static LocalDateTimeEmptyConstructorComment = () => lm({
        "de": "Holt den aktuellen Zeitpunkt von der Systemuhr des Rechners und gibt ihn als LocalDateTime-Objekt zurück.",
        "en": "Fetches current timestamp from system clock and returns it as LocalDateTime-Object",
    })

    static LocalDateTimeNowComment = () => lm({
        "de": "Holt den aktuellen Zeitpunkt von der Systemuhr des Rechners und gibt ihn als LocalDateTime-Objekt zurück.",
        "en": "Fetches current timestamp from system clock and returns it as LocalDateTime-Object",
    })

    static LocalDateTimeOfComment = () => lm({
        "de": "Gibt ein LocalDateTime-Objekt zurück, das den durch year, month (1 - 12), dayOfMonth, hour, minute, second beschriebenen Zeitpunkt repräsentiert.",
        "en": "Returns a new LocalDateTime-object given by year, month (1 - 12), dayOfMonth, hour, minute and second.",
    })

    static LocalDateTimePlusDaysComment = () => lm({
        "de": "Gibt ein neues LocalDateTime-Objekt zurück, das einen Zeitpunkt repräsentiert, der um die übergebene Anzahl von Tagen später liegt.",
        "en": "Returns a NEW LocalDateTime-object which timestamp is given days later than this one's.",
    })

    static LocalDateTimeMinusDaysComment = () => lm({
        "de": "Gibt ein neues LocalDateTime-Objekt zurück, das einen Zeitpunkt repräsentiert, der um die übergebene Anzahl von Tagen früher liegt.",
        "en": "Returns a NEW LocalDateTime-object which timestamp is given days prior to this one's.",
    })

    static LocalDateTimeUntilComment = () => lm({
        "de": "Gibt zurück, wie viele Tage (gerundet) zwischen den beiden Zeitpunkten liegen.",
        "en": "",
    })

    static LocalDateTimeGetYearComment = () => lm({
        "de": "Jahr",
        "en": "Year",
    })

    static LocalDateTimeGetMonthComment = () => lm({
        "de": "Gibt den Monat als Zahl zurück (Januar == 1, Februar == 2, ..., Dezember == 12).",
        "en": "Month (January == 1, February == 2, ...)",
    })

    static LocalDateTimeGetDayOfMonthComment = () => lm({
        "de": "Gibt den Tag innerhalb des Monats zurück (Zahl von 1 bis 31).",
        "en": "Day of month (1, ..., 31)",
    })

    static LocalDateTimeGetHourComment = () => lm({
        "de": "Stunde",
        "en": "Hour",
    })

    static LocalDateTimeGetMinuteComment = () => lm({
        "de": "Minute",
        "en": "Minute",
    })

    static LocalDateTimeGetSecondComment = () => lm({
        "de": "Sekunde",
        "en": "Second",
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
     * class Turtle
     */
    static TurtleClassComment = () => lm({
        "de": "Turtle-Klasse zum Zeichnen von Streckenzügen oder gefüllten Figuren. Wichtig sind vor allem die Methoden forward(double length) und turn(double angleDeg), die die Turtle nach vorne bewegen bzw. ihre Blickrichtung ändern.",
        "en": "Turtle class to draw straight lines or filled shapes. Most important methods are forward(double length) and turn(angleInDegrees).",
    })

    static TurtleEmptyConstructorComment = () => lm({
        "de": "Instanziert ein neues Turtle-Objekt ohne Punkte. Die Turtle blickt anfangs nach rechts. Am Ende des Streckenzugs wird eine 'Schildkröte' (kleines Dreieck) gezeichnet.",
        "en": "Creates a new Turtle object without points/lines. Initially the turtle's viewing direction is to the right. A small red triangle shows the turtle's current position. ",
    })

    static TurtleConstructorComment1 = () => lm({
        "de": "Instanziert ein neues Turtle-Objekt ohne Punkte. (x, y) is die Startposition der Turtle. Die Turtle blickt anfangs nach rechts. Am Ende des Streckenzugs wird eine 'Schildkröte' (kleines Dreieck) gezeichnet.",
        "en": "Creates a new Turtle object without points/lines at position (x, y). Initially the turtle's viewing direction is to the right. A small red triangle shows the turtle's current position. ",
    })

    static TurtleConstructorComment2 = () => lm({
        "de": "Instanziert ein neues Turtle-Objekt ohne Punkte. (x, y) is die Startposition der Turtle. Die Turtle blickt anfangs nach rechts. Falls showTurtle == true wird am Ende des Streckenzugs eine 'Schildkröte' (kleines Dreieck) gezeichnet.",
        "en": "Creates a new Turtle object without points/lines at position (x, y). Initially the turtle's viewing direction is to the right. If showTurtle == true a small red triangle shows the turtle's current position. ",
    })

    static TurtleCopyComment = () => lm({
        "de": "Erstellt eine Kopie der Turtle.",
        "en": "Creates a copy of this turtle object.",
    })

    static TurtleForwardComment = () => lm({
        "de": "Weist die Turtle an, die angegebene Länge vorwärts zu gehen. Ihr zurückgelegter Weg wird als gerade Strecke mit der aktuellen BorderColor gezeichnet. Mit setBorderColor(null) bewirkst Du, dass ein Stück ihres Weges nicht gezeichnet wird.",
        "en": "Makes the turtle walk forward given length. While walking it draws a line with current BorderColor. Use setBorderColor(null) to get invisible lines.",
    })

    static TurtleTurnComment = () => lm({
        "de": "Bewirkt, dass sich die Turtle um den angegebenen Winkel (in Grad!) dreht, d.h. ihre Blickrichtung ändert. Ein positiver Winkel bewirkt eine Drehung gegen den Uhrzeigersinn. Diese Methode wirkt sich NICHT auf die bisher gezeichneten Strecken aus. Willst Du alles bisher Gezeichnete inklusive Turtle drehen, so nutze die Methode rotate.",
        "en": "Makes the turtle (NOT the lines drawn by it) turn counterclockwise by given angle in Degrees. If you want to rotate all lines drawn by the turtle, then use method rotate instead.",
    })

    static TurtlePenUpComment = () => lm({
        "de": "Bewirkt, dass die Turtle beim Gehen ab jetzt nicht mehr zeichnet.",
        "en": "After this method call the turtle will stop drawing when it walks.",
    })

    static TurtlePenDownComment = () => lm({
        "de": "Bewirkt, dass die Turtle beim Gehen ab jetzt wieder zeichnet.",
        "en": "After this method call the turtle will restart drawing when it walks.",
    })

    static TurtleCloseAndFillComment = () => lm({
        "de": "closeAndFill == true bewirkt, dass das von der Turtlezeichnung umschlossene Gebiet gefüllt wird.",
        "en": "If closeAndFill == true then the area surronded by the turtle's drawing is filled.",
    })

    static TurtleShowTurtleComment = () => lm({
        "de": "showTurtle == true bewirkt, dass am Ort der Turtle ein rotes Dreieck gezeichnet wird.",
        "en": "If showTurtle == true then a small triangle indicates the turtle's position.",
    })

    static TurtleClearComment = () => lm({
        "de": "Löscht alle bis jetzt mit der Turtle gezeichneten Strecken.",
        "en": "Erases all lines drawn previously.",
    })

    static TurtleCollidesWithBorderColorComment = () => lm({
        "de": 'Gibt genau dann true zurück, wenn sich der "Mittelpunkt" des Turtle-Dreiecks auf dem Rand eines anderen graphischen Objekts mit der angegebenen Farbe befindet.',
        "en": "Returns true if and only if current position of turtle is on the border of another shape with given borderColor.",
    })

    static TurtleGetLastSegmentLengthComment = () => lm({
        "de": "Gibt die Länge des letzten gezeichneten Streckenzugs zurück.",
        "en": "Returns length of last drawn line segment.",
    })

    static TurtleGetXComment = () => lm({
        "de": "Gibt die x-Koordinate der aktuellen Turtleposition zurück.",
        "en": "Returns x-coordinate of current turtle position.",
    })

    static TurtleGetYComment = () => lm({
        "de": "Gibt die y-Koordinate der aktuellen Turtleposition zurück.",
        "en": "Returns y-coordinate of current turtle position.",
    })

    static TurtleMoveToComment = () => lm({
        "de": "Bewirkt, dass die Turtle zum Punkt (x, y) geht.",
        "en": "Makes Turtle walk to position (x, y).",
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
     * Class RoundedRectangle
     */
    static RoundedRectangleClassComment = () => lm({
        "de": "Ein Objekt der Klasse RoundedRectangle zeichnet ein Rechteck in den Grafikbereich.",
        "en": "Objects of class RoundedRectangle draw RoundedRectangles."
    })

    static RoundedRectangleEmptyConstructorComment = () => lm({
        "de": "Instanziert ein Retangle-Objekt mit Standardmaßen. Seine linke obere Ecke liegt bei (0/0). Breite und Höhe betragen jeweils 100. Die Rechteckseiten sind zunächst parallel zu den Koordinatenachsen.",
        "en": "Instantiates a RoundedRectangle object with default geometry. It's left top edge is located at (0/0). Width and height are 100 each. Initial orientation is parallel to x- and y-axis."
    })

    static RoundedRectangleConstructorComment = () => lm({
        "de": "Instanziert ein Retangle-Objekt. Seine linke obere Ecke liegt bei (top/left). Width ist seine Breite, height seine Höhe. Das Rechteck ist zunächst achsenparallel.",
        "en": "Instantiates a RoundedRectangle object with given width and height. It's left top edge is located at (top/left). Initial orientation is parallel to x- and y-axis."
    })

    static RoundedRectangleSetWidthComment = () => lm({
        "de": "setzt die Breite des Rechtecks.",
        "en": "sets width of RoundedRectangle",
    })

    static RoundedRectangleSetHeightComment = () => lm({
        "de": "setzt die Höhe des Rechtecks.",
        "en": "sets height of RoundedRectangle",
    })

    static RoundedRectangleGetWidthComment = () => lm({
        "de": "gibt die Breite des Rechtecks zurück",
        "en": "gets RoundedRectangle width",
    })

    static RoundedRectangleGetHeightComment = () => lm({
        "de": "gibt die Höhe des Rechtecks zurück",
        "en": "gets RoundedRectangle height",
    })

    static RoundedRectangleCopyComment = () => lm({
        "de": "Erstellt eine Kopie des RoundedRectangle-Objekts und git sie zurück.",
        "en": "returns a copy of this RoundedRectangle object",
    })

    static RoundedRectangleMoveToComment = () => lm({
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


    /**
     * Klass PApplet
     */

    static PAppletClassComment = () => lm({
        "de": "Wenn Du Deine Klasse von PApplet ableitest (class Test extends PApplet{...}), kannst Du auf diese Weise ein Processing-Applet erstellen (siehe https://processing.org), indem Du ihre Methoden draw(), mousePressed(), usw. überschreibst und mit Inhalt füllst. Du startest das Applet, indem Du ein Objekt Deiner Klasse instanzierst und davon die main-Methode aufrufst: new Test().main();",
        "en": "You can create a processing-Applet by extending class PApplet (class Test extends PApplet{...}), see https://processing.org. Overwrite it's methods draw(), mousePressed(), ... to get graphic output and interaction.",
    })

    static PAppletConstructorComment = () => lm({
        "de": "Legt eine neues Processing-Applet an.",
        "en": "Creates a new processing Applet.",
    })

    static PAppletLoopComment = () => lm({
        "de": "Startet nach noLoop() die Renderer-Loop wieder neu, so dass draw() wieder periodisch aufgerufen wird.",
        "en": "",
    })

    static PAppletNoLoopComment = () => lm({
        "de": "Stoppt die Render-Loop, so dass draw() nicht mehr aufgerufen wird. Kann mit loop() wieder gestartet werden.",
        "en": "",
    })

    static PAppletSizeComment = () => lm({
        "de": "Definiert die Abmessungen des Processing-Ausgabebereichs in Pixeln.",
        "en": "",
    })

    static PAppletCreateCanvasComment = () => lm({
        "de": "Definiert die Abmessungen des Processing-Ausgabebereichs in Pixeln.",
        "en": "",
    })



    static PAppletSetupComment = () => lm({
        "de": "Diese Methode wird nach Aufruf von main() genau ein Mal aufgerufen.",
        "en": "This method is called once after main() had been called.",
    })

    static PAppletSettingsComment = () => lm({
        "de": "Diese Methode wird nach Aufruf von main() genau ein Mal aufgerufen.",
        "en": "This method is called once after main() had been called.",
    })

    static PAppletPreloadComment = () => lm({
        "de": "Diese Methode wird nach Aufruf von main() genau ein Mal aufgerufen.",
        "en": "This method is called once after main() had been called.",
    })

    static PAppletDrawComment = () => lm({
        "de": "Diese Methode wird 60-mal pro Sekunde aufgerufen. Ihr Zweck ist es, die Grafikausgabe zu zeichnen.",
        "en": "This method is called 60 times per second. It's purpose is to draw.",
    })

    static PAppletMousePressedComment = () => lm({
        "de": "Die mousePressed-Methode wird immer dann aufgerufen, wenn gerade eine Maustaste heruntergedrückt wurde. Die aktuellen Koordinaten des Mauszeigers liegen in den Attributen mouseX und mouseY vor, die gerade heruntergedrückte Maustaste kann dem Attribut mouseButton entnommen werden.",
        "en": "",
    })

    static PAppletMouseReleasedComment = () => lm({
        "de": "Die mouseReleased-Methode wird immer dann aufgerufen, wenn gerade eine Maustaste losgelassen wurde. Die aktuellen Koordinaten des Mauszeigers liegen in den Attributen mouseX und mouseY vor, die gerade heruntergedrückte Maustaste kann dem Attribut mouseButton entnommen werden.",
        "en": "",
    })

    static PAppletMouseClickedComment = () => lm({
        "de": "Die mouseClicked-Methode wird immer dann aufgerufen, wenn gerade eine Maustaste auf dem Zeichenbereich gedrückt und anschließend losgelassen wurde. Die aktuellen Koordinaten des Mauszeigers liegen in den Attributen mouseX und mouseY vor, die gerade heruntergedrückte Maustaste kann dem Attribut mouseButton entnommen werden.",
        "en": "",
    })

    static PAppletMouseDraggedComment = () => lm({
        "de": "Die mouseDragged-Methode wird immer dann aufgerufen, wenn eine Maustaste gerade heruntergedrückt ist und die Position des Mauszeigers sich verändert hat. Die aktuellen Koordinaten des Mauszeigers liegen in den Attributen mouseX und mouseY vor, die zuletzt gedrückte Maustaste kann dem Attribut mouseButton entnommen werden.",
        "en": "",
    })

    static PAppletMouseMovedComment = () => lm({
        "de": "Die mouseMoved-Methode wird immer dann aufgerufen, wenn die Position des Mauszeigers sich verändert hat. Die aktuellen Koordinaten des Mauszeigers liegen in den Attributen mouseX und mouseY vor, die zuletzt gedrückte Maustaste kann dem Attribut mouseButton entnommen werden.",
        "en": "",
    })

    static PAppletMouseEnteredComment = () => lm({
        "de": "Die mouseEntered-Methode wird immer dann aufgerufen, wenn der Mauszeiger von außen neu in den Zeichenbereich hineinfährt.",
        "en": "",
    })

    static PAppletMouseExitedComment = () => lm({
        "de": "Die mouseExited-Methode wird immer dann aufgerufen, wenn der Mauszeiger den Zeichenbereich gerade verlassen hat.",
        "en": "",
    })

    static PAppletKeyPressedComment = () => lm({
        "de": "Die keyPressed-Methode wird immer dann aufgerufen, wenn eine Taste gerade heruntergedrückt wurde. Informationen zur Taste können den Attributen key (String) und keyCode (int) entnommen werden.",
        "en": "",
    })

    static PAppletKeyReleasedComment = () => lm({
        "de": "Die keyReleased-Methode wird immer dann aufgerufen, wenn eine Taste gerade losgelassen wurde. Informationen zur Taste können den Attributen key (String) und keyCode (int) entnommen werden.",
        "en": "",
    })

    static PAppletMainComment = () => lm({
        "de": "Rufen Sie die Methode main() auf, um das Processing-Applet zu starten.",
        "en": "Call method main() to start this processing Applet.",
    })


    // Fields
    static PAppletMouseXComment = () => lm({
        "de": "aktuelle x-Koordinate des Mauszeigers",
        "en": "current x-coordinate of mouse pointer",
    })

    static PAppletMouseYComment = () => lm({
        "de": "aktuelle y-Koordinate des Mauszeigers",
        "en": "current y-coordinate of mouse pointer",
    })

    static PAppletPMouseXComment = () => lm({
        "de": "x-Koordinate des Mauszeigers im vorherigen Frame",
        "en": "x-coordinate of mouse pointer in previous frame",
    })

    static PAppletPMouseYComment = () => lm({
        "de": "y-Koordinate des Mauszeigers im vorherigen Frame",
        "en": "y-coordinate of mouse pointer in previous frame",
    })

    static PAppletLEFTComment = () => lm({
        "de": "links",
        "en": "left",
    })

    static PAppletCENTERComment = () => lm({
        "de": "Mitte",
        "en": "center",
    })

    static PAppletRIGHTComment = () => lm({
        "de": "rechts",
        "en": "right",
    })

    static PAppletTOPComment = () => lm({
        "de": "obenbündig",
        "en": "top",
    })

    static PAppletBASELINEComment = () => lm({
        "de": "bündig auf der Grundlinie",
        "en": "baseline",
    })

    static PAppletBOTTOMComment = () => lm({
        "de": "untenbündig",
        "en": "bottom",
    })

    static PAppletWidthComment = () => lm({
        "de": "Breite des Zeichenbereichs",
        "en": "width of canvas",
    })

    static PAppletHeightComment = () => lm({
        "de": "Höhe des Zeichenbereichs",
        "en": "height of canvas",
    })

    static PAppletKeyCodeComment = () => lm({
        "de": "Zahlencode der zuletzt gedrückten Taste",
        "en": "keycode of previously pressed key",
    })

    static PAppletMouseButtonComment = () => lm({
        "de": "Zuletzt gedrückte Maustaste, kann die Werte LEFT, RIGHT und CENTER annehmen.",
        "en": "Previously pressed mouse button. Possible values are LEFT, RIGHT or CENTER.",
    })

    static PAppletCORNERComment = () => lm({
        "de": "Modus zum Zeichnen von Rechtecken.",
        "en": "Mode to draw rectangles.",
    })

    static PAppletCORNERSComment = () => lm({
        "de": "Modus zum Zeichnen von Rechtecken.",
        "en": "Mode to draw rectangles.",
    })

    static PAppletRADIUSComment = () => lm({
        "de": "Modus zum Zeichnen von Rechtecken.",
        "en": "Mode to draw rectangles.",
    })

    static PAppletPOINTSComment = () => lm({
        "de": "zeichne nachfolgend Einzelpunkte",
        "en": "draw points only",
    })

    static PAppletLINESComment = () => lm({
        "de": "zeichne nachfolgend einzelne Linien",
        "en": "draw lines subsequently",
    })

    static PAppletTRIANGLESComment = () => lm({
        "de": "zeichne nachfolgend einzelne Dreiecke",
        "en": "draw triangles subsequently",
    })

    static PAppletTRIANGLE_STRIPComment = () => lm({
        "de": "zeichne nachfolgend einen Triangle-Strip",
        "en": "draw triangle-strip subesequently",
    })

    static PAppletTRIANGLE_FANComment = () => lm({
        "de": "zeichne nachfolgend einen Triangle-Fan",
        "en": "draw triangle-fan subesequently",
    })

    static PAppletQUADSComment = () => lm({
        "de": "zeichne nachfolgend Vierecke",
        "en": "draw quads subsequently",
    })

    static PAppletQUAD_STRIPComment = () => lm({
        "de": "zeichne nachfolgend einen Quad-Strip",
        "en": "draw quad-strip subsequently",
    })

    static PAppletTESSComment = () => lm({
        "de": "zeichne nachfolgend ein TESS - geht nur bei createCanvas(width, height, WEBGL)",
        "en": "draw TESS subsequently - only possible with createCanvas(width, height, WEBGL)",
    })

    static PAppletCLOSEComment = () => lm({
        "de": "endShape(CLOSE) schließt den Linienzug",
        "en": "endShape(CLOSE) closes line-strip",
    })

    static PAppletDEGREESComment = () => lm({
        "de": "angleMode(DEGREES) sorgt dafür, dass nachfolgende Winkelangaben in Grad interpretiert werden.",
        "en": "angleMode(DEGREES) makes processing interpret subsequent angle values as degrees",
    })

    static PAppletRADIANSComment = () => lm({
        "de": "angleMode(RADIANS) sorgt dafür, dass nachfolgende Winkelangaben im Bogenmaß interpretiert werden.",
        "en": "angleMode(RADIANS) makes processing interpret subsequent angle values as radians",
    })

    static PAppletWEBGLComment = () => lm({
        "de": "WebGL-Renderer zur 3D-Ausgabe",
        "en": "WebGL-Renderer for 3D-output",
    })

    static PAppletP2DComment = () => lm({
        "de": "Renderer zur zweidimensionalen Ausgabe",
        "en": "Renderer for 2D-Output",
    })

    static PAppletRGBComment = () => lm({
        "de": "Color-Mode RGB (rot, grün, blau)",
        "en": "color mode RGB (red, green, blue)",
    })

    static PAppletHSLComment = () => lm({
        "de": "Color-Mode HSL",
        "en": "color mode HSL",
    })

    static PAppletHSBComment = () => lm({
        "de": "Color-Mode HSB",
        "en": "color mode HSB",
    })

    static PAppletKeyComment = () => lm({
        "de": "Letzte gedrückte Taste",
        "en": "previously pressed key",
    })

    // methods:
    static PAppletClear0Comment = () => lm({
        "de": `Löscht die Zeichenfläche.`,
        "en": `Clears the pixels on the canvas. clear() makes every pixel 100% transparent.`,
    })

    static PAppletBackground1Comment = () => lm({
        "de": `Übermalt die komplette Zeichenfläche mit der übergebenen Farbe.`,
        "en": `Sets the color used for the background of the canvas.`,
    })

    static PAppletBackground2Comment = () => lm({
        "de": `Übermalt die komplette Zeichenfläche mit der übergebenen Farbe. Übergeben wird eine Zeichenkette der Form 'rgb(0,0,255)' oder 'rgb(0%, 0%, 100%)' oder 'rgba(0, 0, 255, 1)' oder 'rgba(0%, 0%, 100%, 1)' und all diese Kombinationen statt rgb auch mit hsl und hsb.`,
        "en": `Sets the color used for the background of the canvas. Write color as 'rgb(0,0,255)' or 'rgb(0%, 0%, 100%)' or 'rgba(0, 0, 255, 1)' or 'rgba(0%, 0%, 100%, 1)' or use hsl or hsb instead of rgb.`,
    })

    static PAppletBackground3Comment = () => lm({
        "de": `Übermalt die komplette Zeichenfläche mit der übergebenen Farbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit`,
        "en": `Sets the color used for the background of the canvas. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletFill1Comment = () => lm({
        "de": `Setzt die Füllfarbe.`,
        "en": `Sets the color used to fill shapes.`,
    })

    static PAppletFill1aComment = () => lm({
        "de": `Setzt die Füllfarbe.`,
        "en": `Sets the color used to fill shapes.`,
    })

    static PAppletFill2Comment = () => lm({
        "de": `Setzt die Füllfarbe.`,
        "en": `Sets the color used to fill shapes.`,
    })

    static PAppletFill3Comment = () => lm({
        "de": `Setzt die Füllfarbe.`,
        "en": `Sets the color used to fill shapes.`,
    })

    static PAppletFill4Comment = () => lm({
        "de": `Setzt die Füllfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit`,
        "en": `Sets the color used to fill shapes. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletFill5Comment = () => lm({
        "de": `Setzt die Füllfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit`,
        "en": `Sets the color used to fill shapes. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletNoFill0Comment = () => lm({
        "de": `Die nachfolgend gezeichneten Figuren werden nicht gefüllt.`,
        "en": `Subsequently drawn shapes will not get filled.`,
    })

    static PAppletStroke1Comment = () => lm({
        "de": `Setzt die Linienfarbe.`,
        "en": `Sets the color used to draw points, lines, and the outlines of shapes.`,
    })

    static PAppletStroke1aComment = () => lm({
        "de": `Setzt die Linienfarbe.`,
        "en": `Sets the color used to draw points, lines, and the outlines of shapes.`,
    })

    static PAppletStroke2Comment = () => lm({
        "de": `Setzt die Linienfarbe.`,
        "en": `Sets the color used to draw points, lines, and the outlines of shapes.`,
    })

    static PAppletStroke3Comment = () => lm({
        "de": `Setzt die Linienfarbe.`,
        "en": `Sets the color used to draw points, lines, and the outlines of shapes.`,
    })

    static PAppletStroke4Comment = () => lm({
        "de": `Setzt die Linienfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit`,
        "en": `Sets the color used to draw points, lines, and the outlines of shapes. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletStroke5Comment = () => lm({
        "de": `Setzt die Linienfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit`,
        "en": `Sets the color used to draw points, lines, and the outlines of shapes. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletStrokeWeight1Comment = () => lm({
        "de": `Setzt die Linienbreite.`,
        "en": `Sets the width of the stroke used for points, lines, and the outlines of shapes.`,
    })

    static PAppletNoStroke0Comment = () => lm({
        "de": `Die nachfolgend gezeichneten Figuren werden ohne Rand gezeichnet.`,
        "en": ``,
    })

    static PAppletColor1Comment = () => lm({
        "de": `Gibt den Grauton als String-kodierte Farbe zurück.`,
        "en": `Disables drawing points, lines, and the outlines of shapes.`,
    })

    static PAppletColor2Comment = () => lm({
        "de": `Gibt die Farbe zurück. Übergeben kann eine Zeichenkette der Form 'rgb(0,0,255)' oder 'rgb(0%, 0%, 100%)' oder 'rgba(0, 0, 255, 1)' oder 'rgba(0%, 0%, 100%, 1)' und all diese Kombinationen statt rgb auch mit hsl und hsb.`,
        "en": `Converts string like 'rgb(0,0,255)' or 'rgb(0%, 0%, 100%)' or 'rgba(0, 0, 255, 1)' or 'rgba(0%, 0%, 100%, 1)' to a color.`,
    })

    static PAppletColor3Comment = () => lm({
        "de": `Gibt den Grauton als String-kodierte Farbe zurück.`,
        "en": `Returns gray value of given color`,
    })

    static PAppletColor4Comment = () => lm({
        "de": `Gibt die aus v1, v2, v3 gebildete Farbe String-kodiert zurück.`,
        "en": `Returns color given by v1, v2 and v3. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletColor5Comment = () => lm({
        "de": `Gibt die aus v1, v2, v3 und alpha gebildete Farbe String-kodiert zurück.`,
        "en": `Returns color given by v1, v2 and v3. v1, v2 and v3 are red, green and blue or - dependent on current color mode - color, saturation and luminescence.`,
    })

    static PAppletLerpColor3Comment = () => lm({
        "de": `Gibt eine Zwischenfarbe zwischen colorA und colorB zurück. t == 0 bedeutet: colorA, t == 1 bedeutet: colorB, t == 0.5 bedeutet: genau zwischen beiden, usw.`,
        "en": `Blends two colors to find a third color between them. The amt parameter specifies the amount to interpolate between the two values. 0 is equal to the first color, 0.1 is very near the first color, 0.5 is halfway between the two colors, and so on.`,
    })

    static PAppletColorMode1Comment = () => lm({
        "de": `Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB.`,
        "en": `Changes the way color values are interpreted. 
By default, the Number parameters for fill(), stroke(), background(), and color() are defined by values between 0 and 255 using the RGB color model. This is equivalent to calling colorMode(RGB, 255). Pure red is color(255, 0, 0) in this model.
Calling colorMode(RGB, 100) sets colors to use RGB color values between 0 and 100. Pure red is color(100, 0, 0) in this model.
Calling colorMode(HSB) or colorMode(HSL) changes to HSB or HSL system instead of RGB. Pure red is color(0, 100, 100) in HSB and color(0, 100, 50) in HSL.`,
    })

    static PAppletColorMode2Comment = () => lm({
        "de": `Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB für Mode. Max ist der Maximalwert jeder Farbkomponente.`,
        "en": `Changes the way color values are interpreted. 
By default, the Number parameters for fill(), stroke(), background(), and color() are defined by values between 0 and 255 using the RGB color model. This is equivalent to calling colorMode(RGB, 255). Pure red is color(255, 0, 0) in this model.
Calling colorMode(RGB, 100) sets colors to use RGB color values between 0 and 100. Pure red is color(100, 0, 0) in this model.
Calling colorMode(HSB) or colorMode(HSL) changes to HSB or HSL system instead of RGB. Pure red is color(0, 100, 100) in HSB and color(0, 100, 50) in HSL.`,
    })

    static PAppletColorMode4Comment = () => lm({
        "de": `Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB für Mode. Max ist der Maximalwert jeder Farbkomponente.`,
        "en": `Changes the way color values are interpreted. 
By default, the Number parameters for fill(), stroke(), background(), and color() are defined by values between 0 and 255 using the RGB color model. This is equivalent to calling colorMode(RGB, 255). Pure red is color(255, 0, 0) in this model.
Calling colorMode(RGB, 100) sets colors to use RGB color values between 0 and 100. Pure red is color(100, 0, 0) in this model.
Calling colorMode(HSB) or colorMode(HSL) changes to HSB or HSL system instead of RGB. Pure red is color(0, 100, 100) in HSB and color(0, 100, 50) in HSL.`,
    })

    static PAppletColorMode5Comment = () => lm({
        "de": `Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB für Mode. Max ist der Maximalwert jeder Farbkomponente.`,
        "en": `Changes the way color values are interpreted. 
By default, the Number parameters for fill(), stroke(), background(), and color() are defined by values between 0 and 255 using the RGB color model. This is equivalent to calling colorMode(RGB, 255). Pure red is color(255, 0, 0) in this model.
Calling colorMode(RGB, 100) sets colors to use RGB color values between 0 and 100. Pure red is color(100, 0, 0) in this model.
Calling colorMode(HSB) or colorMode(HSL) changes to HSB or HSL system instead of RGB. Pure red is color(0, 100, 100) in HSB and color(0, 100, 50) in HSL.`,
    })

    static PAppletRectMode1Comment = () => lm({
        "de": `Setzt den Modus, in dem nachfolgende Aufrufe von rect(...) interpretiert werden. Möglich sind die Werte CORNER, CORNERS, RADIUS und CENTER.`,
        "en": `Changes where rectangles and squares are drawn.
By default, the first two parameters of rect() and square(), are the x- and y-coordinates of the shape's upper left corner. The next parameters set the shape's width and height. This is the same as calling rectMode(CORNER).
rectMode(CORNERS) also uses the first two parameters as the location of one of the corners. The next parameters are the location of the opposite corner. This mode only works for rect().
rectMode(CENTER) uses the first two parameters as the x- and y-coordinates of the shape's center. The next parameters are its width and height.
rectMode(RADIUS) also uses the first two parameters as the x- and y-coordinates of the shape's center. The next parameters are half of the shape's width and height.`,
    })

    static PAppletRect1Comment = () => lm({
        "de": `Zeichnet ein Rechteck. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks.`,
        "en": `Draws a rectangle.`,
    })

    static PAppletRect1aComment = () => lm({
        "de": `Zeichnet ein Rechteck mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks.`,
        "en": `Draws a rectangle with rounded edges.`,
    })

    static PAppletRect1bComment = () => lm({
        "de": `Zeichnet ein Rechteck mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks.`,
        "en": `Draws a rectangle with rounded edges.`,
    })

    static PAppletSquare1Comment = () => lm({
        "de": `Zeichnet ein Quadrat. (left, top) ist die linke obere Ecke, width Seitenlänge des Quadrats.`,
        "en": `Draws a square.`,
    })

    static PAppletSquare1aComment = () => lm({
        "de": `Zeichnet ein Quadrat mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width Seitenlänge des Quadrats. Radius ist der Eckenradius.`,
        "en": `Draws a sqare with rounded eges.`,
    })

    static PAppletSquare1bComment = () => lm({
        "de": `Zeichnet ein Quadrat mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width Seitenlänge des Quadrats. Radius ist der Eckenradius.`,
        "en": `Draws a sqare with rounded eges.`,
    })

    static PAppletRect1cComment = () => lm({
        "de": `Zeichnet ein Rechteck. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks. Radius ist der Eckenradius`,
        "en": `Draws a rectangle with rounded edges.`,
    })

    static PAppletEllipse1Comment = () => lm({
        "de": `Zeichnet eine Ellipse. (left, top) ist die linke obere Ecke der Boundingbox der Ellipse, width ihre Breite und height ihre Höhe. Das lässt sich aber mit ellipseMode(...) ändern!`,
        "en": `Draws an ellipse.`,
    })

    static PAppletCircle1Comment = () => lm({
        "de": `Zeichnet einen Kreis. (x, y) ist der Mittelpunkt des Kreises, extent der doppelte Radius.`,
        "en": `Draws a circle with center at (x, y). Extent is it's double radius.`,
    })

    static PAppletEllipseMode1Comment = () => lm({
        "de": `Setzt den Modus, in dem nachfolgende Aufrufe von ellipse(...) interpretiert werden. Möglich sind die Werte CORNER, CORNERS, RADIUS und CENTER.`,
        "en": ``,
    })

    static PAppletLine1Comment = () => lm({
        "de": `Zeichnet eine Strecke von (x1, y1) nach (x2, y2).`,
        "en": ``,
    })

    static PAppletLine1aComment = () => lm({
        "de": `Zeichnet eine Strecke von (x1, y1, z1) nach (x2, y2, z2).`,
        "en": ``,
    })

    static PAppletTriangle1Comment = () => lm({
        "de": `Zeichnet eine Dreieck mit den Eckpunkten (x1, y1), (x2, y2) und (x3, y3).`,
        "en": ``,
    })

    static PAppletQuad1Comment = () => lm({
        "de": `Zeichnet eine Viereck mit den Eckpunkten (x1, y1), (x2, y2), (x3, y3) und (x4, y4).`,
        "en": ``,
    })

    static PAppletBezier1Comment = () => lm({
        "de": `Zeichnet eine kubische Bezierkurve mit den Ankerpunkten (x1, y1), (x4, y4) und den Kontrollpunkten (x2, y2), (x3, y3).`,
        "en": ``,
    })

    static PAppletCurve1Comment = () => lm({
        "de": `Zeichnet eine Catmull-Rom-Kurve vom Punkt (x2, y2) nach (x3, y3) so, als würde sie von (x1, x2) kommen und es am Ende zu (x4, y4) weitergehen.`,
        "en": ``,
    })

    static PAppletCurvePoint1Comment = () => lm({
        "de": `Will man die Zwischenpunkte einer Curve erhalten (Beginn b, Ende c, als würde sie von a kommen und nach d gehen), so verwendet man sowohl für die x- als auch für die y-Koordinate diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).`,
        "en": ``,
    })

    static PAppletCurveTangent1Comment = () => lm({
        "de": `Will man die Zwischentangenten einer Curve erhalten (Beginn b, Ende c, als würde sie von a kommen und nach d gehen), so verwendet man sowohl für die x- als auch für die y-Koordinate diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).`,
        "en": ``,
    })

    static PAppletBezierPoint1Comment = () => lm({
        "de": `Will man die Zwischenpunkte einer Bezierkurve erhalten (Ankerkoordinaten x1, x4 und Stützkoordinaten x2, x3), so nutzt man - einzeln sowohl für die x- also auch für die y-Koordinate - diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).`,
        "en": ``,
    })

    static PAppletBezierTangent1Comment = () => lm({
        "de": `Will man die Zwischentangenten einer Bezierkurve erhalten (Ankerkoordinaten x1, x4 und Stützkoordinaten x2, x3), so nutzt man - einzeln sowohl für die x- also auch für die y-Koordinate - diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).`,
        "en": ``,
    })

    static PAppletBeginShape0Comment = () => lm({
        "de": `Beginnt mit dem Zeichnen eines Polygons. Die einzelnen Punkte werden mit der Methode vertex(x, y) gesetzt.`,
        "en": ``,
    })

    static PAppletEndShape0Comment = () => lm({
        "de": `Endet das Zeichnen eines Polygons.`,
        "en": ``,
    })

    static PAppletBeginShape1Comment = () => lm({
        "de": `Beginnt mit dem Zeichnen eines Polygons. Die einzelnen Punkte werden mit der Methode vertex(x, y) gesetzt. Mögliche Werte für kind sind: POINTS, LINES, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN, QUADS, QUAD_STRIP`,
        "en": ``,
    })

    static PAppletEndShape1Comment = () => lm({
        "de": `endShape(CLOSE) schließt den Linienzug.`,
        "en": ``,
    })

    static PAppletVertex1Comment = () => lm({
        "de": `Setzt zwischen beginShape() und endShape() einen Punkt.`,
        "en": ``,
    })

    static PAppletPoint1Comment = () => lm({
        "de": `Zeichnet einen Punkt.`,
        "en": ``,
    })

    static PAppletSet3Comment = () => lm({
        "de": `Setzt die Farbe des Pixels bei (x, y).`,
        "en": ``,
    })

    static PAppletVertex1aComment = () => lm({
        "de": `Setzt zwischen beginShape() und endShape() einen Punkt.`,
        "en": ``,
    })

    static PAppletPoint1aComment = () => lm({
        "de": `Zeichnet einen Punkt.`,
        "en": ``,
    })

    static PAppletCurveVertex1Comment = () => lm({
        "de": `Setzt zwischen beginShape() und endShape() einen Punkt. Processing zeichnet damit eine Kurve nach dem Catmull-Rom-Algorithmus.`,
        "en": ``,
    })

    static PAppletCurvevertex1Comment = () => lm({
        "de": `Setzt zwischen beginShape() und endShape() einen Punkt. Processing zeichnet damit eine Kurve nach dem Catmull-Rom-Algorithmus.`,
        "en": ``,
    })

    static PAppletBox1Comment = () => lm({
        "de": `Zeichnet einen 3D-Würfel mit der Seitenlänge size.`,
        "en": ``,
    })

    static PAppletBox1aComment = () => lm({
        "de": `Zeichnet einen 3D-Würfel mit den angegebenen Seitenlängen.`,
        "en": ``,
    })

    static PAppletResetMatrix0Comment = () => lm({
        "de": `Setzt alle erfolgten Transformationen zurück.`,
        "en": ``,
    })

    static PAppletPush0Comment = () => lm({
        "de": `Sichert den aktuellen Zeichenzustand, d.h. die Farben und Transformationen, auf einen Stack.`,
        "en": ``,
    })

    static PAppletPop0Comment = () => lm({
        "de": `Holt den obersten Zeichenzustand, d.h. die Farben und Transformationen, vom Stack.`,
        "en": ``,
    })

    static PAppletScale1Comment = () => lm({
        "de": `Streckt die nachfolgend gezeichneten Figuren.`,
        "en": ``,
    })

    static PAppletScale1aComment = () => lm({
        "de": `Streckt die nachfolgend gezeichneten Figuren.`,
        "en": ``,
    })

    static PAppletScale1bComment = () => lm({
        "de": `Streckt die nachfolgend gezeichneten Figuren.`,
        "en": ``,
    })

    static PAppletTranslate1Comment = () => lm({
        "de": `Verschiebt die nachfolgend gezeichneten Figuren.`,
        "en": ``,
    })

    static PAppletTranslate1aComment = () => lm({
        "de": `Verschiebt die nachfolgend gezeichneten Figuren.`,
        "en": ``,
    })

    static PAppletRotate1Comment = () => lm({
        "de": `Rotiert die nachfolgend gezeichneten Figuren. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletRotateX1Comment = () => lm({
        "de": `Rotiert die nachfolgend gezeichneten Figuren um die X-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletRotateY1Comment = () => lm({
        "de": `Rotiert die nachfolgend gezeichneten Figuren um die Y-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletShearX1Comment = () => lm({
        "de": `Schert die nachfolgend gezeichneten Figuren in Richtung derX-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletShearY1Comment = () => lm({
        "de": `Schert die nachfolgend gezeichneten Figuren in Richtung der Y-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletRotateZ1Comment = () => lm({
        "de": `Rotiert die nachfolgend gezeichneten Figuren um die Z-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletAngleMode1Comment = () => lm({
        "de": `Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie winkel bei Rotationen interpretiert werden. Default ist RADIANS.`,
        "en": ``,
    })

    static PAppletTextSize1Comment = () => lm({
        "de": `Setzt die Schriftgröße in Pixel.`,
        "en": ``,
    })

    static PAppletTextAlign1Comment = () => lm({
        "de": `Setzt die Ausrichtung des nächsten ausgegebenen Textes in x-Richtung. Mögliche Werte sind CENTER, LEFT, RIGHT`,
        "en": ``,
    })

    static PAppletTextAlign1aComment = () => lm({
        "de": `Setzt die Ausrichtung des nächsten ausgegebenen Textes. Mögliche Werte für alignX sind CENTER, LEFT, RIGHT, mögliche Werte für alignY sind TOP, CENTER, BASELINE, BOTTOM`,
        "en": ``,
    })

    static PAppletText3Comment = () => lm({
        "de": `Gibt Text aus.`,
        "en": ``,
    })

    static PAppletText5Comment = () => lm({
        "de": `Gibt Text aus. x2 und y2 sind die Breite und Höhe des Textausgabebereichs. Hat der Text horizontal nicht Platz, so wird er entsprechend umgebrochen.`,
        "en": ``,
    })

    static PAppletRandom1Comment = () => lm({
        "de": `Gibt eine Zufallszahl zwischen low und high zurück.`,
        "en": ``,
    })

    static PAppletRandom1aComment = () => lm({
        "de": `Gibt eine Zufallszahl zwischen 0 und high zurück.`,
        "en": ``,
    })

    static PAppletSqrt1Comment = () => lm({
        "de": `Gibt die Quadratwurzel von n zurück.`,
        "en": ``,
    })

    static PAppletPow1Comment = () => lm({
        "de": `Gibt die den Wert der Potenz ("basis hoch exponent") zurück.`,
        "en": ``,
    })

    static PAppletMax1Comment = () => lm({
        "de": `Gibt den größeren der beiden Werte zurück.`,
        "en": ``,
    })

    static PAppletMin1Comment = () => lm({
        "de": `Gibt den kleineren der beiden Werte zurück.`,
        "en": ``,
    })

    static PAppletAbs1Comment = () => lm({
        "de": `Gibt den Betrag des Wertes zurück.`,
        "en": ``,
    })

    static PAppletSin1Comment = () => lm({
        "de": `Gibt den Sinus des Wertes zurück.`,
        "en": ``,
    })

    static PAppletCos1Comment = () => lm({
        "de": `Gibt den Cosinus des Wertes zurück.`,
        "en": ``,
    })

    static PAppletTan1Comment = () => lm({
        "de": `Gibt den Tangens des Wertes zurück.`,
        "en": ``,
    })

    static PAppletAsin1Comment = () => lm({
        "de": `Gibt den Arcussinus des Wertes zurück.`,
        "en": ``,
    })

    static PAppletAcos1Comment = () => lm({
        "de": `Gibt den Arcussosinus des Wertes zurück.`,
        "en": ``,
    })

    static PAppletRadians1Comment = () => lm({
        "de": `Wandelt einen Winkel vom Gradmaß ins Bogenmaß um.`,
        "en": ``,
    })

    static PAppletDegrees1Comment = () => lm({
        "de": `Wandelt einen Winkel vom Bogenmaß ins Gradmaß um.`,
        "en": ``,
    })

    static PAppletAtan1Comment = () => lm({
        "de": `Gibt den Arcussangens des Wertes zurück.`,
        "en": ``,
    })

    static PAppletAtan21Comment = () => lm({
        "de": `Gibt den Arcussangens des Wertes zurück.`,
        "en": ``,
    })

    static PAppletSqrt1aComment = () => lm({
        "de": `Gibt die Quadratwurzel des Wertes zurück.`,
        "en": ``,
    })

    static PAppletSq1Comment = () => lm({
        "de": `Gibt das Quadrat des Wertes zurück.`,
        "en": ``,
    })

    static PAppletAbs1aComment = () => lm({
        "de": `Gibt den Betrag des Wertes zurück.`,
        "en": ``,
    })

    static PAppletRound1Comment = () => lm({
        "de": `Rundet den Wert auf eine ganze Zahl.`,
        "en": ``,
    })

    static PAppletCeil1Comment = () => lm({
        "de": `Rundet den Wert auf eine ganze Zahl (Aufrunden!).`,
        "en": ``,
    })

    static PAppletFloor1Comment = () => lm({
        "de": `Rundet den Wert auf eine ganze Zahl (Abfrunden!).`,
        "en": ``,
    })

    static PAppletDist1Comment = () => lm({
        "de": `Berechnet den Abstand der Punkte (x1, y1) und (x2, y2).`,
        "en": ``,
    })

    static PAppletLerp1Comment = () => lm({
        "de": `Berechnet den a + (b - a)*t. Wählt man t zwischen 0 und 1, so kann man damit die Zwischenwerte zwischen a und b errechnen.`,
        "en": ``,
    })

    static PAppletConstrain1Comment = () => lm({
        "de": `Beschränkt value auf den Bereich [min, max], genauer: Ist value < min, so wird min zurückgegeben. Ist value > max, so wird max zurückgegeben. Ansonsten wird value zurückgegeben.`,
        "en": ``,
    })

    static PAppletYear0Comment = () => lm({
        "de": `Aktuelle Jahreszahl`,
        "en": ``,
    })

    static PAppletMonth0Comment = () => lm({
        "de": `Monat: 1 == Januar, 12 == Dezember`,
        "en": ``,
    })

    static PAppletDay0Comment = () => lm({
        "de": `Tag (innerhalb des Monats) des aktuellen Datums`,
        "en": ``,
    })

    static PAppletHour0Comment = () => lm({
        "de": `Stundenzahl der aktuellen Uhrzeit`,
        "en": ``,
    })

    static PAppletMinute0Comment = () => lm({
        "de": `Minutenzahl der aktuellen Uhrzeit`,
        "en": ``,
    })

    static PAppletSecond0Comment = () => lm({
        "de": `Sekundenzahl der aktuellen Uhrzeit`,
        "en": ``,
    })

    static PAppletFrameRate1Comment = () => lm({
        "de": `Setzt die Framerate (Anzahl der Aufrufe von draw() pro Sekunde)`,
        "en": ``,
    })

    static PAppletTextWidth1Comment = () => lm({
        "de": `Gibt die Breite des Texts zurück.`,
        "en": ``,
    })

    static PAppletTextAscent1Comment = () => lm({
        "de": `Gibt den Ascent Textes zurück ( = Höhe des größten Zeichens über der Grundlinie).`,
        "en": ``,
    })

    static PAppletTextDescent1Comment = () => lm({
        "de": `Gibt den Descent Textes zurück ( = Tiefe des tiefsten Zeichens unter der Grundlinie).`,
        "en": ``,
    })

    static PAppletTextLeading1Comment = () => lm({
        "de": `Setzt den Abstand zweier aufeinanderfolgender Textzeilen.`,
        "en": ``,
    })

    static PAppletCursor1Comment = () => lm({
        "de": `Ändert das Aussehen des Mauscursors. Type ist einer der Werte "arrow", "cross", "text", "move", "hand", "wait", "progress".`,
        "en": ``,
    })

    static PAppletNoCursor1Comment = () => lm({
        "de": `Hat zur Folge, dass der Mauscursor über dem Zeichenbereich unsichtbar ist.`,
        "en": ``,
    })

    static PAppletCopy1Comment = () => lm({
        "de": `Kopiert den rechteckigen Bereich mit der linken oberen Ecke (sx, sy) sowie der Breite sw und der Höhe sh in den Bereich mit der linken oberen Ecke (dx, dy), der Breite dw und der Höhe dh.`,
        "en": ``,
    })

    static PAppletMillis0Comment = () => lm({
        "de": `Gibt die Millisekunden zurück, die vergangen sind, seit setup() aufgerufen wurde.`,
        "en": ``,
    })

    static PAppletRedraw0Comment = () => lm({
        "de": `Führt draw() genau ein Mal aus. Macht ggf. Sinn, wenn die Render-Loop zuvor mit noLoop() gestoppt wurde.`,
        "en": ``,
    })

    /**
     * JavaKara
     */
    static JavaKaraWorldClassComment = () => lm({
        "de": "JavaKara-Welt",
        "en": "JavaKara-World",
    })

    static JavaKaraWorldConstructorComment = () => lm({
        "de": "",
        "en": "",
    })

    static JavaKaraWorldGetSizeXComment = () => lm({
        "de": "Gibt zurück, wie viele Felder breit die Welt ist.",
        "en": "Returns number of tiles in x-direction.",
    })

    static JavaKaraWorldGetSizeYComment = () => lm({
        "de": "Gibt zurück, wie viele Felder hoch die Welt ist.",
        "en": "Returns number of tiles in y-direction.",
    })

    static JavaKaraWorldClearAllComment = () => lm({
        "de": "Löscht alles aus der Welt bis auf Kara.",
        "en": "Removes everything except Kara the beatle.",
    })

    static JavaKaraWorldSetLeafComment = () => lm({
        "de": "Setzt oder entfernt an der Position (x, y) ein Kleeblatt.",
        "en": "Adds or removes a leaf at position (x, y).",
    })

    static JavaKaraWorldSetTreeComment = () => lm({
        "de": "Setzt oder entfernt an der Position (x, y) einen Baumstumpf.",
        "en": "Adds or removes a tree stump at position (x, y).",
    })

    static JavaKaraWorldSetMushroomComment = () => lm({
        "de": "Setzt oder entfernt an der Position (x, y) einen Pilz.",
        "en": "Adds or removes a mushroom at position (x, y).",
    })

    static JavaKaraWorldIsEmptyComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn sich auf dem angegebenen Feld nichts befindet (auch nicht Kara).",
        "en": "Returns true if and only if there's nothing at position (x, y).",
    })

    static JavaKaraWorldInitComment = () => lm({
        "de": "Baut die Welt mithilfe eines mehrzeiligen Strings. Dabei bedeutet \\n einen Zeilenumbruch, l ein Kleeblatt, t einen Baumstumpf und m einen Pilz.",
        "en": "Creates world based on a multiline string. \\n is a line break, l a leaf, t a tree stump and m a Mushroom.",
    })








    static KaraClassComment = () => lm({
        "de": "JavaKara-Marienkäfer",
        "en": "Kara, the beatle",
    })

    static KaraConstructorComment = () => lm({
        "de": "Instanziert ein neues Kara-Objekt.",
        "en": "Creates a new Kara beatle.",
    })

    static KaraGetPositionComment = () => lm({
        "de": "Gibt Karas Position zurück. Dabei ist (0/0) die Position der linken oberen Ecke.",
        "en": "Returns Kara's position. (0/0) is position at top left corner.",
    })

    static KaraMoveComment = () => lm({
        "de": "Bewegt Kara um ein Feld nach vorne.",
        "en": "Moves Kara one tile forward.",
    })

    static KaraGetWorldComment = () => lm({
        "de": "Gibt das JavaKaraWorld-Objekt zurück, in dem sich Kara befindet.",
        "en": "Returns world-object.",
    })

    static KaraGetDirectionComment = () => lm({
        "de": "Gibt die Blickrichtung von Kara zurück: 0 == Norden, 1 == Westen, 2 == Süden, 3 == Osten",
        "en": "Returns direction of beatle Kara. 0 == north, 1 == west, 2 == south, 3 == east.",
    })

    static KaraOnLeafComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn sich Kara auf einem Kleeblatt befindet.",
        "en": "Returns true if and only if Kara is located on a leaf.",
    })

    static KaraTreeFrontComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn sich vor Kara ein Baumstumpf befindet.",
        "en": "Returns true if and only if on the tile IN FRONT OF Kara there is a tree stump.",
    })

    static KaraTreeLeftComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn sich auf dem Feld unmmittelbar links von Kara ein Baumstumpf befindet.",
        "en": "Returns true if and only if directly left of Kara there is a tree stump.",
    })

    static KaraTreeRightComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn sich auf dem Feld unmmittelbar rechts von Kara ein Baumstumpf befindet.",
        "en": "Returns true if and only if directly right of Kara there is a tree stump.",
    })

    static KaraMushroomFrontComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn sich vor Kara ein Pilz befindet.",
        "en": "Returns true if and only if on the tile IN FRONT OF Kara there is a mushroom.",
    })

    static KaraTurnLeftComment = () => lm({
        "de": "Dreht Kara um 90° nach links (d.h. gegen den Uhrzeigersinn).",
        "en": "Turns Kara 90° leftwards (that is: counterclockwise).",
    })

    static KaraTurnRightComment = () => lm({
        "de": "Dreht Kara um 90° nach rechts (d.h. im Uhrzeigersinn).",
        "en": "Turns Kara 90° rightwards (that is: clockwise).",
    })

    static KaraPutLeafComment = () => lm({
        "de": "Legt ein Kleeblatt auf die Position, an der Kara gerade steht.",
        "en": "Deposits a leaf beneath Kara.",
    })

    static KaraRemoveLeafComment = () => lm({
        "de": "Kara nimmt das Kleeblatt, das sich auf seiner aktuellen Position befindet.",
        "en": "Removes a leaf beneath Kara.",
    })

    /**
     * Java Hamster
     */

    static HamsterWorldClassComment = () => lm({
        "de": "JavaHamster-Welt"
    })

    static HamsterWorldConstructorComment = () => lm({
        "de": "Instanziert eine neue JavaHamster-Welt"
    })

    static HamsterWorldGetBreiteComment = () => lm({
        "de": "Gibt zurück, wie viele Felder breit die Welt ist.",
        "en": "",
    })

    static HamsterWorldGetHoeheComment = () => lm({
        "de": "Gibt zurück, wie viele Felder hoch die Welt ist.",
        "en": "",
    })

    static HamsterWorldLoescheAllesComment = () => lm({
        "de": "Löscht alles aus der Welt bis auf den Hamster.",
        "en": "",
    })

    static HamsterWorldSetzeMauerComment = () => lm({
        "de": "Setzt oder entfernt an der Position (x, y) eine Mauer.",
        "en": "",
    })

    static HamsterWorldSetzeGetreideComment = () => lm({
        "de": "Setzt an der Position (x, y) die Anzahl der Getreidekörner.",
        "en": "",
    })

    static HamsterWorldInitComment = () => lm({
        "de": "Baut die Welt mithilfe eines mehrzeiligen Strings. Dabei bedeutet \\n einen Zeilenumbruch, m eine Mauer und 1 ... 9, a ... f die entsprechende Anzahl an Getreidekörnern.",
        "en": "",
    })



    static HamsterClassComment = () => lm({
        "de": "JavaHamster-Hamster"
    })

    static HamsterConstructorComment = () => lm({
        "de": "Instanziert ein neues Hamster-Objekt",
        "en": "",
    })

    static HamsterVorComment = () => lm({
        "de": "Bewegt den Hamster um ein Feld nach vorne.",
        "en": "",
    })

    static HamsterGetWorldComment = () => lm({
        "de": "Gibt das JavaHamsterWorld-Objekt zurück, in dem sich Hamster befindet.",
        "en": "",
    })

    static HamsterGetBlickrichtungComment = () => lm({
        "de": "Gibt die Blickrichtung von Hamster zurück: 0 == Norden, 1 == Osten, 2 == Süden, 3 == Westen",
        "en": "",
    })

    static HamsterGetReiheComment = () => lm({
        "de": "Gibt die Reihe zurück, in der sich der Hamster gerade befindet. Reihe 0 ist ganz oben.",
        "en": "",
    })

    static HamsterGetSpalteComment = () => lm({
        "de": "Gibt die Spalte zurück, in der sich der Hamster gerade befindet. Reihe 0 ist ganz links.",
        "en": "",
    })

    static HamsterGetKoernerComment = () => lm({
        "de": "Gibt die Anzahl der Körner zurück, die der Hamster gerade im Mund hat.",
        "en": "",
    })

    static HamsterLinksUmComment = () => lm({
        "de": "Dreht Hamster um 90° nach links",
        "en": "",
    })

    static HamsterRechtsUmComment = () => lm({
        "de": "Dreht Hamster um 90° nach rechts",
        "en": "",
    })

    static HamsterGibComment = () => lm({
        "de": "Der Hamster legt ein Korn in der Zelle ab, in der er sich gerade befindet.",
        "en": "",
    })

    static HamsterNimmComment = () => lm({
        "de": "Der Hamster nimmt ein Korn aus der Zelle, in der er sich gerade befindet.",
        "en": "",
    })

    static HamsterVornFreiComment = () => lm({
        "de": "Liefert genau dann true, wenn sich in Blickrichtung vor dem aufgerufenen Hamster keine Mauer befindet (wenn sich der Hamster in Blickrichtung am Rand des Territoriums befindet, wird false geliefert)",
        "en": "",
    })

    static HamsterMaulLeerComment = () => lm({
        "de": "Liefert genau dann true, wenn der Hamster keine Körner im Mund hat.",
        "en": "",
    })

    static HamsterKornDaComment = () => lm({
        "de": "Liefert genau dann true, wenn sich in der Zelle, auf der der Hamster sich befindet, mindestens ein Korn befindet.",
        "en": "",
    })

    static HamsterSchreibComment = () => lm({
        "de": "Gibt den Text auf dem Bildschirm aus.",
        "en": "",
    })

    /**
     * class Position
     */
    static PositionClassComment = () => lm({
        "de": "Repräsentiert einen Position auf einem Gitternetz (nur ganzzahlige Koordinaten)",
        "en": "Position inside a grid (only integer coordinates)",
    })

    static PositionXComment = () => lm({
        "de": "x-Komponente der Position",
        "en": "x-component of Position",
    })

    static PositionYComment = () => lm({
        "de": "y-Komponente der Position",
        "en": "y-component of Position",
    })

    static PositionConstructorComment = () => lm({
        "de": "Instanziert eine neue Position den Komponenten x und y.",
        "en": "Creates a new Position object with components x and y",
    })

    /**
     * class BigInteger
     */

    static BigIntegerClassComment = () => lm({
        "de": "Repräsentiert eine ganze Zahl mit 'beliebig' vielen Stellen.",
        "en": "Integer number with arbitrary number of digits.",
    })

    static BigIntegerConstructorComment = () => lm({
        "de": "Instanziert ein neues BigInteger-Objekt.",
        "en": "Creates a new BigInteger-object.",
    })

    static BigIntegerAddComment = () => lm({
        "de": "Addiert das übergebene BigInteger-Objekt zum aktuellen BigInteger-Objekt und gibt ein neues BigInteger-Objekt zurück, dessen Wert die errechnete Summe ist. Die Methode add ändert nicht das aktuelle BigInteger-Objekt!",
        "en": "Adds given BigInteger-object to this BigInteger-object and returns a NEW BigInteger-object whose value is the sum of the two.",
    })

    static BigIntegerDivideComment = () => lm({
        "de": "Dividiert das BigInteger-Objekt durch das übergebene undd gibt ein neues BigInteger-Objekt zurück, dessen Wert der errechnete Quotient ist. Die Methode add ändert nicht das aktuelle BigInteger-Objekt!",
        "en": "Divides this BigInteger-object by given one and returns a NEW BigInteger-object whose value is the quotient of the two.",
    })

    static BigIntegerRemainderComment = () => lm({
        "de": "Dividiert das BigInteger-Objekt durch das übergebene undd gibt ein neues BigInteger-Objekt zurück, dessen Wert der Rest der Division ist. Die Methode add ändert nicht das aktuelle BigInteger-Objekt!",
        "en": "Divides this BigInteger-object by given one and returns a NEW BigInteger-object whose value is the remainder of this division.",
    })

    static BigIntegerMultiplyComment = () => lm({
        "de": "Multipliziert das aktuelle Objekt mit dem übergebenen BigInteger-Objekt und gibt ein neues BigInteger-Objekt zurück, dessen Wert das Produkt der beiden Zahlen ist. Die Methode multiply ändert nicht das aktuelle BigInteger-Objekt!",
        "en": "Multiplies this BigInteger-object by given one and returns a NEW BigInteger-object whose value is the product of the two.",
    })

    static BigIntegerToStringComment = () => lm({
        "de": "Gibt das BigInteger-Objekt als Zeichenkette (dezimal!) zurück.",
        "en": "Returns this BigInteger-object as string in decimal representation.",
    })

    static BigIntegerIntValueComment = () => lm({
        "de": "Gibt das BigInteger-Objekt mod (2^53) als int-Wert zurück.",
        "en": "Returns this BigInteger-object mod (2^53) as int-value.",
    })

    /**
     * class Console
     */
    static ConsoleClassComment = () => lm({
        "de": "Klasse zur Ausgabe von Objekten in der Konsole des Browsers.",
        "en": "Class to Output text in console.",
    })

    static ConsoleLogComment = () => lm({
        "de": "Gibt das  in die Konsole des Browsers.",
        "en": "Writes Object to Console.",
    })

    /**
     * Vector2
     */
    static Vector2ClassComment = () => lm({
        "de": "Ein zweidimensionaler Vektor mit double-Koordinaten.",
        "en": "2-dimensional vector with double-precision.",
    })

    static Vector2ConstructorComment = () => lm({
        "de": "Erstellt einen neuen Vektor mit den Koordinaten (x, y).",
        "en": "Creates a new vector with given coordinates.",
    })

    static Vector2ToStringComment = () => lm({
        "de": "Wandelt den Vektor in einen String der Form (x, y) um.",
        "en": "Transforms vector into String (x, y).",
    })

    static Vector2FromPolarCoordinatesComment = () => lm({
        "de": "Gibt einen neuen zweidimensionalen Vektor zurück, der mit den Polarkoordinaten (r/alphaDeg) gebildet wird. Datei ist r (Abstand zum Ursprung des Koordinatensystems) und alphaDeg (Winkel zur positiven x-Achse in Grad).",
        "en": "Creates a new Vector2-object from given polar coordinates r, alphaDeg. r is it's length, alphaDeg it's angle towards the positive x-axis.",
    })

    static Vector2GetAngleDegComment = () => lm({
        "de": "Gibt den Winkel zur positiven x-Achse in Grad zurück.",
        "en": "Returns angle towards positive x-axis in degrees.",
    })

    static Vector2GetAngleRadComment = () => lm({
        "de": "Gibt den Winkel zur positiven x-Achse im Bogenmaß (rad) zurück.",
        "en": "Returns angle towards positive x-axis in radians.",
    })

    static Vector2GetLengthComment = () => lm({
        "de": "Gibt die Länge des Vektors zurück.",
        "en": "Returns length of this vector.",
    })

    static Vector2GetUnitVectorComment = () => lm({
        "de": "Gibt einen NEUEN Vektor zurück, der parallel zu diesem ist aber die Länge 1 besitzt.",
        "en": "Returns a NEW Vector parallel to this one but with length 1.",
    })

    static Vector2SetLengthComment = () => lm({
        "de": "Streckt/staucht das Vector2-Objekt auf die angegebene Länge und gibt es zurück (für Method-Chaining!). Das Vector2-Objekt wird dabei verändert!",
        "en": "Scales this Vector2-object to given length and returns it for method chaining.",
    })

    static Vector2ScaledByComment = () => lm({
        "de": "Gibt ein NEUES Vector2-Objekt zurück, das parallel zu diesem ist aber um den angegebenen Faktor gestreckt ist.",
        "en": "Returns a NEW Vector2-object parallel to this one but with given length.",
    })

    static Vector2ScaleComment = () => lm({
        "de": "Streckt das Vector2-Objekt um den angegebenen Faktor und gibt es zurück (für Method-Chaining!). Diese Methode VERÄNDERT dieses Objekt!",
        "en": "Scales Vector2-object by given factor and returns it (for method chaining). This method ALTERS this object!",
    })

    static Vector2RotateComment = () => lm({
        "de": "Rotiert das Vector2-Objekt um den angegebenen Winkel (in Grad) und gibt es zurück (für Method-Chaining!). Positive Winkel bedeuten eine Drehung ENTGEGEN dem Uhrzeigersinn.",
        "en": "Rotates this Vector2-object by given angle (in degrees) and returns it for method chaining. Positve angles lead to COUNTERCLOCKWISE rotation.",
    })

    static Vector2RotatedByComment = () => lm({
        "de": "Gibt ein NEUES Vector2-Objekt zurück, das um den angegebenen Winkel (in Grad) gedreht ist. Positive Winkel bedeuten eine Drehung ENTGEGEN dem Uhrzeigersinn.",
        "en": "Returns a NEW Vector2-object rotated by given angle (in degrees). Positve angles lead to COUNTERCLOCKWISE rotation.",
    })

    static Vector2PlusComment = () => lm({
        "de": "Gibt ein NEUES Vector2-Objekt zurück, das aus Addition der beiden Vektoren entsteht.",
        "en": "Returns a NEW Vector2-object which is the sum of the two vectors.",
    })

    static Vector2MinusComment = () => lm({
        "de": "Gibt ein NEUES Vector2-Objekt zurück, das aus Subtraktion der beiden Vektoren entsteht.",
        "en": "Returns a NEW Vector2-object which is the difference of the two vectors.",
    })

    static Vector2AddComment = () => lm({
        "de": "Addiert den übergebenen Vektor zu diesem und gibt diesen zurück (für Method-Chaining!). Diese Methode VERÄNDERT dieses Objekt!",
        "en": "Adds given vector to this one and returns this one. This Method ALTERS this object!",
    })

    static Vector2SubComment = () => lm({
        "de": "Subtrahiert den übergebenen Vektor von diesem und gibt diesen zurück (für Method-Chaining!). Diese Methode VERÄNDERT dieses Objekt!",
        "en": "Subtracts given vector from this one and returns this one. This Method ALTERS this object!",
    })

    static Vector2ScalarProductComment = () => lm({
        "de": "Gibt das Skalarprodukt der beiden Vektoren zurück.",
        "en": "Returns scalar product of vectors.",
    })

    static Vector2DistanceComment = () => lm({
        "de": "Berechnet den Abstand der beiden Punkte (x1, y1) und (x2, y2).",
        "en": "Returns distance of given points (x1, y1) and (x2, y2).",
    })

    static Vector2DistanceToComment = () => lm({
        "de": "Berechnet die Länge der Differenz der beiden Vektoren.",
        "en": "Returns the length of the difference of both vectors.",
    })

    static Vector2XComment = () => lm({
        "de": "X-Komponente des Vektors",
        "en": "x-component",
    })

    static Vector2YComment = () => lm({
        "de": "Y-Komponente des Vektors",
        "en": "y-component",
    })

    /**
     * class MathTools
     */
    static MathToolsClassComment = () => lm({
        "de": "Klasse mit mathematischen Hilfsfunktionen als statische Methoden",
        "en": "Class with mathematical/geometrical tools.",
    })

    static MathToolsIntersectCircleWithPolygonComment = () => lm({
        "de": "Zu einem gegebenen Kreis werden die Punkte berechnet, die auf den Seiten eines gegebenen Polygons liegen.",
        "en": "Intersects given circle with given polygon.",
    })

    static MathToolsIntersectLineSegmentsComment = () => lm({
        "de": "Berechnet den Schnittpunkt der Strecken [p0, p1] und [p2, p3]. Gibt null zurück, wenn sich die Strecken nicht schneiden oder wenn sie parallel sind und teilweise aufeinander liegen.",
        "en": "Calculates intersection of Line segments [p0, p1] and [p2, p3]. Returns null if line segments don't intersect.",
    })

    static MathToolsPolygonContainsPointComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn das Polygon den Punkt enthält.",
        "en": "Returns true if and only if given Polygon contains given point.",
    })

    static MathToolsDistancePointToLineComment = () => lm({
        "de": "Berechnet den Abstand des Punktes P zur Gerade AB.",
        "en": "Calculates distance from point P to line AB.",
    })

    static MathToolsDistancePointToLineSegmentComment = () => lm({
        "de": "Berechnet den Abstand des Punktes P zur Gerade AB.",
        "en": "Calculates distance from point P to line segment [AB].",
    })

    /**
     * System class
     */

    static SystemClassComment = () => lm({
        "de": "Klasse mit statischen Methoden für Systemfunktionen.",
        "en": "Class with static methods for system function.",
    })

    static SystemExitComment = () => lm({
        "de": "Beendet das Programm und gibt den übergebenen Wert in der Konsole aus.",
        "en": "Exits program and prints given value to console.",
    })

    static SystemCurrentTimeMillisComment = () => lm({
        "de": "Gibt die Anzahl der Millisekunden, die seit dem 01.01.1970 00:00:00 UTC vergangen sind, zurück.",
        "en": "Milliseconds since 1970-01-01 00:00:00 UTC.",
    })

    static SystemOutComment = () => lm({
        "de": "PrintStream-Objekt, mit dem Text ausgegeben werden kann.",
        "en": "PrintStream-object to print text.",
    })

    /**
     * class PrintStream
     */
    static PrintStreamClassComment = () => lm({
        "de": "Interne Hilfsklasse, um System.out.println zu ermöglichen. Das Objekt System.out ist von der Klasse PrintStream.",
        "en": "Internal auxiliary class to make System.out.println possible. Object System.out is of class PrintStream.",
    })

    static PrintStreamPrintComment = () => lm({
        "de": "Gibt den Text aus.",
        "en": "Prints Text.",
    })

    static PrintStreamPrintlnComment = () => lm({
        "de": "Gibt den Text aus, gefolgt von einem Zeilenumbruch.",
        "en": "Prints Text followed by a line break.",
    })

    static PrintStreamPrintlnComment2 = () => lm({
        "de": "Gibt einen Zeilenumbruch aus.",
        "en": "Prints a line break.",
    })

    /**
     * class Gamepad
     */
    static GamepadClassComment = () => lm({
        "de": "Klasse mit statischen Methoden zur Abfrage der Gamepads.",
        "en": "class with static methods to get gamepad state.",
    })

    static GamepadIsButtonDownComment = () => lm({
        "de": "Gibt genau dann true zurück, wenn der Button buttonIndex des Gamepads GamepadIndex gedrückt ist. VORSICHT: Das erste Gamepad hat Index 0.",
        "en": "Returns true if and only if button buttonIndex is pressed on gamepad with index gamepadIndex. BEWARE: First gamepad has index 0.",
    })

    static GamepadIsConnectedComment = () => lm({
        "de": "Gibt true zurück, falls das Gamepad mit dem übergebenen Index angeschlossen ist. VORSICHT: Das erste Gamepad hat Index 0.",
        "en": "Returns true if gamepad with given index is connected. BEWARE: First gamepad has index 0.",
    })

    static GamepadGetAxisValueComment = () => lm({
        "de": "Gibt den Wert des Gamepad-Steuerknüppels mit Index axisIndex zurück.",
        "en": "Returns value of gamepad-stick with given index",
    })

    /**
     * class SystemTools
     */
    static SystemToolsClassComment = () => lm({
        "de": "Klasse mit statischen Methoden für Systemfunktionen, z.B. Löschen der Ausgabe, Registrieren eines Tastaturlisteners usw.",
        "en": "Class with static system Methods, e.g. clear text output, register keyboard listener",
    })

    static SystemToolsClearScreenComment = () => lm({
        "de": "Löscht den Textausgabe-Bildschirm",
        "en": "Clears text output.",
    })

    static SystemToolsSetSpeedComment = () => lm({
        "de": "Setzt die Ausführungsgeschwindigkeit. Der Parameter speed wir in Steps/Sekunde angegeben. Eine negative Zahl bedeutet: 'maximal'.",
        "en": "Sets speed in which program is executed. Parameter speed is given in steps/second. A negative value for speed means: maximum speed.",
    })

    static SystemToolsGetSpeedComment = () => lm({
        "de": "Gibt die Ausführungsgeschwindigkeit in Steps pro Sekunde zurück.",
        "en": "Returns execution speed in steps/second.",
    })

    static SystemToolsPauseComment = () => lm({
        "de": "Pausiert das Programm für die angegebene Zeit in ms.",
        "en": "Makes current thread pause execution for given time in ms.",
    })

    static SystemToolsGetStepCountComment = () => lm({
        "de": "Gibt die Anzahl der seit dem Start des Programms ausgeführten Steps (== Programmschritte) zurück.",
        "en": "Gets number of steps since program start.",
    })

    static SystemToolsAddKeyListenerComment = () => lm({
        "de": "Fügt einen KeyListener hinzu, dessen Methode keyTyped immer dann aufgerufen wird, wenn eine Taste gedrückt und anschließend losgelassen wird.",
        "en": "Adds a KeyListener whose method keyTyped is called every time a key was pressed and subsequently released.",
    })

    static SystemToolsPauseTimeLower0 = () => lm({
        "de": "Der Parameter milliseconds der Methode SystemTools.pause muss >= 0 sein.",
        "en": "Parameter milliseconds of method SystemTools.pause has to be >= 0.",
    })


    /**
     * interface KeyListener
     */
    static KeyListenerInterfaceComment = () => lm({
        "de": "Interface mit Methode onKeyTyped. Eine Klasse, die dieses Interface implementiert, kann auf Tastatureingaben reagieren. Ein Objekt dieser Klasse muss zuvor aber mit System.addKeyListener() registriert werden.",
        "en": "Interface with method onKeyTyped. Register a KeyListener with SystemTools.addKeyListener().",
    })

    static KeyListenerOnKeyTypedComment = () => lm({
        "de": "Wird aufgerufen, nachdem eine Taste gedrückt und wieder losgelassen wurde.",
        "en": "Is called if a key was pressed and then released.",
    })

    /**
     * class Timer
     */
    static TimerClassComment = () => lm({
        "de": "Timer Klasse zur periodischen Ausführung von Methoden",
        "en": "Class Timer to execute methods periodically",
    })

    static TimerClassRepeatComment = () => lm({
        "de": "Fügt ein neues Runnable-Objekt hinzu und ruft dessen tick-Methode immer wieder auf.",
        "en": "Adds a new Runnable object and call it's run-method periodically.",
    })

    static TimerClassPauseComment = () => lm({
        "de": "Hält den Timer an. Er kann später mit der Methode restart() wieder gestartet werden.",
        "en": "Pauses timer. Use method restart() to restart it later.",
    })

    static TimerClassRestartComment = () => lm({
        "de": "Startet den Timer erneut, nachdem er mit pause() pausiert wurde.",
        "en": "Restart timer if it had been paused with pause()-method.",
    })

    static TimerClassExecuteLaterComment = () => lm({
        "de": "Führt die übergebene Methode nach dt millisekunden ein Mal aus.",
        "en": "Waits dt milliseconds and then executes given method once.",
    })

    /**
     * class Input
     */
    static InputClassComment = () => lm({
        "de": "Klasse mit statischen Methoden zur Eingabe von Text per Tastatur",
        "en": "Class with static Method to retrieve input from keyboard.",
    })

    static InputClassReadCharComment = () => lm({
        "de": "Erwartet vom Benutzer die Eingabe eines Wertes vom Datentyp char",
        "en": "Takes char-input from user.",
    })

    static InputClassReadIntComment = () => lm({
        "de": "Erwartet vom Benutzer die Eingabe eines Wertes vom Datentyp int",
        "en": "Takes int-input from user.",
    })

    static InputClassReadDoubleComment = () => lm({
        "de": "Erwartet vom Benutzer die Eingabe eines Wertes vom Datentyp double",
        "en": "Takes double-input from user.",
    })

    static InputClassReadFloatComment = () => lm({
        "de": "Erwartet vom Benutzer die Eingabe eines Wertes vom Datentyp float",
        "en": "Takes float-input from user.",
    })

    static InputClassReadBooleanComment = () => lm({
        "de": "Erwartet vom Benutzer die Eingabe eines Wertes vom Datentyp boolean",
        "en": "Takes boolean-input from user.",
    })

    static InputClassReadStringComment = () => lm({
        "de": "Erwartet vom Benutzer die Eingabe eines Wertes vom Datentyp String",
        "en": "Takes String-input from user.",
    })

    static InputClassBooleanError = () => lm({
        "de": "Erwartet wird true oder false.",
        "en": "true or false expected.",
    })

    static InputClassFloatError = () => lm({
        "de": "Erwartet wird eine Fließkommazahl mit Dezimalpunkt, z.B. 1.2 oder 1.34e-10 oder -3e-10.",
        "en": "Floating point value with decimal point expected, e.g. 1.2 or 1.34e-10 or -3e-10.",
    })

    static InputClassCharError = () => lm({
        "de": "Erwartet wird ein einzelnes Zeichen.",
        "en": "Single character expected.",
    })

    static InputClassIntError = () => lm({
        "de": "Erwartet wird eine ganze Zahl.",
        "en": "Integer value expected.",
    })

    /**
     * class GUIComponent
     */
    static GUIComponentClassComment = () => lm({
        "de": "Oberklasse für alle GUI-Komponenten",
        "en": "Base class of all GUI components",
    })

    static GUIComponentOnChangeComment = () => lm({
        "de": "Wird aufgerufen, wenn sich der Wert der GUI-Komponente aufgrund von Benutzeraktionen ändert.",
        "en": "Gets called whenever this GUI-Component changes it's value.",
    })

    static GUIComponentAddChangeListenerComment = () => lm({
        "de": "Fügt einen ChangeListener hinzu, dessen onChange-Methode immer dann aufgerufen wird, wenn sich der Wert der GUI-Komponente aufgrund von Benutzeraktionen ändert.",
        "en": "Adds a ChangeListener whose onChange-method gets called whenever this component's value changes.",
    })

    static GUIComponentGetWidthComment = () => lm({
        "de": "Gibt die Breite des GUI-Objekts zurück.",
        "en": "Returns width of this GUI object.",
    })

    static GUIComponentGetHeightComment = () => lm({
        "de": "Gibt die Höhe des GUI-Objekts zurück.",
        "en": "Returns height of this GUI object.",
    })

    /**
     * class GuiTextComponent
     */
    static GuiTextComponentClassComment = () => lm({
        "de": "Abstrakte Oberklasse für alle Gui-Komponenten mit Textanteil",
        "en": "Abstract base class for all GUI components that display text",
    })

    static GuiTextComponentSetFontsizeComment = () => lm({
        "de": "Setzt die Schriftgröße des Textes (Einheit: Pixel).",
        "en": "Set fontsize in pixels.",
    })

    static GuiTextComponentGetFontsizeComment = () => lm({
        "de": "Gibt die Schriftgröße zurück.",
        "en": "Returns fontsize.",
    })

    static GuiTextComponentSetTextComment = () => lm({
        "de": "Setzt den Text.",
        "en": "Set text of this component.",
    })

    static GuiTextComponentGetTextComment = () => lm({
        "de": "Gibt den Text zurück.",
        "en": "Returns text of this component.",
    })

    static GuiTextComponentSetStyleComment = () => lm({
        "de": "Setzt die Eigenschaften Fettdruck (bold) und Schrägschrift (italic).",
        "en": "Set style of text (bold, italic).",
    })

    static GuiTextComponentSetTextColor = () => lm({
        "de": "Setzt die Textfarbe. Die Farbe wird als int-Wert gegeben, wobei farbe == 256*256*rot + 256*grün + blau",
        "en": "Set text color. Color is given as int value: color == 256*256*red + 256*green + blue",
    })

    /**
     * interface ChangeListener
     */
    static ChangeListenerInterfaceComment = () => lm({
        "de": "Listener-Interface für GUI-Klassen (Button, TextField, Checkbox, Radiobutton)",
        "en": "Listener interface for GUI classes (Button, TextField, Checkbox, Radiobutton)",
    })

    static ChangeListenerOnChangeComment = () => lm({
        "de": "Wird immer dann aufgerufen, wenn sich das GUI-Objekt verändert hat.",
        "en": "Gets called whenever the GUI-object has changed.",
    })

    /**
     * class Button
     */
    static ButtonClassComment = () => lm({
        "de": "Button, der innerhalb der Grafikausgabe dargestellt werden kann",
        "en": "Button inside graphics pane",
    })

    static ButtonConstructorComment = () => lm({
        "de": "Instanziert ein neues Button-Objekt. (x, y) sind die Koordinaten der linken oberen Ecke, fontsize die Höhe des Textes in Pixeln.",
        "en": "Creates a new Button object. (x,y) is it's top left corner, fontsize the height of it's caption in pixels.",
    })

    static ButtonCopyComment = () => lm({
        "de": "Erstellt eine Kopie des Button-Objekts und git sie zurück.",
        "en": "Creates a copy of this button and returns it.",
    })

    /**
     * class CheckBox
     */

    static CheckBoxClassComment = () => lm({
        "de": "Checkbox, die innerhalb der Grafikausgabe dargestellt werden kann",
        "en": "Checkbox inside graphics pane",
    })

    static CheckBoxConstructorComment = () => lm({
        "de": "Instanziert ein neues CheckBox-Objekt. (x, y) sind die Koordinaten der linken oberen Ecke, fontsize die Höhe des Textes in Pixeln.",
        "en": "Creates a new CheckBox object. (x,y) is it's top left corner, fontsize the height of it's caption in pixels.",
    })

    static CheckBoxCopyComment = () => lm({
        "de": "Erstellt eine Kopie der CheckBox.",
        "en": "Creates a copy of this CheckBox.",
    })

    static CheckBoxSetCrossColorComment = () => lm({
        "de": "Setzt die Farbe des Kreuzchens. Die Farbe wird als int-Wert gegeben, wobei farbe == 256*256*rot + 256*grün + blau",
        "en": "Sets color of cross. Color is given as int value: color = 256<*256*red + 256*green + blue.",
    })

    static CheckBoxSetCheckedComment = () => lm({
        "de": "Setzt den Zustand der Checkbox: angekreuzt bzw. nicht angekreuzt",
        "en": "Sets state checked/unchecked of this checkbox.",
    })

    static CheckBoxIsCheckedComment = () => lm({
        "de": "Gibt genau dann true zurück, falls die Checkbox angekreuzt ist.",
        "en": "Returns true if and only if this checkbox is checked.",
    })


    /**
     * Radiobutton class
     */

    static RadiobuttonClassComment = () => lm({
        "de": "Radiobutton, der innerhalb der Grafikausgabe dargestellt werden kann",
        "en": "Radiobutton inside graphics pane",
    })

    static RadiobuttonConstructorComment = () => lm({
        "de": "Instanziert ein neues Radiobutton-Objekt. (x, y) sind die Koordinaten der linken oberen Ecke, fontsize die Höhe des Textes in Pixeln.",
        "en": "Creates a new Radiobutton object. (x,y) is it's top left corner, fontsize the height of it's caption in pixels.",
    })

    static RadiobuttonCopyComment = () => lm({
        "de": "Erstellt eine Kopie des Radiobutton.",
        "en": "Creates a copy of this Radiobutton.",
    })

    static RadiobuttonGetIndexComment = () => lm({
        "de": "Gibt den Index des Radiobuttons zurück.",
        "en": "Returns this radiobutton's index.",
    })

    static RadiobuttonGetIndexOfSelectedRadiobuttonComment = () => lm({
        "de": "Sind mehrere Radiobuttons mittels connectTo mit dieserm logisch verbunden, so ist genau einer davon selektiert. Diese Methode gibt den Index dieses selektierten Radiobuttons zurück.",
        "en": "If threre are several radiobuttons grouped together via method connectTo then this method returns the selected radiobutton's index.",
    })

    static RadiobuttonGetTextOfSelectedRadiobuttonComment = () => lm({
        "de": "Sind mehrere Radiobuttons mittels connectTo mit dieserm logisch verbunden, so ist genau einer davon selektiert. Diese Methode gibt den Text dieses selektierten Radiobuttons zurück.",
        "en": "If threre are several radiobuttons grouped together via method connectTo then this method returns the selected radiobutton's text.",
    })

    static RadiobuttonSetIndexComment = () => lm({
        "de": "Setzt den Index des Radiobuttons.",
        "en": "Set this radiobutton's index.",
    })

    static RadiobuttonSetDotColorComment = () => lm({
        "de": "Setzt die Farbe des Punktes. Die Farbe wird als int-Wert gegeben, wobei farbe == 256*256*rot + 256*grün + blau",
        "en": "Sets dot color of this radiobutton. Color is given as int-value: color = 256*256*red + 256*green + blue",
    })

    static RadiobuttonConnectToComment = () => lm({
        "de": "Verbindet diesen Radiobutton logisch mit den anderen Radiobuttons. Wird anschließend auf einen davon geklickt, so wird dieser selektiert, die anderen deselektiert.",
        "en": "Connects this radiobutton with given radiobuttons to a radiobutton group. If you click at one of them subsequently then all others get deselected so that only one of them is selected at any given time.",
    })

    static RadiobuttonIsSelectedComment = () => lm({
        "de": "Gibt genau dann true zurück, falls die RadioButton selektiert ist.",
        "en": "Returns true if and only if this radiobutton is selected.",
    })

    static RadiobuttonSelectComment = () => lm({
        "de": "Selektiert diesen Radiobutton und deselektiert alle via connectTo mit ihm verbundenen Radiobuttons.",
        "en": "Selects this Radiobutton and deselects all Radiobuttons in same group as this one.",
    })

    /**
     * class Textfield
     */

    static TextfieldClassComment = () => lm({
        "de": "Textfeld, das innerhalb der Grafikausgabe dargestellt werden kann",
        "en": "Textfield inside graphic panel",
    })

    static TextfieldConstructorComment = () => lm({
        "de": "Instanziert ein neues TextField-Objekt. (x, y) sind die Koordinaten der linken oberen Ecke, fontsize die Höhe des Textes in Pixeln.",
        "en": "Creates a new Textfield. (x, y) is it's top left edge, fontsize it's text height in pixels.",
    })

    static TextfieldCopyComment = () => lm({
        "de": "Erzeugt eine Kopie des Textfield-Objekts",
        "en": "Creates a clone of this Textfield object",
    })

    static TextfieldSetPaddingComment = () => lm({
        "de": "'Setzt den Innenabstand (padding) des Textes zum umgebenden Rechteck.",
        "en": "Sets the padding between text and surrounding rectangle.",
    })

    /**
     *  class Sound
     */

    static SoundClassComment = () => lm({
        "de": "Klasse mit statischen Methoden und statischen Konstanten zur Ausgabe von Sound",
        "en": "Class with static methods and static constants to play sound.",
    })

    static SoundGetVolumeComment = () => lm({
        "de": "Gibt die aktuelle Mikrofonlautstärke zurück. Beim ersten Aufruf muss der Benutzer dem Browser die Erlaubnis zur Benutzung des Mikrofons geben. Solange dies noch nicht erfolgt ist, gibt die Funktion den Wert -1 zurück.",
        "en": "Returns current microphone level.",
    })

    static SoundPlaySoundComment = () => lm({
        "de": "Spielt einen Sound ab. Die Möglichen Sounds sind als statische Variablen der Klasse Sound hinterlegt. Tippe als Parameter also Sound gefolgt von einem Punkt ein, um eine Auswahl zu sehen!",
        "en": "Plays given sound. Possible sounds are given by static fields of Sound class.",
    })

    /**
     * FileNotFoundException
     */
    static FileNotFoundExceptionComment = (filename: string) => lm({
        "de": "Konnte die Datei '" + filename + "' nicht finden.",
        "en": "File not found: '" + filename + "'",
    })

    /**
     * class Files
     */
    static FilesClassComment = () => lm({
        "de": "Klasse mit statischen Methoden zum Lesen/Schreiben von Dateien.",
        "en": "Class with static methods to read/write files.",
    })

    static FilesReadComment = () => lm({
        "de": "Gibt den Inhalt der Workspacedatei zurück.",
        "en": "Returns content of workspace file with given filename.",
    })

    static FilesWriteComment = () => lm({
        "de": "Schreibt den Text in die Workspacedatei.",
        "en": "Erases workspace file and then writes given text into it.",
    })

    static FilesAppendComment = () => lm({
        "de": "Fügt den Text hinten an die Workspacedatei an.",
        "en": "Appends given text to workspace file.",
    })

    /**
     * JsonElement
     */
    static JsonElementClassComment = () => lm({
        "de": "Repräsentiert einen Knoten in einem Json-Objektbaum.",
        "en": "Represents a single node inside a json object tree.",
    })

    static JsonElementGetTypeComment = () => lm({
        "de": 'Gibt den Typ des Json-Elements zurück. Mögliche Werte sind "string", "number", "array", "boolean" und "object".',
        "en": 'Returns the type of this Json-Element. Possible values are "string", "number", "array", "boolean" and "object".',
    })

    static JsonElementGetArrayValuesComment = () => lm({
        "de": "Falls das Json-Element ein Array ist, gibt diese Funktion es als Array von Json-Elementen zurück, andernfalls wirft sie eine Exception.",
        "en": "If this Json element is an array, this method returns the corresponding array of json elements, otherwise it throws an Exception.",
    })

    static JsonElementNoArrayException = () => lm({
        "de": "Das Json-Element ist kein Array, daher kann getArrayValues() kein Array zurückgeben.",
        "en": "This json element is no array, therefore getArrayValues() cannot return an array of json elements.",
    })

    static JsonElementNoObjectException = () => lm({
        "de": "Das Json-Element ist kein Objekt, daher kann getAttributeValue() keinen Attributwert zurückgeben.",
        "en": "This json element is no object, therefore getAttributeValue() cannot return an attribute value.",
    })

    static JsonElementGetAttributeValueComment = () => lm({
        "de": "Falls das Json-Element ein Objekt ist, gibt diese Funktion den Wert seines Attributs mit dem übergebenen Bezeichner als JsonElement zurück.",
        "en": "If this json element is an object, this method returns the value of it's field with given identifier.",
    })

    static JsonElementGetAsStringComment = () => lm({
        "de": "Gibt den String-Wert des JSon-Elements zurück.",
        "en": "Returns string-value of this json element.",
    })

    static JsonElementNoStringExceptionComment = () => lm({
        "de": "Das Json-Element ist kein String, daher kann getAsString() keinen Wert zurückgeben.",
        "en": "This json element is no string, therefore method getAsString() cannot return a string value.",
    })

    static JsonElementGetAsIntComment = () => lm({
        "de": "Gibt den int-Wert des JSon-Elements zurück.",
        "en": "Returns int value of this json element.",
    })

    static JsonElementNoIntValueException = () => lm({
        "de": "Das Json-Element ist keine Zahl, daher kann getAsInt() keinen Wert zurückgeben.",
        "en": "This json element is no number, therefore getAsInt() cannot return an int value.",
    })

    static JsonElementToJsonComment = () => lm({
        "de": "Gibt den Wert des Json-Elements als Json-codierten String zurück.",
        "en": "Returns value of this json element as json encoded string.",
    })

    static JsonElementGetAsDoubleComment = () => lm({
        "de": "Gibt den double-Wert des JSon-Elements zurück.",
        "en": "Returns double value of this json element.",
    })

    static JsonElementNoDoubleException = () => lm({
        "de": "Das Json-Element ist keine Zahl, daher kann getAsDouble() keinen Wert zurückgeben.",
        "en": "This json element is no number, therefore method getAsDouble() cannot return a double value.",
    })

    static JsonElementGetAsBooleanComment = () => lm({
        "de": "Gibt den boolean-Wert des JSon-Elements zurück.",
        "en": "Returns boolean value of this json element.",
    })

    static JsonElementNoBooleanException = () => lm({
        "de": "Das Json-Element ist kein boolescher Wert, daher kann getAsBoolean() keinen Wert zurückgeben.",
        "en": "This json element is no boolean value, therefore method getAsBoolean() cannot return a boolean value.",
    })

    static JsonElementGetAttributeIdentifiersComment = () => lm({
        "de": "Falls das Json-Element ein Objekt ist, gibt diese Funktion ein Array mit seinen Attributbezeichnern zurück.",
        "en": "If this json element is an object, this method returns an array with it's field identifiers.",
    })

    static JsonElementGetAttributeIdentifiersException = () => lm({
        "de": "Das Json-Element ist kein Objekt, daher kann diese Methode kein Array von Attributbzeichnern liefern.",
        "en": "This json element is no object, therefore this method cannot return an array with field identifiers.",
    })

    /**
     * class HttpHeader
     */
    static HttpHeaderComment = () => lm({
        "de": "Ein Http-Header ist ein Schlüssel-Wert-Paar (key-value-pair).",
        "en": "A Http-header is a key-value-pair.",
    })

    static HttpHeaderKeyComment = () => lm({
        "de": "Schlüssel (key) des Http-Headers",
        "en": "key of this header",
    })

    static HttpHeaderValueComment = () => lm({
        "de": "Wert (value) des Http-Headers",
        "en": "value of this header",
    })

    /**
     * class JsonParser
     */
    
    static JsonParserClassComment = () => lm({
    "de": "Parst Json-Code und gibt ihn als Objektbaum zurück.",
    "en": "Parses Json-code and builds object tree.",
    })

    static JsonParserParseComment = () => lm({
    "de": "Wandelt einen Json-String in einen Objektbaum um.",
    "en": "Transforms Json-string to object tree.",
    })

    static JsonParserParseException = (error: string) => lm({
    "de": "Fehler beim Parsen des Json-Strings: " + error,
    "en": "Error parsing json-string: " + error,
    })

    /**
     * class HttpRequest
     */
    static HttpRequestClassComment = () => lm({
    "de": "Ein Objekt der Klasse HttpRequest umfasst die URI, den Header und die Daten eines Http-Requests.",
    "en": "An object of class HttpRequest consists of URI, Header and data (body).",
    })

    static HttpRequestConstructorComment = () => lm({
    "de": "Instanziert ein neues HttpRequest-Objekt.",
    "en": "Creates a new HttpRequest-object.",
    })

    static HttpRequestUriComment = () => lm({
    "de": "Legt die URI des Requests fest. Gibt ein HttpRequest-Objekt zurück (zum method-chaining).",
    "en": "Sets the URI of this request. Returns a HttpRequest-object for method chaining.",
    })


    static HttpRequestHeaderComment = () => lm({
    "de": "Fügt dem Request einen Header hinzu.",
    "en": "Adds a header to this request.",
    })

    static HttpRequestPOSTComment = () => lm({
    "de": "Setzt die Request-Methode auf POST und fügt dem Request die übergebenen Daten hinzu.",
    "en": "Sets request method to POST and adds given data to this request.",
    })

    static HttpRequestGETComment = () => lm({
    "de": "Setzt die Request-Methode auf GET.",
    "en": "Sets request method to GET.",
    })


    /**
     * class HttpResponse
     */
    static HttpResponseClassComment = () => lm({
    "de": "Ein Objekt der Klasse HttpResponse umfasst den Statuscode, die Header und den Body (d.h. die Daten) eines http-Response.",
    "en": "An object of class HttpResponse consists of status code, headers and body (that is: data) of an http-response.",
    })

    static HttpResponseUriComment = () => lm({
    "de": "Gibt die URI des Responses zurück.",
    "en": "Returns the URI of this response.",
    })

    static HttpResponseBodyComment = () => lm({
    "de": "Gibt den Body dieses Responses zurück.",
    "en": "Returns the body of this response.",
    })

    static HttpResponseStatusCodeComment = () => lm({
    "de": "Gibt den Statuscode dieses Responses zurück.",
    "en": "Returns the status code of this response.",
    })

    static HttpResponseStatusTextComment = () => lm({
    "de": "Gibt den den http-Status dieses Responses in Textform zurück.",
    "en": "Returns the status of this response as text (string).",
    })

    static HttpResponseRequestComment = () => lm({
    "de": "Gibt das Request-Objekt zurück, das diesen Response zur Folge hatte.",
    "en": "Returns the request-object whicht lead to this response.",
    })    

    static HttpResponseHeadersComment = () => lm({
    "de": "Gibt die Header dieses Responses zurück.",
    "en": "Returns the headers of this response.",
    })


    static HttpClientComment = () => lm({
    "de": "Ein Objekt der Klasse HttpClient kann Http-Requests senden.",
    "en": "An object of class HttpClient can send HTTP-requests.",
    })

    static HttpClientSendComment = () => lm({
    "de": "Sendet den Request an den Server.",
    "en": "Sends request to server.",
    })

    static HttpClientConstructorComment = () => lm({
    "de": "Instanziert ein neues HttpClient-Objekt.",
    "en": "Creates a new HttpClient-object.",
    })




}  