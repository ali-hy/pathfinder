/* eslint-disable react-hooks/exhaustive-deps */
import './Board.scss';

import { useCallback, useEffect, useRef, useState } from "react";
import Row from "./Row";
import tools, { ACTION, actionDetails, placeTool, TOOL, tool } from '../../Types/Tools';
import Pos from '../../Types/Pos';
import { css, StyleSheet } from 'aphrodite';
import useUpdatingRef from '../../Hooks/useUpdatingRef';
import useForceUpdate from '../../Hooks/useForceUpdate';
import CellData from '../../Types/CellData';

interface BoardProps{
    board:CellData[][];
    boardPosition:Pos;
    selectedTool:tool;
    setSelectedTool:Function;
    onCellClick(x:number, y:number):void;
    onCellEnter(x:number, y:number):void;
}


export default function Board(props:BoardProps){
    const [prevTool, setPrevTool] = useState<tool>();
    const prevToolRef = useUpdatingRef(prevTool);   //reference for event handlers
    const selectedToolRef = useUpdatingRef(props.selectedTool); //reference for event handlers
    const forceUpdate = useForceUpdate();

    const boardContainerRef = useRef();
    const boardRef = useRef();

    const takeAction = ({type, payload}:actionDetails) => {
        switch(type){
            case ACTION.rerenderTool:
                forceUpdate();
                break;
            case ACTION.move:
                if(boardContainerRef.current) (boardContainerRef.current as HTMLElement).scrollBy(-payload.x, -payload.y);
                break;
        }
    }

    // ------- HAND TOOL EVENT HANDLERS --------
    const mouseDownHandler = useCallback((e:MouseEvent) => {
        var action:actionDetails;
        if(e.button === 0){ // left mb down
            if(selectedToolRef.current instanceof placeTool)
                return;
            action = selectedToolRef.current.onMouseDown(e);
            action.payload = {x: e.clientX, y: e.clientY};
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb down
            e.preventDefault();
            if(selectedToolRef.current.index !== TOOL.hand){
                setPrevTool(selectedToolRef.current);
                props.setSelectedTool(tools[TOOL.hand]);
            }
            action = tools[TOOL.hand].onMouseDown(e);
            takeAction(action);
        }
    }, [])
    const mouseUpHandler = useCallback((e:MouseEvent) => {
        if(e.button === 0){ // left mb up
            const action:actionDetails = selectedToolRef.current.onMouseUp();
            takeAction(action);
        } 
        else if (e.button === 1){ // middle mb up
            tools[TOOL.hand].onMouseUp();
            props.setSelectedTool(prevToolRef.current);
            // setPrevTool(undefined);
        }
    },[])
    const mouseMoveHandler = useCallback((e:MouseEvent) => {
        const tool = selectedToolRef.current;
        if(tool.active){
            takeAction(tool.onMouseMove(new Pos(e.clientX, e.clientY)))
        };
    },[])
    const handleKeyDown = useCallback((e:KeyboardEvent) => {
        e.preventDefault();
        if(e.key.toLowerCase() === " "){
            if(prevToolRef.current !== undefined) return;            
            setPrevTool(selectedToolRef.current);
            props.setSelectedTool(tools[TOOL.hand]);
        }
    },[])
    const handleKeyUp = useCallback((e:KeyboardEvent) => {
        if(e.key === " "){
            tools[TOOL.hand].onMouseUp();
            props.setSelectedTool(prevToolRef.current);
            setPrevTool(undefined);
        }
    },[])

    // ------- ON COMPONENT MOUNT ----------
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        //Scroll to center
        const boardElement:HTMLElement = boardRef.current;
        (boardContainerRef.current as HTMLElement).scrollTo(
            boardElement.offsetWidth/2 - window.innerWidth/2, 
            boardElement.offsetHeight/2 - window.innerHeight/2 - 20
        )
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);


    const boardStyles = StyleSheet.create({
        board:{
            cursor: props.selectedTool.getCursorClass(),    
        },
    })

    const grid = <div className={`position-relative`}>
        {props.board.map((row, y) => { return (
            <Row 
                onCellClick={(x:number, y:number) => props.onCellClick(x,y)}
                onCellEnter={(x:number, y:number) => props.onCellEnter(x,y)}
                key={y}
                cellData={row} 
                y={y}
            />)})}
    </div>;

    return(
        <div 
            className={"board-container " + css(boardStyles.board)}
            onMouseDown={mouseDownHandler as any} 
            onMouseUp={mouseUpHandler as any} 
            onMouseMove={mouseMoveHandler as any}  
            ref={boardContainerRef} 
        >
            <div ref={boardRef} className={"board user-select-none"}>
                {grid}
            </div>
        </div>
    )
}