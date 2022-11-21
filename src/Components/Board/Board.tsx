import './Board.scss';

import { useEffect, useRef, useState } from "react";
import { CellState } from "../../Types/CellState";
import Cell from "./Cell";
import Row from "./Row";
import tools, { ACTION, actionDetails, handTool, TOOL, tool } from '../../Types/Tools';
import Pos from '../../Types/Pos';
import { css, StyleSheet } from 'aphrodite';
import useUpdatingRef from '../../Hooks/useUpdatingRef';

interface BoardProps{
    board:CellState[][];
    boardPosition:Pos;
    setBoardPosition:Function;
    selectedTool:tool;
    setSelectedTool:Function;
}


export default function Board(props:BoardProps){
    const [prevTool, setPrevTool] = useState<tool>();
    const prevToolRef = useUpdatingRef(prevTool);   //reference for event handlers
    const selectedToolRef = useUpdatingRef(props.selectedTool); //reference for event handlers

    const boardContainerRef = useRef();
    const boardRef = useRef();

    const takeAction = ({type, payload}:actionDetails) => {
        switch(type){
            case ACTION.rerenderTool:
                props.setSelectedTool(() => Object.create(selectedToolRef.current));
                break;
            case ACTION.move:
                if(boardContainerRef.current) (boardContainerRef.current as HTMLElement).scrollBy(-payload.x, -payload.y);
                break;
        }
    }

    const mouseDownHandler = (e:MouseEvent) => {
        if(e.button === 0){ // left mb down
            const action:actionDetails = selectedToolRef.current.onMouseDown(e);
            action.payload = {x: e.clientX, y: e.clientY};
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb down
            e.preventDefault();
            setPrevTool(selectedToolRef.current);
            tools[TOOL.hand].onMouseDown(e);
            props.setSelectedTool(Object.create(tools[TOOL.hand]));
        }
    }
    const mouseUpHandler = (e) => {
        if(e.button === 0){ // left mb down
            const action:actionDetails = selectedToolRef.current.onMouseUp();
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb mid
            tools[TOOL.hand].onMouseUp();
            props.setSelectedTool(prevToolRef.current);
        }
    }
    const mouseMoveHandler = (e:MouseEvent) => {
        const tool = selectedToolRef.current;
        if(tool.active){
            takeAction(tool.onMouseMove({x: e.clientX, y: e.clientY}))
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