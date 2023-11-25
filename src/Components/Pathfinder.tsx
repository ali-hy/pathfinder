/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useMemo, useRef, useState} from "react";
import {CELLSTATE} from "../Types/CellState";
import Pos from "../Types/Pos";
import tools, {placeTool, TOOL, tool} from "../Types/Tools";
import Banner from "./Banner/Banner";
import Board from "./Board/Board";
import ToolButton from "./Banner/ToolButton";
import {
	BOARDSTATE,
	boardToDrawing,
	boardToPlayingAnimation,
	boardToSearchComplete
} from "../Types/BOARDSTATE";
import {ALGORITHM} from "../algorithms/pathfinding/ALGORITHM";
import {
	PathfindingAlgorithm
} from "../algorithms/pathfinding/PathfindingAlgorithm";
import BfsPathfinder from "../algorithms/pathfinding/BFSpathfinder";
import DfsPathfinder from "../algorithms/pathfinding/DFSpathfinder";
import DijkstrasPathfinder from "../algorithms/pathfinding/DijkstrasPathfinder";
import AstarPathfinder from "../algorithms/pathfinding/AstarPathfinder";
import BoardData from "../Types/BoardData";
import copyBoard from "../utils/copyBoard";
import dfsMazeGenerator from "../algorithms/maze-generation/dfsMaze";

// ------ INITIAL GRID DATA -------
const defaultAnimationInterval = 50;
export const gridHeight = 33;
export const gridWidth = 71;

function generateBoard(allowDiagonals = false) {
	return new BoardData(gridHeight, gridWidth, allowDiagonals);
}

function* drawPath(board: BoardData, path: Pos[]) {
	path.pop();
	path.shift();

	for (let i = 0; i < path.length; i++) {
		board.cellAtPos(path[i]).walk();
		yield copyBoard(board);
	}

	return (board);
}

