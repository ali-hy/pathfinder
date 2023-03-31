import { BOARDSTATE } from "../BoardState";
import CellData from "../CellData";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";
import { ALGORITHM } from "./ALGORITHM";

export interface pathfindingData{
  board:CellData[][];
  boardState:BOARDSTATE;
  path?:Pos[];
}

export abstract class PathfindingAlgorithm{
  readonly name:string;
  readonly index:ALGORITHM;

  // Input vars
  board:CellData[][];
  boardHeight:number;
  boardWidth:number;
  startingPosition:Pos;
  allowDiagonals:boolean;

  // Process Vars
  currentCell:CellData;
  foundTargetPosition:Pos;
  paths:Record<string, Pos[]> = {};

  initPathfinding(board:CellData[][], startingPosition:Pos, targetPosition?:Pos){
    this.board = board;
    this.boardWidth = board[0].length;
    this.boardHeight = board.length;
    this.startingPosition = startingPosition;
    this.resetProcessData();
  };

  resetProcessData(){
    this.currentCell = undefined;
    this.foundTargetPosition = undefined;
    this.paths = {};
  }

  protected abstract noMoreSteps():boolean;
  abstract executeStep():pathfindingData;

  // ---- Board Utils ----
  getCellAtPos ({ x, y }: Pos){
    return this.board[y][x];
  };

  getAdjacentPositions({ x, y }: Pos){
    const adjacentPositions: Pos[] = [];
    const notLeftEdge = x > 0;
    const notTopEdge = y > 0;
    const notRightEdge = x < this.boardWidth - 1;
    const notBottomEdge = y < this.boardHeight - 1;

    if (notLeftEdge) {
      adjacentPositions.push(new Pos(x-1, y));
    }
    if (notTopEdge) {
      adjacentPositions.push(new Pos(x, y-1));
    }
    if (notRightEdge) {
      adjacentPositions.push(new Pos(x+1, y));
    }
    if (notBottomEdge) {
      adjacentPositions.push(new Pos(x, y+1));
    }

    if (notTopEdge && notLeftEdge){
      adjacentPositions.push(new Pos(x-1, y-1));
    }
    if (notTopEdge && notRightEdge){
      adjacentPositions.push(new Pos(x+1, y-1));
    }
    if (notBottomEdge && notLeftEdge){
      adjacentPositions.push(new Pos(x-1, y+1));
    }
    if (notBottomEdge && notRightEdge){
      adjacentPositions.push(new Pos(x+1, y+1));
    }
    
    return adjacentPositions;
  };

  getAdjacentCells(pos:Pos){
    return this.getAdjacentPositions(pos)
    .map(pos => this.getCellAtPos(pos));
  }

  getValidAdjacentCells(pos:Pos){
    return this.getAdjacentCells(pos)
    .filter(cell => cell.isTravelValid());
  }

  getVisitedAdjacentCells(pos:Pos){
    return this.getAdjacentCells(pos)
    .filter(cell => cell.state === CELLSTATE.visited);
  }

  // ---- Path Utils ----
  getPathToCell(cell:CellData){
    return cell.getCurrentPath();
  }

  getPathToPosition(position:Pos){
    return this.getCellAtPos(position).getCurrentPath();
  }
}