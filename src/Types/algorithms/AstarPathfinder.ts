import { BOARDSTATE } from "../BoardState";
import CellData from "../CellData";
import Pos from "../Pos";
import PriorityQueue from "../util/PriorityQueue";
import { PathfindingAlgorithm, pathfindingData } from "./PathfindingAlgorithm";

export default class AstarPathfinder extends PathfindingAlgorithm{
  name = "A*";
  
  targetPosition:Pos;
  posQueue:PriorityQueue<Pos>;

  initPathfinding(board:CellData[][], startingPosition:Pos, targetPosition:Pos){
    super.initPathfinding(board,startingPosition);
    this.targetPosition = targetPosition;
    this.initPosQueue();
  }

  private initPosQueue(){
    this.posQueue = new PriorityQueue();
    this.posQueue.enqueue(this.startingPosition, this.getHeuristic(this.startingPosition));
  }

  private getHeuristic(pos:Pos):number{
    return Math.abs(pos.x - this.targetPosition.x) + Math.abs(pos.y - this.targetPosition.y);
  }

  private getPriority(pos:Pos):number{
    return this.getPathToPosition(pos).length + this.getHeuristic(pos);
  }

  noMoreSteps(): boolean {
    return this.posQueue.isEmpty();
  }

  executeStep(): pathfindingData {
    if(this.noMoreSteps()){
      return {
        board: this.board,
        boardState: BOARDSTATE.searchComplete
      };
    }

    const currentPos = this.posQueue.dequeue();
    const currentCell = this.getCellAtPos(currentPos);

    const validAdjacentCells = this.getValidAdjacentCells(currentPos);
    const getVisitedAdjacentCells = this.getVisitedAdjacentCells(currentPos);

    


    throw new Error("Method not implemented.");
  }
}