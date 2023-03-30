import { BOARDSTATE } from "../BoardState";
import CellData from "../CellData";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";
import { ALGORITHM } from "./ALGORITHM";
import { PathfindingAlgorithm } from "./PathfindingAlgorithm";

export class BfsPathfinder extends PathfindingAlgorithm {
  name = "BFS";
  index = ALGORITHM.bfs;
  posQueue: Pos[];

  initPathfinding(board: CellData[][], startingPosition: Pos) {
    super.initPathfinding(board, startingPosition);
    this.initPosQueue();
  }

  initPosQueue() {
    this.posQueue = [this.startingPosition];
  }

  //STEP
  protected noMoreSteps() {
    return this.posQueue.length <= 0;
  }

  executeStep() {
    if (this.noMoreSteps()) {
      return {
        board: this.board,
        boardState: BOARDSTATE.searchComplete
      };
    }

    const nextLevel: Set<Pos> = new Set();

    for (const currentPos of this.posQueue) {
      const currentCell = this.getCellAtPos(currentPos);

      if (currentCell.state === CELLSTATE.target) {
        this.foundTargetPosition = currentPos;
        // MAYBE RETURN
        break;
      }

      if (currentCell.isTravelValid()) {
        currentCell.visit();
      }

      const adjacentCells = this.getValidAdjacentCells(currentPos);
      const adjacentPositions = adjacentCells.map(cell => cell.position);

      adjacentPositions.forEach((pos) => nextLevel.add(pos));
      adjacentCells.forEach(cell => cell.setParent(currentCell));
    }

    this.posQueue = Array.from(nextLevel);

    var boardState: BOARDSTATE;
    if (this.foundTargetPosition || this.posQueue.length === 0) {
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