export class Question {
    ID: string;
    label: string;
    result1: boolean;
    result2: boolean;
   
    constructor(options: {
        ID?: string,
        label?: string,
        result1?: boolean,
        result2?: boolean
      } = {}) {
      this.ID = options.ID;
      this.label = options.label || '';
      this.result1 = !!options.result1;
      this.result2 = !!options.result2;
    }

    getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
    }    
  }
    