import Pos from "./Pos";

import handIcon from "../Images/Icons/open-hand.png";
import personIcon from "../Images/Icons/person.png";
import locationPinIcon from "../Images/Icons/location-pin.png";
import wallIcon from "../Images/Icons/brick-wall.jpg";
import eraserIcon from "../Images/Icons/eraser.png";
// eraser by Madeleine Bennett from <a href="https://thenounproject.com/browse/icons/term/eraser/" target="_blank" title="eraser Icons">Noun Project</a>

import { CELLSTATE } from "./CellState";

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
    compound,
    none
}

export interface actionDetails{
    type:ACTION,
    payload?:any
}

export abstract class tool{
    cursorClass:string;
    index:number;
    icon:string;

    active = false;

    getIndex():number{return this.index}
    getIcon(){return this.icon}
    getCursorClass():string{return this.cursorClass}

    abstract onMouseDown(obj:any):actionDetails;
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
        this.prevPosition = new Pos(e.clientX, e.clientY);

        return {type: ACTION.rerenderTool}
    }
    onMouseMove(newPosition:Pos):actionDetails{
        const result =  {type: ACTION.move, payload:new Pos(
            newPosition.x - this.prevPosition.x,
            newPosition.y - this.prevPosition.y
        )};
        this.prevPosition =  new Pos(newPosition.x, newPosition.y);
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
    itemPlaced:CELLSTATE;
    cursorClass:string = "crosshair";
    dragable:boolean;
    active = false;
    onlyOne:boolean;
    previousPosition?:Pos;

    constructor(index:TOOL, itemPlaced:CELLSTATE, icon?:string, onlyOne=false){
        super();
        this.index = index;
        this.itemPlaced = itemPlaced;
        this.icon = icon;
        this.dragable = !onlyOne;
        this.onlyOne = onlyOne;
    }

    onMouseDown(pos:Pos):actionDetails {
        this.active = true;
        if(!this.onlyOne)
            return {type: ACTION.place, payload: {
                cell: pos,
                newState: this.itemPlaced
            }}
        if(this.previousPosition === undefined){
            this.previousPosition = pos;
        }
        const result = {
            type: ACTION.place, payload: 
            {
                cell: pos,
                newState: this.itemPlaced,
                replacePrev: true,
                previousPosition: {...this.previousPosition}
            }
        };
        this.previousPosition = pos;
        return result;
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
        return { type: ACTION.none };
    }
}

const tools = [];
tools[TOOL.hand] = new handTool();
tools[TOOL.placeWall] = new placeTool(
    TOOL.placeWall, 
    CELLSTATE.wall, 
    wallIcon
);
tools[TOOL.placeSearchStart] = new placeTool(
    TOOL.placeSearchStart, 
    CELLSTATE.searchStart, 
    personIcon, 
    true
);
tools[TOOL.placeSearchTarget] = new placeTool(
    TOOL.placeSearchTarget, 
    CELLSTATE.target, 
    locationPinIcon, 
    true
);
tools[TOOL.eraser] = new placeTool(
    TOOL.eraser, 
    CELLSTATE.empty, 
    eraserIcon
);

export default tools;