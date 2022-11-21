import { StyleSheet } from "aphrodite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CellState } from "../Types/CellState";
import Pos from "../Types/Pos";
import tools, { handTool, tool, TOOL } from "../Types/Tools";
import Banner from "./Banner";
import Board from "./Board/Board";
import "./Pathfinder.css";


// ------ INITIAL GRID DATA ------- 
function generateBoard(){
    const gridHeight = 34;
    const gridWidth = 80;
    const emptyBoard = new Array(gridHeight);
    for(let y = 0; y < emptyBoard.length; y++){
        emptyBoard[y] = new Array(gridWidth);
        for(let x = 0; x < emptyBoard[y].length; x++){
            emptyBoard[y][x] = CellState.empty;
        }
    }
    return emptyBoard;
}

export default function PathFinder(){
    const [boardPosition, setBoardPosition] = useState<Pos>({x: 0, y: 0});
    const [board, setBoard] = useState(useMemo(generateBoard, []));
    const [selectedTool, setSelectedTool] = useState(useMemo(() => new handTool(), []));

    return(
        <>
           <Banner>
                
           </Banner>
           <Board 
                boardPosition={boardPosition}
                setBoardPosition={setBoardPosition}
                board={board}
                selectedTool = {selectedTool}
                setSelectedTool = {setSelectedTool}
            />
        </>
    )
}