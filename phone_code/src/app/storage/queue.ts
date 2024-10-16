export class Queue {

    items;
    frontIndex;
    backIndex;

    constructor() {
        this.items = {};
        this.frontIndex = 0;
        this.backIndex = 0;
    }
    enqueue(item: UploadItem) {
        this.items[this.backIndex] = item;
        this.backIndex++;
        return item + ' inserted';
    }

    dequeue(): UploadItem {
        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        return item;
    }

    isEmpty(){
        return Object.keys(this.items).length === 0;
    }

    peek() {
        return this.items[this.frontIndex];
    }

    get printQueue() {
        return this.items;
    }
}

export class UploadItem{
    public data: Object;
    public uploadURLLocation: String; 
    public typeOfData: String; 
    public isEncrypted: Boolean;
}