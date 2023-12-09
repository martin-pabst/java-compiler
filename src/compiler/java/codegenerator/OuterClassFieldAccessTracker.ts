

export class OuterClassFieldAccessTracker {
    stack: boolean[] = [false];


    startTracking(){
        this.stack.push(false);
    }

    hasAccessHappened(): boolean {
        return this.stack.pop()!;
    }

    onAccessHappened(){
        for(let i = 0; i < this.stack.length; i++) this.stack[i] = true;
    }


}