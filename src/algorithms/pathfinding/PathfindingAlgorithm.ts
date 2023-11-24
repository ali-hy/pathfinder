import BoardData from "../../Types/BoardData";
import { BOARDSTATE } from "../../Types/BoardState";
import CellData from "../../Types/CellData";
import Pos from "../../Types/Pos";
import { ALGORITHM } from "./ALGORITHM";

export interface pathfindingData{
  board:BoardData;
  boardState:BOARDSTATE;
  path?:Pos[];
}

export const root2 = Math.sqrt(2);
export abstract class PathfindingAlgorithm{
  readonly name:string;
  readonly index:ALGORITHM;

  // Input vars
  board:BoardData;
  startingPosition:Pos;
  allowDiagonals:boolean;

  // Process Vars
  currentCell:CellData;
  foundTargetPosition:Pos;

  initPathfinding(board:BoardData, startingPosition:Pos, targetPosition?:Pos){
    this.board = board;
    this.startingPosition = startingPosition;
    this.resetProcessData();
  };

  resetProcessData(){
    this.currentCell = undefined;
    this.foundTargetPosition = undefined;
  }

  protected abstract noMoreSteps():boolean;
  abstract executeStep():pathfindingData;

  // ---- Board Utils ----
  getCellAtPos ({ x, y }: Pos){
    return this.board.cellAtPos(new Pos(x,y));
  };

  // getAdjacentPositions({ x, y }: Pos){
  //   const adjacentPositions: Pos[] = [];
  //   const notLeftEdge = x > 0;
  //   const notTopEdge = y > 0;
  //   const notRightEdge = x < this.board.width - 1;
  //   const notBottomEdge = y < this.board.height - 1;

  //   if (notLeftEdge) {
  //     adjacentPositions.push(new Pos(x-1, y));
  //   }
  //   if (notTopEdge) {
  //     adjacentPositions.push(new Pos(x, y-1));
  //   }
  //   if (notRightEdge) {
  //     adjacentPositions.push(new Pos(x+1, y));
  //   }
  //   if (notBottomEdge) {
  //     adjacentPositions.push(new Pos(x, y+1));
  //   }

  //   if (notTopEdge && notLeftEdge){
  //     adjacentPositions.push(new Pos(x-1, y-1));
  //   }
  //   if (notTopEdge && notRightEdge){
  //     adjacentPositions.push(new Pos(x+1, y-1));
  //   }
  //   if (notBottomEdge && notLeftEdge){
  //     adjacentPositions.push(new Pos(x-1, y+1));
  //   }
  //   if (notBottomEdge && notRightEdge){
  //     adjacentPositions.push(new Pos(x+1, y+1));
  //   }
    
  //   return adjacentPositions;
  // };

  // getAdjacentCells(pos:Pos){
  //   return this.getAdjacentPositions(pos)
  //   .map(pos => this.getCellAtPos(pos));
  // }

  // getValidAdjacentCells(pos:Pos){
  //   return this.getAdjacentCells(pos)
  //   .filter(cell => cell.isTravelValid());
  // }

  // getVisitedAdjacentCells(pos:Pos){
  //   return this.getAdjacentCells(pos)
  //   .filter(cell => cell.state === CELLSTATE.visited);
  // }

  // ---- Path Utils ----
  
  getPathToCell(cell:CellData){
    return cell.getCurrentPath();
  }

  getPathToPosition(position:Pos){
    return this.getCellAtPos(position).getCurrentPath();
  }
}