export default function PathFinder() {
	const [algorithms, setAlgorithms] = useState<PathfindingAlgorithm[]>([]);
	const [boardPosition, setBoardPosition] = useState<Pos>(new Pos(0, 0));
	const [allowDiagonals, setAllowDiagonals] = useState(false);
	const [board, setBoard] = useState(useMemo(() => generateBoard(allowDiagonals), []));
	const [selectedAlgorithm, selectAlgorithm] = useState(ALGORITHM.bfs);
	const [selectedTool, setSelectedTool] = useState(tools[TOOL.hand]);
	const [startPosition, setStartPosition] = useState<Pos | undefined>();
	const [targetPosition, setTargetPosition] = useState<Pos | undefined>();
	const [message, setMessage] = useState<string>();

	const startTime = useRef<number>(-1);
	const prevRemainder = useRef<number>(0);

	// ---- UTILITY FUNCTIONS ----
	const initAlgorithms = () => {
		algorithms[ALGORITHM.bfs] = new BfsPathfinder();
		algorithms[ALGORITHM.dfs] = new DfsPathfinder();
		algorithms[ALGORITHM.dijkstras] = new DijkstrasPathfinder();
		algorithms[ALGORITHM.aStar] = new AstarPathfinder();
		setAlgorithms([...algorithms]);
	}

	const clearBoard = () => {
		board.forEach((row) => {
			row.forEach((cell) => {
				cell.clearParent();
				if (cell.state !== CELLSTATE.empty) {
					cell.empty();
				}
			});
		});
		board.state = BOARDSTATE.drawing;
		setBoard(copyBoard(board));
		setMessage("");
	}

	// on component loaded
	useEffect(() => {
		initAlgorithms();
	}, []);

	const resetPathSearch = (): void => {
		board.forEach((row) => {
			row.forEach((cell) => {
				cell.clearParent();
				if (cell.state === CELLSTATE.visited || cell.state === CELLSTATE.path) {
					cell.empty();
				}
			});
		});
		board.state = BOARDSTATE.drawing
		setBoard(copyBoard(board));
		setMessage("");
	};

	const fillInPath = (path: Pos[]) => {
		animateBoard(drawPath, undefined, boardToSearchComplete, undefined, path);
	};

	const onCellClick = (x: number, y: number): void => {
		if (!(selectedTool instanceof placeTool)) {
			return;
		}
		if (board.state === BOARDSTATE.searchComplete) {
			resetPathSearch();
		}

		if (startPosition?.equals({x, y}))
			setStartPosition(undefined);
		else if (targetPosition?.equals({x, y}))
			setTargetPosition(undefined);

		const nextBoard = copyBoard(board);
		const {payload} = selectedTool.onMouseDown(new Pos(x, y));
		if (payload.replacePrev) {
			nextBoard.cellAtPos(payload.previousPosition).state = CELLSTATE.empty;
			if (payload.newState === CELLSTATE.searchStart) {
				setStartPosition(new Pos(x, y));
			} else if (payload.newState === CELLSTATE.target) {
				setTargetPosition(new Pos(x, y));
			}
		}
		nextBoard.cellAtPos({x, y}).state = payload.newState;
		setBoard(nextBoard);
	};

	const onCellEnter = (x: number, y: number): void => {
		if (
			!(selectedTool instanceof placeTool) ||
			!selectedTool.dragable ||
			!selectedTool.active
		) {
			return;
		}
		const nextBoard = copyBoard(board);
		const {payload} = selectedTool.onMouseEnter(new Pos(x, y));
		nextBoard.cellAtPos({x, y}).state = payload.newState;
		setBoard(nextBoard);
	};

	// PATHFINDING
	const initPathFinding = () => {
		algorithms[selectedAlgorithm].initPathfinding(board, startPosition, targetPosition);
	}

	const executeAnimatedStep = (time?: number) => {
		if (startTime.current < 0) {
			startTime.current = time;
		}
		const elapsedTime = time - startTime.current;
		const currentRemainder = elapsedTime % defaultAnimationInterval;

		if (currentRemainder < prevRemainder.current) {
			for (let i = 0; i < 4; i++) {
				if (executePathfindingStep() === BOARDSTATE.searchComplete) {
					return;
				}
			}
		}

		prevRemainder.current = currentRemainder;
		requestAnimationFrame(executeAnimatedStep);
	}

	const playAnimation = () => {
		if (board.state === BOARDSTATE.drawing) {
			initPathFinding();
			setSelectedTool(tools[TOOL.hand]);
		}
		window.requestAnimationFrame(executeAnimatedStep);
	}

	const executePathfindingStep = () => {
		const {
			board,
			path
		} = algorithms[selectedAlgorithm].executeStep();

		setBoard(board);
		if (board.state === BOARDSTATE.searchComplete) {
			if (path) {
				fillInPath(path);
			}
		}

		return board.state;
	}

	// ANIMATION
	const makeBoardAnimationStep = (generator: Generator<BoardData, any, any>,
																	interval: number,
																	onDone: (board: BoardData) => void) => {
		const step = (timeStamp: number) => {
			if (startTime.current < 0) {
				startTime.current = timeStamp;
			}

			const elapsedTime = timeStamp - startTime.current;

			let multiplier = 1;
			if (elapsedTime > 3000)
				multiplier = 3;
			else if (elapsedTime > 10000)
				multiplier = 20;

			const currentRemainder = elapsedTime % interval;

			if (currentRemainder < prevRemainder.current) {
				let next: IteratorResult<BoardData>;

				for (let i = 0; i < multiplier; i++) {
					next = generator.next();
					if (next.done)
						break;
				}

				setBoard(next.value);
				if (next.done) {
					setBoard((board) => {
						if (onDone !== undefined) onDone(board);
						return copyBoard(board);
					})
					return;
				}
			}

			prevRemainder.current = currentRemainder;
			requestAnimationFrame(step);
		}

		return (step);
	}

	const animateBoard = (func: (boardData: BoardData, ...args: any[]) => Generator<BoardData, any, any>,
												onStart: (board: BoardData) => void = boardToPlayingAnimation,
												onDone: (board: BoardData) => void = boardToDrawing,
												interval: number = defaultAnimationInterval,
												...callbackArgs: any[]) => {

		const generator = func(board, ...callbackArgs);
		startTime.current = -1;
		onStart(board);
		const step = makeBoardAnimationStep(generator, interval, onDone)

		requestAnimationFrame(step);
	}

	const generateMaze = () => {
		setAllowDiagonals(false);
		setSelectedTool(tools[TOOL.hand]);
		board.state = BOARDSTATE.generatingMaze;
		setBoard(copyBoard);
		animateBoard(dfsMazeGenerator, boardToPlayingAnimation, boardToDrawing, 10);
	}

	const disableBoardEditing =
		board.state !== BOARDSTATE.drawing;

	const disableReset =
		board.state !== BOARDSTATE.searchComplete;

	return (
		<>
			<Banner
				selectAlgorithm={selectAlgorithm}
				algorithms={algorithms}
			>
				<ul className="tools-list list-unstyled">
					{tools.map((t: tool, index) => (
						<ToolButton
							key={index}
							toolDetails={t}
							selected={t.getIndex() === selectedTool.getIndex()}
							setSelectedTool={() => {
								setSelectedTool(t);
							}}
							disabled={disableBoardEditing}
						/>
					))}
					<li>
						<button
							onClick={clearBoard}
							className={"btn btn-light"}
							disabled={disableBoardEditing && disableReset}
						>
							Clear board
						</button>
					</li>
				</ul>
				<div className="d-flex align-items-center">
					<input
						id={"allow-diagonals-checkbox"}
						type={"checkbox"}
						className={"btn btn-dark me-1"}
						checked={allowDiagonals}
						onChange={() => {
							setAllowDiagonals(!allowDiagonals);
							board.setDiagonals(!allowDiagonals);
						}}
						disabled={disableBoardEditing}
					/>
					<label className={"me-4"} htmlFor={"allow-diagonals-checkbox"}>Allow
						Diagonals</label>

					<button
						disabled={disableBoardEditing}
						className={"btn btn-secondary me-3"}
						onClick={generateMaze}
					>
						Generate maze
					</button>

					<button className="btn btn-outline-primary me-2"
									onClick={resetPathSearch}
									disabled={disableReset}
					>
						Reset Search
					</button>

					<button
						className="btn btn-primary me-2"
						onClick={() => playAnimation()}
						disabled={disableBoardEditing}
					>
						Find Path
					</button>
					{message && <p className="message">{message}</p>}
				</div>
			</Banner>
			<Board
				boardPosition={boardPosition}
				board={board}
				selectedTool={selectedTool}
				setSelectedTool={setSelectedTool}
				onCellClick={(x: number, y: number) => onCellClick(x, y)}
				onCellEnter={(x: number, y: number) => onCellEnter(x, y)}
			/>

		</>
	);
}
