import { useEffect, useMemo, useState } from "react";
import { CellState } from "../Types/CellState";
import Pos from "../Types/Pos";
import tools, { handTool, placeTool, TOOL, tool } from "../Types/Tools";
import Banner from "./Banner/Banner";
import Board from "./Board/Board";
import ToolButton from "./Banner/ToolButton";
import useLoggingState from "../Hooks/useLogginState";


// ------ INITIAL GRID DATA ------- 
function generateBoard(){
    const gridHeight = 50;
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
    const [selectedTool, setSelectedTool] = useLoggingState(tools[TOOL.hand]);

    const onCellClick = (x:number, y:number):void => {
        console.log(x, y);
        if(!(selectedTool instanceof placeTool)) {
            return;
        }
        const nextBoard = [...board];
        nextBoard[y][x] = selectedTool.itemPlaced;
        setBoard(nextBoard);
    }

    return(
        <>
           <Banner>
                <ul className="tools-list">
                    {tools.map((t:tool, index) => (
                        <ToolButton
                            key={index}
                            toolDetials={t}
                            selected={t.getIndex() === selectedTool.getIndex()}
                            setSelectedTool={() => {setSelectedTool(t)}}
                        />
                    ))}
                </ul>
           </Banner>
           <Board 
                boardPosition={boardPosition}
                board={board}
                selectedTool = {selectedTool}
                setSelectedTool = {setSelectedTool}
                onCellClick={(x:number, y:number) => onCellClick(x, y)}
            />
        </>
    )
}