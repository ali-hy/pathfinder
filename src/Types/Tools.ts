import Pos from "./Pos";

import handIcon from "../Images/Icons/open-hand.png";
import personIcon from "../Images/Icons/person.png";
import locationPinIcon from "../Images/Icons/location-pin.png";
import wallIcon from "../Images/Icons/brick-wall.jpg";

import { CellState } from "./CellState";

export enum TOOL{
    hand,
    placeWall,
    placeSearchStart,
    placeSearchTarget,
    endBrush
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

export class tool{
    cursorClass:string;
    index:number;
    icon;

    active = false;

    getIndex():number{return this.index}
    getIcon(){return this.icon}
    getCursorClass():string{return this.cursorClass}

    onMouseDown(e:MouseEvent):actionDetails{
        return {type: ACTION.none};
    };
    onMouseMove(newPosition:Pos):actionDetails{
        return {type: ACTION.none};
    };
    onMouseUp():actionDetails{
        return {type: ACTION.none};
    };
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
    cursorClass:string = "crosshair"

    constructor(index:TOOL, itemPlaced:CellState, icon?){
        super();
        this.index = index;
        this.itemPlaced = itemPlaced;
        this.icon = icon;
    }

    onMouseDown(cell:Pos): actionDetails {
        return {type: ACTION.place, payload: {
            cell: cell,
            newState: this.itemPlaced
        }}
    }
}

const tools = [];
tools[TOOL.hand] = new handTool();
tools[TOOL.placeWall] = new placeTool(TOOL.placeWall, CellState.wall, wallIcon);
tools[TOOL.placeSearchStart] = new placeTool(TOOL.placeSearchStart, CellState.searchStart, personIcon);
tools[TOOL.placeSearchTarget] = new placeTool(TOOL.placeSearchTarget, CellState.target, locationPinIcon);

export default tools;