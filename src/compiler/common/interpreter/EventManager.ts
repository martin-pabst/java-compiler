type Callback = (...args: any[]) => void;

export class EventManager<EventType extends string> {

    private eventTypeToCallbackMap: Map<EventType, Callback[]> = new Map();
    private callbackToEventTypeMap: Map<Callback, EventType> = new Map();

    private onceMap: Map<Callback, boolean> = new Map();


    public on(eventType: EventType, callback: Callback){
        let callbackList = this.eventTypeToCallbackMap.get(eventType);
        if(!callbackList){
            callbackList = [];
            this.eventTypeToCallbackMap.set(eventType, callbackList);
        }        
        callbackList.push(callback);
        this.callbackToEventTypeMap.set(callback, eventType);
    }

    public off(callback: Callback){
        let evenType = this.callbackToEventTypeMap.get(callback);
        if(!evenType) return;

        this.callbackToEventTypeMap.delete(callback);
        this.onceMap.delete(callback);

        let callbackList = this.eventTypeToCallbackMap.get(evenType);
        if(!callbackList) return;
        let index = callbackList.indexOf(callback);
        if(index >= 0) callbackList.splice(index, 1);
        if(callbackList.length == 0) this.eventTypeToCallbackMap.delete(evenType);
    }

    public once(eventType: EventType, callback: Callback){
        this.on(eventType, callback);
        this.onceMap.set(callback, true);
    }        

    public fire(eventType: EventType, ...args: any[]){
        let callbackList = this.eventTypeToCallbackMap.get(eventType);
        if(!callbackList) return;

        let callbacksToDelete: Callback[] = [];

        for(let callback of callbackList){
            callback(...args);
            if(this.onceMap.get(callback)){
                callbacksToDelete.push(callback);
            }
        }

        callbacksToDelete.forEach(cb => this.off(cb));
    }

}