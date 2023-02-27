import { allowedNodeEnvironmentFlags } from "process";
import { PathfindingAlgorithm } from "./PathfindingAlgorithm";

export enum ALGORITHM{
  dsf,
  bfs,
  dijokstras,
  aStar,
}