import {tool} from "../../Types/Tools";
import {Dispatch, EventHandler, SyntheticEvent} from "react";

interface ToolButtonProps {
	toolDetails: tool,
	selected: boolean,
	setSelectedTool: EventHandler<SyntheticEvent>
	disabled?: boolean
}

export default function ToolButton(props: ToolButtonProps) {
	return (
		<div
			className={`tool-btn 
				${props.selected ? 'selected' : ''} 
				${props.disabled ? 'disabled' : ''} 
				d-flex justify-content-center align-items-center`}
			onClick={props.setSelectedTool}
		>
			<img src={props.toolDetails.getIcon()} alt="n/a"/>
		</div>
	)
}