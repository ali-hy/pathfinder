import { tool } from "../../Types/Tools";

interface ToolButtonProps{
    toolDetials:tool,
    selected:boolean,
    setSelectedTool
}

export default function ToolButton(props:ToolButtonProps){
    return (
        <div className={`tool-btn ${props.selected?'selected':''} d-flex justify-content-center align-items-center`} onClick={props.setSelectedTool}>
            <img src={props.toolDetials.getIcon()} alt="n/a" />
        </div>
    )
}