import './Board.scss';

import { useEffect, useState } from "react";
import { CellState } from "../../Types/CellState";
import Cell from "./Cell";
import Row from "./Row";
import tools, { ACTION, actionDetails, handTool, TOOL, tool } from '../../Types/Tools';
import Pos from '../../Types/Pos';
import { css, StyleSheet } from 'aphrodite';

interface BoardProps{
    board:CellState[][];
    boardPosition:Pos;
    setBoardPosition:Function;
    selectedTool:tool;
    setSelectedTool:Function;
}

var _prevTool;
var _mouseStartPosition:Pos;
var _boardPosition:Pos = {x: 0, y: 0};
var _mousePositionChange:Pos;



export default function Board(props:BoardProps){
    
    const [mousePositionChange, setMousePositionChange] = useState<Pos>({x: 0, y:0});

    const takeAction = ({type, payload}:actionDetails) => {
        switch(type){
            case ACTION.rerenderTool:
                if(props.selectedTool.active){_mouseStartPosition = {x: payload.x, y: payload.y}}
                else{
                    
                }
                props.setSelectedTool({...props.selectedTool});
                break;
            case ACTION.move:
                
        }
    }

    const mouseDownHandler = (e:MouseEvent) => {
        if(e.button === 0){ // left mb down
            const action:actionDetails = props.selectedTool.onMouseDown();
            action.payload = {x: e.clientX, y: e.clientY};
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb down
            e.preventDefault();
            _prevTool = props.selectedTool;
            tools[TOOL.hand].onMouseDown();
            props.setSelectedTool(tools[TOOL.hand]);
        }
    }
    const mouseUpHandler = (e) => {
        if(e.button === 0){ // left mb down
            const action:actionDetails = props.selectedTool.onMouseUp();
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb mid
            tools[TOOL.hand].onMouseUp();
            props.setSelectedTool(_prevTool);
        }
    }
    const mouseMoveHandler = (e:MouseEvent) => {
        takeAction(props.selectedTool.onMouseMove({x: e.clientX, y: e.clientY}));
    }

    useEffect(() => {
        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('mousemove', mouseMoveHandler);

        return () => {
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            window.addEventListener('mousemove', mouseMoveHandler);
        }
    }, []);

    useEffect(() => {
        _mousePositionChange = mousePositionChange;
    }, [mousePositionChange])

    const boardStyles = StyleSheet.create({
        board:{
            cursor: props.selectedTool.cursorClass
        },
    })

    const grid = <div className={`position-relative`}>
            {props.board.map((row, y) => { return (<Row key={y} cellStates={row} y={y}/>)})}
        </div>;

    return(
        <div className={"board-container " + css(boardStyles.board)}>
            <div className={"board user-select-none "}>
                {grid}
            </div>
        </div>
    )
}