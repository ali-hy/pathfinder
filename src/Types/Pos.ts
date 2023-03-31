export default class Pos{
    x:number;
    y:number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    equals(other:any){
        if(other instanceof Pos){
            return this.x === other.x && this.y === other.y;
        }
        return false;
    }

    hashCode(): number {
        let result = 17;
        result = 31 * result + this.x;
        result = 31 * result + this.y;
        return result;
      }

    toString(){
        return `${this.x} ${this.y}`;
    }
}