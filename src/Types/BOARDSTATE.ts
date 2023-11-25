import BoardData from "./BoardData";

export enum BOARDSTATE {
	drawing,
	generatingMaze,
	searching,
	playingAnimation,
	paused,
	searchComplete,
}

export function boardToDrawing(board: BoardData) {
	board.state = BOARDSTATE.drawing;
}

export function boardToPlayingAnimation(board: BoardData) {
	board.state = BOARDSTATE.playingAnimation;
}

export function boardToSearchComplete(board: BoardData) {
	board.state = BOARDSTATE.searchComplete
}
