import { css, StyleSheet } from "aphrodite";
import { url } from "inspector";
import { CellState } from "../../Types/CellState";

const imagesPath = "../../Images/Icons";

interface CellProps{
    x:number,
    y:number,
    cellState:CellState,
    onClick():void,
}

export default function Cell(props:CellProps){
    const cellStyles = StyleSheet.create({
        size:{
            width: "20px",
            height: "20px",
            border: "solid 1px #bbb",
        },
        wall: {
            backgroundColor: "black",
        },
        empty: {
            backgroundImage: 'transparent',
        },
        path: {
            backgroundColor: "#009977",
        },
        search: {
            backgroundColor: "#405000"
        }
    })

    return(
        <div 
            className={'cell ' + css(cellStyles.size, cellStyles[CellState[props.cellState]])}
            onClick={() => props.onClick()}
        />
    )
}