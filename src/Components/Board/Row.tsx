import { CellState } from "../../Types/CellState";
import Cell from "./Cell";

interface RowProps{
    y:number;
    cellStates:CellState[];
}

export default function Row(props : RowProps){
    return (<div className="board-row w-auto">
        {props.cellStates.map((cell, x) => <Cell key={x} cellState={cell} x={x} y={props.y} />) }
    </div>)
}