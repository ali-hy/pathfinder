import copyBoard from "../../utils/copyBoard";
import BoardData from "../../Types/BoardData";
import { BOARDSTATE } from "../../Types/BoardState";
import { CELLSTATE } from "../../Types/CellState";
import Pos from "../../Types/Pos";
import { ALGORITHM } from "./ALGORITHM";
import { PathfindingAlgorithm } from "./PathfindingAlgorithm";

export default class BfsPathfinder extends PathfindingAlgorithm {
  name = "BFS";
  index = ALGORITHM.bfs;
  posQueue: Pos[];
  posSet: Set<Pos>;

  initPathfinding(board: BoardData, startingPosition: Pos) {
    super.initPathfinding(board, startingPosition);
    this.initPosQueue();
  }

  initPosQueue() {
    this.posQueue = [this.startingPosition];
    this.posSet = new Set();
    this.posSet.add(this.startingPosition);
  }

  protected noMoreSteps() {
    return this.posQueue.length <= 0;
  }

  protected enqueuePos(pos:Pos){
    const prevSize = this.posSet.size;
    this.posSet.add(pos);
    if(prevSize < this.posSet.size){
      this.posQueue.push(pos);
    }
  }

  protected dequeuePos():Pos{
    if(!this.posQueue.length){
      return undefined;
    }
    const result = this.posQueue.shift();
    this.posSet.delete(result);
    return result;
  }

  executeStep() {
    if (this.noMoreSteps()) {
      return {
        board: this.board,
        boardState: BOARDSTATE.searchComplete
      }
    }

    const currentPos = this.dequeuePos();
    const currentCell = this.getCellAtPos(currentPos);
    
    if (currentCell.state === CELLSTATE.target) {
      this.foundTargetPosition = currentPos;
      return {
        board: copyBoard(this.board),
        boardState: BOARDSTATE.searchComplete,
        path: this.getPathToCell(currentCell)
      }
    }

    if (currentCell.isTravelValid()) {
      currentCell.visit();
    }

    const edges = currentCell.edgesToValid();
    const adjacentPositions = edges.map(({end}) => end.position);

    adjacentPositions.forEach((pos) => this.enqueuePos(pos));
    edges.forEach(({end}) => end.setParent(currentCell));

    let boardState: BOARDSTATE;
    if (this.foundTargetPosition || this.posQueue.length === 0) {
      boardState = BOARDSTATE.searchComplete;
    } else {
      boardState = BOARDSTATE.searching;
    }

    return {
      board: copyBoard(this.board),
      boardState: boardState,
      path: this.foundTargetPosition ? this.getPathToPosition(this.foundTargetPosition) : undefined
    }
  }
}