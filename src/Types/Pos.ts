export default class Pos{
    x:number;
    y:number;

    constructor({x, y}){
        this.x = x;
        this.y = y;
    }

    toString(){
        return `${this.x} ${this.y}`;
    }
}