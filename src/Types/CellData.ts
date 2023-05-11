import BoardData from "./BoardData";
import { CELLSTATE } from "./CellState";
import Edge from "./Edge";
import Pos from "./Pos";
import { root2 } from "./algorithms/PathfindingAlgorithm";

export default class CellData {
    static board:BoardData;

    private edges:Edge[] = [];

    position:Pos;
    state:CELLSTATE = CELLSTATE.empty;
    netDistance:number = 0;
    private parent?:CellData = undefined;
    
    constructor(position:Pos){
        this.position = position;
    }

    setEdges(){
        const {x, y} = this.position;
        
        const notLeftEdge = x > 0;
        const notTopEdge = y > 0;
        const notRightEdge = x < CellData.board.width - 1;
        const notBottomEdge = y < CellData.board.height - 1;
        
        if (notLeftEdge) {
            this.edges.push(new Edge(this.position, this.position.left(), 1));
        }
        if (notTopEdge) {
            this.edges.push(new Edge(this.position, this.position.up(), 1));
        }
        if (notRightEdge) {
            this.edges.push(new Edge(this.position, this.position.right(), 1));
        }
        if (notBottomEdge) {
            this.edges.push(new Edge(this.position, this.position.down(), 1));
        }

        if (notTopEdge && notLeftEdge){
            this.edges.push(new Edge(this.position, this.position.left().up(), root2));
        }
        if (notTopEdge && notRightEdge){
            this.edges.push(new Edge(this.position, this.position.right().up(), root2));
        }
        if (notBottomEdge && notLeftEdge){
            this.edges.push(new Edge(this.position, this.position.left().down(), root2));
        }
        if (notBottomEdge && notRightEdge){
            this.edges.push(new Edge(this.position, this.position.right().down(), root2));
        }
    }

    edgesToValid(){
        return this.edges.filter(({end}) =>  end.isTravelValid());
    }

    edgesToVisited(){
        return this.edges.filter(({end}) => end.state === CELLSTATE.visited);
    }

    getCurrentPath(){
        if(this.parent === undefined){
            return [this.position]
        }
        return [...this.parent.getCurrentPath(), this.position];
    }

    //PARENT
    setParent(parent:CellData){
        if(this.parent === undefined){
            this.parent = parent;
        }
    }

    updateParent(edge:Edge, updateSurrounding=1){
        var updated = false;
        const parent = edge.start;
        if(this.parent === undefined){
            this.parent = parent;
            this.netDistance = parent.netDistance + edge.weight;
            updated = true;
        } else {
            const newDistance = parent.netDistance + edge.weight;
            const change = newDistance < this.netDistance;
            if(change){
                this.parent = parent;
                this.netDistance = newDistance;
                updated = true;
            }
        }
        if(updated){
            this.updateSurroundingParents(edge, updateSurrounding);
        }
    }

    updateSurroundingParents(edge:Edge, updateSurrounding:number){
        if(updateSurrounding <= 0){
            return;
        }
        const visited = this.edgesToVisited();
        const valid = this.edgesToValid();
        visited.concat(valid).forEach(edge => edge.end.updateParent(edge,--updateSurrounding));
    }
    
    clearParent(){
        this.parent = undefined;
        this.netDistance = 0;
    }

    //STATE
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
