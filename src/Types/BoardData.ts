import { BOARDSTATE } from "./BoardState";
import CellData from "./CellData";
import Edge from "./Edge";
import Pos from "./Pos";

export default class BoardData{
  grid:CellData[][];
  width:number;
  height:number;
  state:BOARDSTATE;

  constructor(height?:number, width?:number){
    if(height === undefined){
      return;
    }
    this.height = height;
    this.width = width;
    this.grid = [];
    CellData.board = this;
    Edge.board = this;

    for(let i = 0; i < height; i++){
      const row = [];
      for(let j = 0; j < width; j++){
        row.push(new CellData(new Pos(j, i)));
      }
      this.grid.push(row);
    }

    this.grid.forEach(row => {
      row.forEach(cell => {
        cell.setEdges();
      })
    });
  }

  cellAtPos({x,y}: {x:number, y:number}){
    return this.grid[y][x];
  }

  pathToPos(pos:Pos){
    return this.cellAtPos(pos).getCurrentPath();
  }
  
  pathToCell(cell:CellData){
    return cell.getCurrentPath();
  }

  forEach(callback:(element, index, arr) => void, thisArg?:Object){
    this.grid.forEach(callback, thisArg);
  }

  map(callback:(element, index, arr) => any, thisArg?:Object){
    return this.grid.map(callback, thisArg);
  }
}