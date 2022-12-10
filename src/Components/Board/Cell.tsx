import { css, StyleSheet } from "aphrodite";
import { url } from "inspector";
import { CellState } from "../../Types/CellState";

const imagesPath = "../../Images/Icons";

interface CellProps{
    x:number,
    y:number,
    cellState:CellState,
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
            className={'cell ' + css(cellStyles.size, cellStyles[CellState[props.cellState]])}
            onMouseDown={clickHandler as any}
            onMouseEnter={() => props.onEnter()}
        />
    )
}