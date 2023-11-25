import {BOARDSTATE} from "./BOARDSTATE";
import CellData from "./CellData";
import Edge from "./Edge";
import Pos from "./Pos";

export default class BoardData {
	grid: CellData[][];
	width: number;
	height: number;
	state: BOARDSTATE;
	private allowDiagonals: boolean;

	constructor(height?: number, width?: number, allowDiagonals?: boolean) {
		if (height === undefined) {
			return;
		}
		this.height = height;
		this.width = width;
		this.grid = [];
		CellData.board = this;
		Edge.board = this;
		this.state = BOARDSTATE.drawing;
		this.allowDiagonals = allowDiagonals;

		for (let i = 0; i < height; i++) {
			const row = [];
			for (let j = 0; j < width; j++) {
				row.push(new CellData(new Pos(j, i)));
			}
			this.grid.push(row);
		}

		this.generateEdges();
	}

	generateEdges() {
		this.grid.forEach(row => {
			row.forEach(cell => {
				cell.setEdges(this.allowDiagonals);
			})
		});
	}

	setDiagonals(val: boolean) {
		this.allowDiagonals = val;
		this.generateEdges();
	}

	cellAtPos({x, y}: { x: number, y: number }) {
		return this.grid[y][x];
	}

	pathToPos(pos: Pos) {
		return this.cellAtPos(pos).getCurrentPath();
	}

	pathToCell(cell: CellData) {
		return cell.getCurrentPath();
	}

	forEach(callback: (element: CellData[], index: number, arr: CellData[][]) => void, thisArg?: Object) {
		this.grid.forEach(callback, thisArg);
	}

	map(callback: (element, index, arr) => any, thisArg?: Object) {
		return this.grid.map(callback, thisArg);
	}
}