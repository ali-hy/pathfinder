import Pos from "./Pos";

import handIcon from "../Images/Icons/open-hand.png";
import personIcon from "../Images/Icons/person.png";
import locationPinIcon from "../Images/Icons/location-pin.png";
import wallIcon from "../Images/Icons/brick-wall.jpg";
import eraserIcon from "../Images/Icons/eraser.png";
// eraser by Madeleine Bennett from <a href="https://thenounproject.com/browse/icons/term/eraser/" target="_blank" title="eraser Icons">Noun Project</a>

import { CellState } from "./CellState";

export enum TOOL{
    hand,
    placeWall,
    placeSearchStart,
    placeSearchTarget,
    endBrush,
    eraser
}

export enum ACTION{
    move,
    place,
    rerenderTool,
    none
}

export interface actionDetails{
    type:ACTION,
    payload?:any
}

export abstract class tool{
    cursorClass:string;
    index:number;
    icon;

    active = false;

    getIndex():number{return this.index}
    getIcon(){return this.icon}
    getCursorClass():string{return this.cursorClass}

    abstract onMouseDown(e:MouseEvent):actionDetails;
    onMouseMove(newPosition:Pos):actionDetails{return {type: ACTION.none}};
    onMouseUp():actionDetails{ return {type:ACTION.none} };
    
    toString():string{
        return "tool";
    };
}

export class handTool extends tool{
    index = TOOL.hand;
    prevPosition:Pos;
    cursorClass = "grab";
    icon = handIcon;

    getIndex(){
        return this.index;
    }
    getIcon(){
        return this.icon;
    }
    getCursorClass(): string {
        return this.cursorClass;
    }
    setCursorClass(cursor:string){
        this.cursorClass = cursor;
    }

    onMouseDown(e:MouseEvent):actionDetails{
        this.setCursorClass('grabbing');
        this.active = true;
        this.prevPosition = {x: e.clientX, y: e.clientY};

        return {type: ACTION.rerenderTool}
    }
    onMouseMove(newPosition:Pos):actionDetails{
        const result =  {type: ACTION.move, payload:{
            x: newPosition.x - this.prevPosition.x, 
            y: newPosition.y - this.prevPosition.y
        }};
        this.prevPosition = {...newPosition};
        return result;
    }
    onMouseUp():actionDetails{
        this.active = false;
        this.setCursorClass('grab');
        return {type: ACTION.rerenderTool}
    }
    toString(){
        return (`handTool{
            index: ${this.index},
            cursorClass: ${this.getCursorClass()}
        }`)
    }
}

export class placeTool extends tool{
    itemPlaced:CellState;
    cursorClass:string = "crosshair";
    dragable:boolean;
    active = false;

    constructor(index:TOOL, itemPlaced:CellState, icon?, dragable:boolean =false){
        super();
        this.index = index;
        this.itemPlaced = itemPlaced;
        this.icon = icon;
        this.dragable = dragable;
    }

    onMouseDown(cell:Pos):actionDetails {
        this.active = true;
        return {type: ACTION.place, payload: {
            cell: cell,
            newState: this.itemPlaced
        }}
    }

    onMouseEnter(cell:Pos):actionDetails {
        if(!this.active){
            return {type: ACTION.none}
        }
        return {type: ACTION.place, payload:{
            cell: cell,
            newState: this.itemPlaced
        }}
    }

    onMouseUp(){
        this.active = false;
        return{type: ACTION.none}
    }
}

const tools = [];
tools[TOOL.hand] = new handTool();
tools[TOOL.placeWall] = new placeTool(TOOL.placeWall, CellState.wall, wallIcon, true);
tools[TOOL.placeSearchStart] = new placeTool(TOOL.placeSearchStart, CellState.searchStart, personIcon);
tools[TOOL.placeSearchTarget] = new placeTool(TOOL.placeSearchTarget, CellState.target, locationPinIcon);
tools[TOOL.eraser] = new placeTool(TOOL.eraser, CellState.empty, eraserIcon, true);

export default tools;