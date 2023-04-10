import { css, StyleSheet } from "aphrodite";
import CellData from "../../Types/CellData";
import { CELLSTATE } from "../../Types/CellState";

interface CellProps{
    x:number,
    y:number,
    cellData:CellData,
    onClick():void,
    onEnter():void
}

export default function Cell(props:CellProps){
    const cellStyles = StyleSheet.create({
        size:{
            width: "20px",
            height: "20px",
            border: "solid 1px #bbb",
            backgroundPosition: "center",
        },
        wall: {
            background: "black",
        },
        empty: {
            background: 'none',
        },
        path: {
            background: "#009977",
        },
        visited:{
            background: "#cafff9",
        },
        searchStart: {
            background: "#0055ff"
        },
        target: {
            background: "#ff4044"
        },
    })

    const clickHandler = function(e:MouseEvent){
        if(e.button === 0) props.onClick();
    }

    return(
        <div 
            className={'cell ' + css(cellStyles.size, cellStyles[CELLSTATE[props.cellData.state]])}
            onMouseDown={clickHandler as any}
            onMouseEnter={() => props.onEnter()} 
        >
            {props.cellData.netDistance.toFixed(0)}
        </div>
    )
}