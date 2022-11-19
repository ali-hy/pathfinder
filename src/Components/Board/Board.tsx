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
    const {boardPosition, setBoardPosition} = props;
    const [mousePositionChange, setMousePositionChange] = useState<Pos>({x: 0, y:0});

    const takeAction = ({type, payload}:actionDetails) => {
        switch(type){
            case ACTION.rerenderTool:
                if(props.selectedTool.active){_mouseStartPosition = {x: payload.x, y: payload.y}}
                else{
                    console.log('setting board position to', {
                        x: _boardPosition.x + _mousePositionChange.x,
                        y: _boardPosition.y + _mousePositionChange.y
                    })
                    setBoardPosition({
                        x: _boardPosition.x + _mousePositionChange.x,
                        y: _boardPosition.y + _mousePositionChange.y
                    });
                    setMousePositionChange({x: 0, y: 0});
                }
                props.setSelectedTool({...props.selectedTool});
                break;
        }
    }

    const mouseDownHandler = (e:MouseEvent) => {
        if(e.button === 0){ // left mb down
            const action:actionDetails = props.selectedTool.onMouseDown();
            action.payload = {x: e.clientX, y: e.clientY};
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb down
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
        if((props.selectedTool instanceof handTool) && props.selectedTool.active){
            const change = {x: e.clientX - _mouseStartPosition.x, y: e.clientY - _mouseStartPosition.y}
            setMousePositionChange(change);
        }
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
        _boardPosition = boardPosition;
    }, [boardPosition])
    useEffect(() => {
        _mousePositionChange = mousePositionChange;
    }, [mousePositionChange])
    // useEffect(() => {
    //     console.log('selected ', props.selectedTool);
    // }, [props.selectedTool])

    const boardStyles = StyleSheet.create({
        board:{
            height: "100vh",
            cursor: props.selectedTool.cursorClass
        },
        grid:{
            top: boardPosition.y + mousePositionChange.y,
            left: boardPosition.x + mousePositionChange.x,
        }
    })

    const grid = <div className={`position-absolute ${css(boardStyles.grid)}`}>{props.board.map((row, y) => { return (<Row key={y} cellStates={row} y={y}/>)})}</div>;

    return(
        <div className={"board user-select-none " + css(boardStyles.board)}>
            {grid}
        </div>
    )
}