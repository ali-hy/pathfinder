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
    index:number;
    cursorClass:string;
    active = false;
    onMouseDown():actionDetails{
        return {type: ACTION.none};
    };
    onMouseMove():actionDetails{
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
    static cursorClass = "grab";
    static iconURL = "../../public/Images/Icons/open-hand.png"

    onMouseDown():actionDetails{
        this.cursorClass = "grabbing";
        this.active = true;
        return {type: ACTION.rerenderTool}
    }
    onMouseMove():actionDetails{
        return {type: ACTION.move};
    }
    onMouseUp():actionDetails{
        this.active = false;
        this.cursorClass = "grab";
        return {type: ACTION.rerenderTool}
    }
    toString(){
        return (`handTool{
            index: ${this.index},
            cursorClass: ${this.cursorClass}
        }`)
    }
}

const tools = []
tools[TOOL.hand] = new handTool();

export default tools;