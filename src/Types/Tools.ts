import Pos from "./Pos";

export enum TOOL{
    hand,
    wallBrush,
    startBrush,
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
    static index:number;
    cursorClass:string;
    active = false;
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
    static index = TOOL.hand;
    static prevPosition:Pos;
    static cursorClass = "grab";
    static iconURL = "../../public/Images/Icons/open-hand.png"

    onMouseDown(e:MouseEvent):actionDetails{
        this.cursorClass = "grabbing";
        this.active = true;
        handTool.prevPosition = {x: e.clientX, y: e.clientY};

        return {type: ACTION.rerenderTool}
    }
    onMouseMove(newPosition:Pos):actionDetails{
        // console.log('trying to move')
        const result =  {type: ACTION.move, payload:{
            x: newPosition.x - handTool.prevPosition.x, 
            y: newPosition.y - handTool.prevPosition.y
        }};
        handTool.prevPosition = {...newPosition};
        return result;
    }
    onMouseUp():actionDetails{
        this.active = false;
        this.cursorClass = "grab";
        return {type: ACTION.rerenderTool}
    }
    toString(){
        return (`handTool{
            index: ${handTool.index},
            cursorClass: ${this.cursorClass}
        }`)
    }
}

const tools = []
tools[TOOL.hand] = new handTool();

export default tools;