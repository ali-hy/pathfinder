import { CellState } from "../../Types/CellState";
import Cell from "./Cell";

interface RowProps{
    y:number;
    cellStates:CellState[];
    onCellClick(x:number, y:number):void;
    onCellEnter(x:number, y:number):void;
}

export default function Row(props : RowProps){
    return (<div className="board-row">
        {props.cellStates.map((cell, x) => <Cell 
            key={x} 
            cellState={cell} 
            x={x} 
            y={props.y} 
            onClick={() => props.onCellClick(x, props.y)}
            onEnter={() => props.onCellEnter(x, props.y)}
        />)}
    </div>)
}