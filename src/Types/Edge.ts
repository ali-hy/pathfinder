import BoardData from "./BoardData";
import CellData from "./CellData";
import Pos from "./Pos";
import { root2 } from "./algorithms/PathfindingAlgorithm";

export default class Edge{
  static board:BoardData;

  start:CellData;
  end:CellData;
  weight:number;

  constructor(start:Pos, end:Pos, weight?:number){
    this.start = Edge.board.cellAtPos(start);
    this.end = Edge.board.cellAtPos(end);
    if(weight !== undefined){
      this.weight = weight;
    } else {
      if(start.x === end.x || start.y === end.y){
        this.weight = 1;
      } else {
        this.weight = root2;
      }
    }
  }
}