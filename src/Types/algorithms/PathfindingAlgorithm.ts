import { gridHeight, gridWidth } from "../../Components/Pathfinder";
import { BOARDSTATE } from "../BoardState";
import CellData from "../CellData";
import { CELLSTATE } from "../CellState";
import Pos from "../Pos";

export class PathfindingAlgorithm{
  startingPosition:Pos;
  currentCell:CellData;
  targetPosition:Pos;
  paths:Record<string, Pos[]> = {};
}