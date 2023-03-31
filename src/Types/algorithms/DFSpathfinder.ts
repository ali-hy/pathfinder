import { BOARDSTATE } from "../BoardState";
import CellData from "../CellData";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";
import { ALGORITHM } from "./ALGORITHM";
import { PathfindingAlgorithm } from "./PathfindingAlgorithm";

export default class DfsPathfinder extends PathfindingAlgorithm{
  name = "DFS";
  index = ALGORITHM.dfs;
  posStack:Pos[];
  shortestPath:Pos[];

  initPathfinding(board:CellData[][], startingPosition:Pos){
    super.initPathfinding(board, startingPosition);
    const adjacentPosition = this.getAdjacentPositions(startingPosition);
    this.posStack = [...adjacentPosition];
    adjacentPosition.forEach(pos => {
      this.paths[pos.toString()] = [pos];
    })
  }
  
  noMoreSteps(){
    return this.posStack.length <= 0;
  }
  
  executeStep(){
    if(this.noMoreSteps()){
      return {
        board: this.board,
        boardState: BOARDSTATE.searchComplete
      };
    }

    const currentCell = this.getCellAtPos(this.posStack.pop());
    if(!currentCell.isTravelValid()){
      return{
        board: this.board,
        boardState: BOARDSTATE.searching
      }
    }

    if(currentCell.state === CELLSTATE.target){
      this.foundTargetPosition = currentCell.position;
    } else {
      const visitedAdjacentCells = this.getVisitedAdjacentCells(currentCell.position);
      const validAdjacentCells = this.getValidAdjacentCells(currentCell.position);
      const adjacentPositions = validAdjacentCells.map(cell => cell.position);

      this.posStack.push(...adjacentPositions);
      validAdjacentCells.concat(visitedAdjacentCells).forEach(cell => {
        cell.updateParent(currentCell);
      });

      currentCell.visit();
    }

    var boardState:BOARDSTATE;
    if(this.foundTargetPosition || this.posStack.length === 0){
      boardState = BOARDSTATE.searchComplete;
    } else {
      boardState = BOARDSTATE.searching;
    }

    return {
      board: [...this.board],
      boardState: boardState,
      path: this.foundTargetPosition ? this.getPathToPosition(this.foundTargetPosition) : undefined
    };
  }
}