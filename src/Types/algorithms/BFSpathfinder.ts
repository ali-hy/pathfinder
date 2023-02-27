import { gridHeight, gridWidth } from "../../Components/Pathfinder";
import { BOARDSTATE } from "../BoardState";
import CellData from "../CellData";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";
import { PathfindingAlgorithm } from "./PathfindingAlgorithm";

export class BFSpathfinder extends PathfindingAlgorithm{
  posQueue:Pos[] = [];
  
  board:CellData[][];
  readonly boardWidth:number;
  readonly boardHeight:number;

  constructor(board?:CellData[][]){
    super();
    this.board = board;
    this.boardWidth = board[0].length;
    this.boardHeight = board.length;
  }
  
  getAdjacentPositions({ x, y }: Pos){
    const adjacentPositions: Pos[] = [];
    if (x > 0) {
      adjacentPositions.push(new Pos(x - 1, y));
    }
    if (x < gridWidth - 1) {
      adjacentPositions.push(new Pos( x + 1, y));
    }
    if (y > 0) {
      adjacentPositions.push(new Pos(x, y - 1));
    }
    if (y < gridHeight - 1) {
      adjacentPositions.push(new Pos(x, y + 1));
    }
    return adjacentPositions;
  };

  initPathfinding(startingPosition:Pos){
    const adjacentPositions = this.getAdjacentPositions(startingPosition);
    this.posQueue.push(...adjacentPositions);
    this.posQueue.forEach(position => {
      this.paths[position.toString()] = [position];
    });
  }

  getCellAtPos ({ x, y }: Pos){
    return this.board[y][x];
  };

  executeStep(){
    if(this.posQueue.length <= 0){
      return;
    }

    const nextSearchLevel:Pos[] = [];
    
    for(const pos of this.posQueue){
      const currentCell = this.getCellAtPos(pos);

      if(!currentCell.isTravelValid()){
        continue;
      }
      if(currentCell.state === CELLSTATE.target){
        this.targetPosition = pos;
        break;
      }

      currentCell.visit();

      const currentPath = this.paths[currentCell.position.toString()];
      const adjacentPositions = this.getAdjacentPositions(pos);

      nextSearchLevel.push(...adjacentPositions);
      adjacentPositions.forEach(adjacentPosition => {
        this.paths[adjacentPosition.toString()] = currentPath.concat(adjacentPosition);
      });
    };
    this.posQueue = nextSearchLevel;

    var boardState:BOARDSTATE;

    if(this.targetPosition || this.posQueue.length === 0){
      boardState = BOARDSTATE.searchComplete;
    } else {
      boardState = BOARDSTATE.searching;
    }

    return {
      board: [...this.board],
      boardState: boardState,
      path: this.targetPosition ? this.paths[this.targetPosition.toString()] : undefined
    };
  }
}