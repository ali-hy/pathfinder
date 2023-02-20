import CellData from "../../Types/CellData";
import { CELLSTATE } from "../../Types/CellState";
import Cell from "./Cell";

interface RowProps{
    y:number;
    cellData:CellData[];
    onCellClick(x:number, y:number):void;
    onCellEnter(x:number, y:number):void;
}

export default function Row(props : RowProps){
    return (<div className="board-row">
        {props.cellData.map((cell, x) => <Cell 
            key={x} 
            cellData={cell} 
            x={x} 
            y={props.y} 
            onClick={() => props.onCellClick(x, props.y)}
            onEnter={() => props.onCellEnter(x, props.y)}
        />)}
    </div>)
}