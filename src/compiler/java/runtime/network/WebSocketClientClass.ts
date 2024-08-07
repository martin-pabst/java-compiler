import { JRC } from "../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { WebSocketClass } from "./WebSocketClass";

export class WebSocketClientClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class WebSocketClient extends Object", comment: JRC.WebSocketClientClassComment},
        {type: "method", signature: "void send(string message, string messageType)", native: WebSocketClientClass.prototype.send, comment: JRC.WebSocketClientSendComment},
        {type: "method", signature: "void setUserData(string key, object value)", native: WebSocketClientClass.prototype.setUserData, comment: JRC.WebSocketClientSetUserDataComment},
        {type: "method", signature: "object getUserData(string key)", native: WebSocketClientClass.prototype.getUserData, comment: JRC.WebSocketClientGetUserDataComment},
        
        {type: "method", signature: "string getFirstName()", template: '§1.rufname'},
        {type: "method", signature: "string getLastName()", template: '§1.familienname'},
        {type: "method", signature: "string getNickName()", template: '§1.nickname'},
        {type: "method", signature: "string getUserName()", template: '§1.username'},
        
        {type: "field", signature: "string rufname"},
        {type: "field", signature: "string familienname"},
        {type: "field", signature: "string nickname"},
        {type: "field", signature: "string username"},
        
        {type: "method", signature: "string getNumber()", template: '§1.index' ,comment: JRC.WebSocketClientGetNumberComment},
        {type: "method", signature: "string getIndex()", template: '§1.index' ,comment: JRC.WebSocketClientGetIndexComment},

    ];

    static type: NonPrimitiveType;

    keyValueStore: { [key: string]: any } = {};
    index: number = 0;

    public connected: boolean = true;

    private webSocket!: WebSocketClass;

    private id: number = 0;
    public rufname: string = "";
    public familienname: string = "";
    public username: string = "";
    public nickname: string = "";


    send(message: string, messageType: string) {
        // TODO
        // this.webSocket.sendToClient(this.id, message, messageType);
    }

    getUserData(key: string): any {
        return this.keyValueStore[key];
    }

    setUserData(key: string, value: any) {
        this.keyValueStore[key] = value;
    }


}