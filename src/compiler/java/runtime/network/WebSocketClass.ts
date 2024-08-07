import { JRC } from "../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { WebSocketClientClass } from "./WebSocketClientClass";

export class WebSocketClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class WebSocket extends Object", comment: JRC.WebSocketClassComment},
        {type: "method", signature: "WebSocket()", native: WebSocketClass.prototype._constructor1, comment: JRC.WebSocketConstructorComment}
    ];

    static type: NonPrimitiveType;

    
    clientList: WebSocketClientClass[] = [];
    idToClientMap: { [id: number]: WebSocketClientClass } = {};
    
    connection?: WebSocket;
    client_id: number = 0; // own client-id
    isOpen: boolean = false;
        
    _constructor1() {
        super._constructor();
        return this;
    }

    // connect(t: Thread, callback: CallbackParameter, sessionCode: string, nickName: string) {

    //     if(t.scheduler.interpreter.runsEmbedded()){
    //         throw new RuntimeExceptionClass("Die Netzwerkfunktionalitäten stehen nur eingeloggten Nutzern in der Entwicklungsumgebung zur Verfügung und können daher leider hier nicht ausprobiert werden.");
    //     }


    //     ajax('getWebSocketToken', {}, (response: GetWebSocketTokenResponse) => {

    //         let url: string = (window.location.protocol.startsWith("https") ? "wss://" : "ws://") + window.location.host + "/servlet/websocket";
    //         this.connection = new WebSocket(url);

    //         this.connection.onerror = (error: Event) => { this.onError(error); }
    //         this.connection.onclose = (event: CloseEvent) => { this.onClose(event); }
    //         this.connection.onmessage = (event: MessageEvent) => { this.onMessage(event); }

    //         this.connection.onopen = (event: Event) => {
    //             let request: WebSocketRequestConnect = {
    //                 command: 1,
    //                 token: response.token,
    //                 nickname: nickName,
    //                 sessionCode: sessionCode
    //             }

    //             this.interpreter.webSocketsToCloseAfterProgramHalt.push(this.connection);
    //             this.isOpen = true;
    //             this.sendIntern(JSON.stringify(request));
    //             this.onOpen();

    //         }

    //     });

    // }

    // unsentMessages: string[] = [];
    // sendIntern(message: string) {

    //     if (!this.isOpen) {
    //         this.unsentMessages.push(message);
    //     } else {
    //         try {
    //             this.connection.send(message);
    //         } catch (exception) {
    //             console.log(exception);
    //         }
    //     }
    // }

    // onClose(event: CloseEvent) {
    //     this.isOpen = false;
    //     this.runMethod(this.onCloseMethod, []);
    // }

    // sendToClient(clientId: number, data: string, dataType: string) {
    //     let message: WebSocketRequestSendToClient = {
    //         command: 3,
    //         data: data,
    //         dataType: dataType,
    //         recipient_id: clientId
    //     };
    //     this.sendIntern(JSON.stringify(message));
    // }

    // sendToAll(data: string, dataType: string) {
    //     let message: WebSocketRequestSendToAll = {
    //         command: 2,
    //         data: data,
    //         dataType: dataType
    //     };
    //     this.sendIntern(JSON.stringify(message));
    // }

    // disconnect() {
    //     let message: WebSocketRequestDisconnect = {
    //         command: 4
    //     };
    //     this.sendIntern(JSON.stringify(message));
    //     this.connection.close();
    //     let wtr = this.interpreter.webSocketsToCloseAfterProgramHalt;
    //     wtr.splice(wtr.indexOf(this.connection), 1);
    // }

    // onMessage(event: MessageEvent) {

    //     let response: WebSocketResponse = JSON.parse(event.data);
    //     if (response.command == undefined) return;

    //     switch (response.command) {
    //         case 1: // new Client
    //             let clientRuntimeObject = new RuntimeObject(this.webSocketClientType);
    //             let wch: WebSocketClientHelper = new WebSocketClientHelper(clientRuntimeObject, this, response.user_id,
    //                 response.rufname, response.familienname, response.username, response.nickname);
    //             clientRuntimeObject.intrinsicData["Helper"] = wch;
    //             this.clientList.push(wch);
    //             this.idToClientMap[response.user_id] = wch;
    //             this.runMethod(this.onClientConnectedMethod, [{ type: this.webSocketClientType, value: clientRuntimeObject }]);
    //             break;
    //         case 2: // message
    //             let clientHelper = this.idToClientMap[response.from_client_id];
    //             if (clientHelper == null) return;
    //             this.runMethod(this.onMessageMethod, [
    //                 { type: this.webSocketClientType, value: clientHelper.runtimeObject },
    //                 { type: stringPrimitiveType, value: response.data },
    //                 { type: stringPrimitiveType, value: response.dataType }
    //             ]);
    //             break;
    //         case 3: // other client disconnected
    //             let clientHelper1 = this.idToClientMap[response.disconnecting_client_id];
    //             if (clientHelper1 == null) return;
    //             this.clientList.splice(this.clientList.indexOf(clientHelper1), 1);
    //             this.idToClientMap[response.disconnecting_client_id] = undefined;
    //             this.runMethod(this.onClientDisconnectedMethod, [
    //                 { type: this.webSocketClientType, value: clientHelper1.runtimeObject }
    //             ]);
    //             break;
    //         case 4: // time synchronization
    //             this.systemClassType.deltaTimeMillis = response.currentTimeMills - Date.now();
    //             this.client_id = response.client_id
    //             break;
    //         case 5: // keep alive
    //             break;
    //         case 6: // Clients found
    //             this.onClientsFound(response);
    //             break;
    //     }
    // }

    // onClientsFound(response: WebSocketResponsePairingFound) {
    //     let own_index: number = 0;
    //     let otherClients: Value[] = [];

    //     for (let client of response.clients) {
    //         if (client.id == this.client_id) {
    //             own_index = client.index;
    //         } else {
    //             let otherClient = this.idToClientMap[client.id];
    //             if (otherClient != null) {
    //                 otherClient.index = client.index;
    //                 otherClients.push({
    //                     type: this.webSocketClientType,
    //                     value: otherClient.runtimeObject
    //                 });
    //             }
    //         }
    //     }

    //     let arrayValue: Value = {
    //         type: new ArrayType(this.webSocketClientType),
    //         value: otherClients
    //     }

    //     this.runMethod(this.onClientsFoundMethod, [arrayValue, { type: intPrimitiveType, value: own_index }]);

    // }

    // onError(error: Event) {
    //     this.interpreter.throwException("Kommunikationsfehler beim WebSocket");
    // }

    // onOpen() {
    //     this.isOpen = true;
    //     if(this.unsentMessages.length > 0){
    //         this.unsentMessages.forEach(m => this.sendIntern(m));
    //         this.unsentMessages = [];
    //     }
    //     this.runMethod(this.onOpenMethod, []);
    // }

    // runMethod(method: Method, stackElements: Value[]) {
    //     if (method == null) return;
    //     stackElements.splice(0, 0, {
    //         type: this.runtimeObject.class,
    //         value: this.runtimeObject
    //     });

    //     if (this.interpreter.state == InterpreterState.waitingForInput || this.interpreter.state == InterpreterState.waitingForDB) {
    //         this.interpreter.executeImmediatelyInNewStackframe(method.program, stackElements);
    //     } else {
    //         this.interpreter.runTimer(method, stackElements, () => { }, false);
    //     }
    // }

    // findClientsFromCount(count: number) {
    //     let message: WebSocketRequestFindPairing = {
    //         command: 6,
    //         count: count,
    //         nicknames: []
    //     }

    //     this.sendIntern(JSON.stringify(message));
    // }

    // findClientsFromNicknames(nicknames: string[]) {
    //     let message: WebSocketRequestFindPairing = {
    //         command: 6,
    //         count: nicknames.length,
    //         nicknames: nicknames
    //     }

    //     this.sendIntern(JSON.stringify(message));
    // }


}