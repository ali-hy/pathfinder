import { PathfindingAlgorithm, pathfindingData } from "./PathfindingAlgorithm";

export default class DijkstrasPathfinder extends PathfindingAlgorithm {
  name = "Dijkstra's";

  noMoreSteps(): boolean {
    throw new Error("Method not implemented.");
  }
  executeStep(): pathfindingData {
    throw new Error("Method not implemented.");
  }
  
}