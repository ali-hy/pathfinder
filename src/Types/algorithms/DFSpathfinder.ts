import copyBoard from "../../utils/copyBoard";
import BoardData from "../BoardData";
import { BOARDSTATE } from "../BoardState";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";
import { ALGORITHM } from "./ALGORITHM";
import { PathfindingAlgorithm } from "./PathfindingAlgorithm";

export default class DfsPathfinder extends PathfindingAlgorithm{
  name = "DFS";
  index = ALGORITHM.dfs;
  posStack:Pos[];
  shortestPath:Pos[];

  initPathfinding(board:BoardData, startingPosition:Pos){
    super.initPathfinding(board, startingPosition);
    const adjacentPositions = this.getCellAtPos(startingPosition).edgesToValid().map(({start, end}) => {
      end.setParent(start);
      return end.position;
    });
    this.posStack = [...adjacentPositions];

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
      const edgesToValid = currentCell.edgesToValid();
      const adjacentPositions = currentCell.edgesToValid().map(({end}) => end.position); 

      this.posStack.push(...adjacentPositions);
      edgesToValid.forEach(({start, end}) => {
        end.setParent(start);
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
      board: copyBoard(this.board),
      boardState: boardState,
      path: this.foundTargetPosition ? this.getPathToPosition(this.foundTargetPosition) : undefined
    };
  }
}