import { CELLSTATE } from "./CellState";
import Pos from "./Pos";

export default class CellData {
    position:Pos;
    state:CELLSTATE = CELLSTATE.empty;
    
    constructor(position:Pos){
        this.position = position;
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