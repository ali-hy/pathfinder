/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useMemo, useRef, useState} from "react";
import {CELLSTATE} from "../Types/CellState";
import Pos from "../Types/Pos";
import tools, {placeTool, TOOL, tool} from "../Types/Tools";
import Banner from "./Banner/Banner";
import Board from "./Board/Board";
import ToolButton from "./Banner/ToolButton";
import {BOARDSTATE} from "../Types/BoardState";
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

export default function PathFinder() {
	const [algorithms, setAlgorithms] = useState<PathfindingAlgorithm[]>([]);
	const [boardPosition, setBoardPosition] = useState<Pos>(new Pos(0, 0));
	const [allowDiagonals, setAllowDiagonals] = useState(false);
	const [board, setBoard] = useState(useMemo(() => generateBoard(allowDiagonals), []));
	const [boardState, setBoardState] = useState(BOARDSTATE.drawing);
	const [selectedAlgorithm, selectAlgorithm] = useState(ALGORITHM.bfs);
	const [selectedTool, setSelectedTool] = useState(tools[TOOL.hand]);
	const [startPosition, setStartPosition] = useState<Pos>();
	const [targetPosition, setTargetPosition] = useState<Pos>();
	const [message, setMessage] = useState<string>();

	const startTime = useRef<number>(-1);
	const walkIntervalTime = useRef<number>(10);
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
		setBoard(copyBoard(board));
		setMessage("");
		setBoardState(BOARDSTATE.drawing);
	};

	const fillInPath = (path: Pos[]) => {
		path.pop();
		path.shift();
		let startTime: number,
			prevRemainder = {current: -1},
			indexInPath = {current: 0};

		const walkOneStep = (time: number) => {
			if (indexInPath.current >= path.length) {
				return;
			}
			if (startTime === undefined) {
				startTime = time;
				prevRemainder.current = 0;
			}
			const elapsedTime = time - startTime;
			const currentRemainder = elapsedTime % walkIntervalTime.current;
			if (currentRemainder < prevRemainder.current) {
				const currentCell = getCellAtPos(path[indexInPath.current++]);
				currentCell.walk();
				setBoard(copyBoard(board));
			}
			prevRemainder.current = currentRemainder;
			requestAnimationFrame(walkOneStep);
		};

		requestAnimationFrame(walkOneStep);
	};

	const onCellClick = (x: number, y: number): void => {
		if (!(selectedTool instanceof placeTool)) {
			return;
		}
		if (boardState === BOARDSTATE.searchComplete) {
			resetPathSearch();
		}
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

	const getCellAtPos = ({x, y}: Pos) => {
		return board.cellAtPos({x, y});
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
			for (let i = 0; i < 10; i++) {
				if (executePathfindingStep() === BOARDSTATE.searchComplete) {
					return;
				}
			}
		}

		prevRemainder.current = currentRemainder;
		requestAnimationFrame(executeAnimatedStep);
	}

	const playAnimation = () => {
		if (boardState === BOARDSTATE.drawing) {
			initPathFinding();
			setSelectedTool(tools[TOOL.hand]);
		}
		window.requestAnimationFrame(executeAnimatedStep);
	}

	const executePathfindingStep = () => {
		const {
			board,
			boardState,
			path
		} = algorithms[selectedAlgorithm].executeStep();

		setBoard(board);
		setBoardState(boardState);
		if (boardState === BOARDSTATE.searchComplete) {
			if (path) {
				fillInPath(path);
			}
		}

		return boardState;
	}

	const executeOneStep = () => {
		if (boardState === BOARDSTATE.drawing) {
			initPathFinding();
		}
		executePathfindingStep();
	}

	const disableSearch = boardState === BOARDSTATE.searchComplete;

	// ANIMATION
	const makeBoardAnimationStep = (generator: Generator<BoardData, any, any>, interval: number) => {
		const step = (timeStamp: number) => {
			if (startTime.current < 0) {
				startTime.current = timeStamp;
			}
			const elapsedTime = timeStamp - startTime.current;
			const currentRemainder = elapsedTime % interval;

			if (currentRemainder < prevRemainder.current) {
				const next = generator.next();
				setBoard(next.value);
				if (next.done) {
					board.state = BOARDSTATE.drawing;
					return;
				}
			}

			prevRemainder.current = currentRemainder;
			requestAnimationFrame(step);
		}

		return (step);
	}

	const animateBoard = (func: (boardData: BoardData, ...args: any[]) => Generator<BoardData, any, any>,
												interval?: number,
												...callbackArgs: any[]) => {
		if (interval == undefined)
			interval = defaultAnimationInterval;

		const generator = func(board, ...callbackArgs);
		const step = makeBoardAnimationStep(generator, interval)

		requestAnimationFrame(step);
	}

	const generateMaze = () => {
		setAllowDiagonals(false);
		setSelectedTool(tools[TOOL.hand]);
		board.state = BOARDSTATE.generatingMaze;
		animateBoard(dfsMazeGenerator, 10);
	}

	const disableUI =
		board.state === BOARDSTATE.generatingMaze ||
		board.state === BOARDSTATE.searching ||
		board.state === BOARDSTATE.paused;

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
							disabled={disableUI}
						/>
					))}
					<li>
						<button
							onClick={clearBoard}
							className={"btn btn-light"}
						>Clear board
						</button>
					</li>
				</ul>
				<div className="d-flex align-items-center">
					<input
						id={"allow-diagonals-checkbox"}
						type={"checkbox"}
						className={"btn btn-dark me-1"}
						checked={allowDiagonals}
						onClick={() => {
							setAllowDiagonals(!allowDiagonals);
							algorithms[selectedAlgorithm].board.setDiagonals(!allowDiagonals);
						}}
					/>
					<label className={"me-4"} htmlFor={"allow-diagonals-checkbox"}>Allow
						Diagonals</label>
					<button className="btn btn-outline-primary me-2"
									onClick={resetPathSearch}>Reset Search
					</button>
					<button
						className="btn btn-primary me-2"
						onClick={() => playAnimation()}
						disabled={disableSearch}
					>
						Find Path
					</button>
					<button
						className="btn btn-primary next-btn fw-bold"
						onClick={() => executeOneStep()}
						disabled={disableSearch}
					>
						&gt;
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
			<button
				disabled={disableUI}
				className={"btn btn-secondary position-fixed end-0 bottom-0 me-4 mb-4"}
				onClick={generateMaze}
			>Generate maze
			</button>
		</>
	);
}
