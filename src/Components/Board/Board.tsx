import './Board.scss';

import { useEffect, useRef, useState } from "react";
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
var _mousePositionChange:Pos;
var _selectedTool;



export default function Board(props:BoardProps){
    const [mousePositionChange, setMousePositionChange] = useState<Pos>({x: 0, y:0});
    const boardContainerRef = useRef();
    const boardRef = useRef();

    const takeAction = ({type, payload}:actionDetails) => {
        switch(type){
            case ACTION.rerenderTool:
                if(props.selectedTool.active){_mouseStartPosition = payload}
                props.setSelectedTool({...props.selectedTool});
                break;
            case ACTION.move:
                if(boardContainerRef.current) (boardContainerRef.current as HTMLElement).scrollBy(-payload.x, -payload.y);
                break;
        }
    }

    const mouseDownHandler = (e:MouseEvent) => {
        if(e.button === 0){ // left mb down
            const action:actionDetails = props.selectedTool.onMouseDown(e);
            action.payload = {x: e.clientX, y: e.clientY};
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb down
            e.preventDefault();
            _prevTool = props.selectedTool;
            tools[TOOL.hand].onMouseDown(e);
            props.setSelectedTool({...tools[TOOL.hand]});
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
        const tool = _selectedTool;
        if(tool.active){
            takeAction(props.selectedTool.onMouseMove({x: e.clientX, y: e.clientY}))
        };
    }

    // ------- ON COMPONENT MOUNT ----------
    useEffect(() => {
        //Add event listeners
        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('mousemove', mouseMoveHandler);
        // TODO: switch to hand tool when space is held down

        //Scroll to center
        const boardElement:HTMLElement = boardRef.current;
        (boardContainerRef.current as HTMLElement).scrollTo(
            boardElement.offsetWidth/2 - window.innerWidth/2, 
            boardElement.offsetHeight/2 - window.innerHeight/2 - 20
        )
        return () => {
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            window.addEventListener('mousemove', mouseMoveHandler);
        }
    }, []);

    useEffect(() => {
        _mousePositionChange = mousePositionChange;
    }, [mousePositionChange])
    useEffect(() => {
        _selectedTool = props.selectedTool;
    }, [props.selectedTool])

    const boardStyles = StyleSheet.create({
        board:{
            cursor: props.selectedTool.cursorClass
        },
    })

    const grid = <div className={`position-relative`}>
            {props.board.map((row, y) => { return (<Row key={y} cellStates={row} y={y}/>)})}
        </div>;

    return(
        <div ref={boardContainerRef} className={"board-container " + css(boardStyles.board)}>
            <div ref={boardRef} className={"board user-select-none"}>
                {grid}
            </div>
        </div>
    )
}