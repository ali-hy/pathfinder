import { CELLSTATE } from "./CellState";
import Pos from "./Pos";

export default class CellData {
    position:Pos;
    state:CELLSTATE = CELLSTATE.empty;
    weight = 1;
    netAncestorWeight:number = 0;
    private parent?:CellData = undefined;
    
    constructor(position:Pos){
        this.position = position;
    }

    getCurrentPath(){
        if(this.parent === undefined){
            return [this.position]
        }
        return [...this.parent.getCurrentPath(), this.position];
    }

    setParent(parent:CellData){
        if(this.parent === undefined){
            this.parent = parent;
        }
    }

    updateParent(parent:CellData){
        if(this.parent === undefined){
            this.parent = parent;
            this.netAncestorWeight = parent.netAncestorWeight + parent.weight;
        } else {
            const change = parent.netAncestorWeight < this.parent.netAncestorWeight;
            this.parent = change ? parent : this.parent;
        }
    }
    
    clearParent(){
        this.parent = undefined;
        this.netAncestorWeight = 0;
    }

    visit(){
            this.state = CELLSTATE.visited;
    }

    empty(){
        this.state = CELLSTATE.empty;
    }

    walk(){
            this.state = CELLSTATE.path;
    }

    isTravelValid(){
        return (this.state <= CELLSTATE.target);
    }
}