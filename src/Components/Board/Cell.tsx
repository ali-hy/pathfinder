import { css, StyleSheet } from "aphrodite";
import { CellState } from "../../Types/CellState";


interface CellProps{
    x:number,
    y:number,
    cellState:CellState
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
            backgroundColor: "transparent",
        },
        path: {
            backgroundColor: "#009977",
        },
        search: {
            backgroundColor: "#405000"
        }
    })


    return(
        <div className={'cell ' + css(cellStyles.size, cellStyles.empty)}></div>
    )
}