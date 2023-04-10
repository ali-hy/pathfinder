import copyBoard from "../../utils/copyBoard";
import BoardData from "../BoardData";
import { BOARDSTATE } from "../BoardState";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";
import PriorityQueue from "../util/PriorityQueue";
import { ALGORITHM } from "./ALGORITHM";
import { PathfindingAlgorithm, pathfindingData } from "./PathfindingAlgorithm";

export default class AstarPathfinder extends PathfindingAlgorithm{
  name = "A*";
  index = ALGORITHM.aStar;
  
  targetPosition:Pos;
  posQueue:PriorityQueue<Pos>;

  initPathfinding(board:BoardData, startingPosition:Pos, targetPosition:Pos){
    super.initPathfinding(board,startingPosition);
    this.targetPosition = targetPosition;
    this.initPosQueue();
  }

  private initPosQueue(){
    this.posQueue = new PriorityQueue();
    this.posQueue.enqueue(this.startingPosition, this.getPriority(this.startingPosition));
  }

  private getHeuristic(pos:Pos):number{
    return Math.abs(pos.x - this.targetPosition.x) + Math.abs(pos.y - this.targetPosition.y);
  }

  private getPriority(pos:Pos):number{
    return this.getCellAtPos(pos).netDistance + this.getHeuristic(pos);
  }

  noMoreSteps(): boolean {
    return this.posQueue.isEmpty();
  }

  executeStep(): pathfindingData {
    if (this.noMoreSteps()) { 
      return {
        board: this.board,
        boardState: BOARDSTATE.searchComplete
      };
    }

    const currentPos = this.posQueue.dequeue();
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

    const validEdges = currentCell.edgesToValid();
    const edges = validEdges.concat(currentCell.edgesToVisited());
    const validAdjacentPositions = validEdges.map(({end}) => end.position);

    edges.forEach((edge) => edge.end.updateParent(edge));
    validAdjacentPositions.forEach((pos) => this.posQueue.enqueue(pos, this.getPriority(pos)));

    var boardState: BOARDSTATE;
    if (this.posQueue.size === 0) {
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