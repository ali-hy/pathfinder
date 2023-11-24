import BoardData from "../../Types/BoardData";
import Pos from "../../Types/Pos";
import CellData from "../../Types/CellData";
import {CELLSTATE} from "../../Types/CellState";
import copyBoard from "../../utils/copyBoard";
import shuffle from "../../utils/shuffle";

export default function* dfsMazeGenerator(board: BoardData, startPos: Pos = new Pos(0, 0)) {
	let x: number, y: number;
	for (y = 0; y < board.height; y++) {
		for (x = 0; x < board.width; x++) {
			const currentCell = board.cellAtPos({x, y});
			currentCell.state = CELLSTATE.wall;
			currentCell.setMazeEdges();
		}
		yield copyBoard(board);
	}

	if (startPos.x % 2 == 0) {
		if (startPos.x > 1) startPos.x--;
		else startPos.x++;
	}

	if (startPos.y % 2 == 0) {
		if (startPos.y > 1) startPos.y--;
		else startPos.y++;
	}

	const stack = [board.cellAtPos(startPos)];
	const path: CellData[] = [];

	const tail = () => path[path.length - 1];
	const addToPath = (cell: CellData) => {

		if (tail() === undefined) {
			cell.walk();
			path.push(cell);
			return;
		}

		while (!cell.isAdjTo(tail())) {
			tail().empty();
			path.pop();
		}

		const midCell = tail().cellTo(cell);
		midCell.walk();
		cell.walk();
		path.push(midCell);
		path.push(cell)
	}

	while (stack.length) {
		const currentCell = stack.pop();

		if (currentCell.state === CELLSTATE.empty)
			continue;

		addToPath(currentCell);

		const edges = currentCell.edgesToWalls();

		shuffle(edges).forEach(edge => {
			stack.push(edge.end);
		});

		yield copyBoard(board);
	}

	while (path.length) {
		tail().empty();
		path.pop();
	}

	for (x = 0; x < board.width; x++)
		for (y = 0; y < board.height; y++)
			board.cellAtPos({x, y}).setEdges();

	return (board);
}