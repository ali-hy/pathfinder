/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { CELLSTATE } from "../Types/CellState";
import Pos from "../Types/Pos";
import tools, { placeTool, TOOL, tool } from "../Types/Tools";
import Banner from "./Banner/Banner";
import Board from "./Board/Board";
import ToolButton from "./Banner/ToolButton";
import useForceUpdate from "../Hooks/useForceUpdate";
import CellData from "../Types/CellData";
import { BOARDSTATE } from "../Types/BoardState";
import { ALGORITHM } from "../Types/algorithms/ALGORITHM";
import { PathfindingAlgorithm } from "../Types/algorithms/PathfindingAlgorithm";

// ------ INITIAL GRID DATA -------
export const gridHeight = 40;
export const gridWidth = 70;
function generateBoard() {
  const emptyBoard: CellData[][] = new Array(gridHeight);
  for (let y = 0; y < emptyBoard.length; y++) {
    emptyBoard[y] = new Array(gridWidth);
    for (let x = 0; x < emptyBoard[y].length; x++) {
      emptyBoard[y][x] = new CellData(new Pos(x,y));
    }
  }
  return emptyBoard;
}

export default function PathFinder() {
  const [algorithms, setAlgorithms] = useState<PathfindingAlgorithm[]>([]);
  const [boardPosition, setBoardPosition] = useState<Pos>({ x: 0, y: 0 });
  const [board, setBoard] = useState(useMemo(generateBoard, []));
  const [boardState, setBoardState] = useState(BOARDSTATE.drawing);
  const [selectedAlgorithm, selectAlgorithm] = useState(ALGORITHM.makeDo);
  const [selectedTool, setSelectedTool] = useState(tools[TOOL.hand]);
  const [startPosition, setStartPosition] = useState<Pos>();
  const [targetPosition, setTargetPosition] = useState<Pos>();
  const [message, setMessage] = useState<string>();
  const forceUpdate = useForceUpdate();

  const startTime = useRef<number>(-1);
  const searchIntervalTime = useRef<number>(50);
  const walkIntervalTime = useRef<number>(10);
  const prevRemainder = useRef<number>(0);

  // ---- UTILITY FUNCTIONS ----
  const initAlgorithms = () => {
    algorithms[ALGORITHM.makeDo] = new PathfindingAlgorithm(board);
    setAlgorithms([...algorithms]);
  }

  // on component loaded
  useEffect(() => {
    initAlgorithms();
  }, []);

  const resetPathSearch = (): void => {
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.state === CELLSTATE.visited || cell.state === CELLSTATE.path) {
          cell.empty();
        }
      });
    });
    setBoard([...board]);
    setMessage("");
    setBoardState(BOARDSTATE.drawing);
  };

  const fillInPath = (path:Pos[]) => {
    path.pop();
    var startTime:number, 
    prevRemainder = {current: -1},
    indexInPath = {current: 0};

    const walkOneStep = (time:number) => {
      if(indexInPath.current >= path.length){
        return;
      }
      if(startTime === undefined){
        startTime = time;
        prevRemainder.current = 0;
      }
      const elapsedTime = time - startTime;
      const currentRemainder = elapsedTime % walkIntervalTime.current;
      if(currentRemainder < prevRemainder.current){
        const currentCell = getCellAtPos(path[indexInPath.current++]);
        currentCell.walk();
        setBoard([...board]);
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
    if (boardState === BOARDSTATE.searchComplete){
      resetPathSearch();
    }
    const nextBoard = [...board];
    const { payload } = selectedTool.onMouseDown(new Pos( x,y ));
    if (payload.replacePrev) {
      const { x: prevX, y: prevY } = payload.previousPosition;
      nextBoard[prevY][prevX].state = CELLSTATE.empty;
      if (payload.newState === CELLSTATE.searchStart) {
        setStartPosition(new Pos( x,y ));
      } else if (payload.newState === CELLSTATE.target) {
        setTargetPosition(new Pos( x,y ));
      }
    }
    nextBoard[y][x].state = payload.newState;
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
    const nextBoard = [...board];
    const { payload } = selectedTool.onMouseEnter(new Pos( x,y ));
    nextBoard[y][x].state = payload.newState;
    setBoard(nextBoard);
  };

  const getAdjacentPositions = ({ x, y }: Pos) => {
    const adjacentPositions: Pos[] = [];
    if (x > 0) {
      adjacentPositions.push(new Pos(x - 1, y));
    }
    if (x < gridWidth - 1) {
      adjacentPositions.push(new Pos( x + 1, y));
    }
    if (y > 0) {
      adjacentPositions.push(new Pos(x, y - 1));
    }
    if (y < gridHeight - 1) {
      adjacentPositions.push(new Pos(x, y + 1));
    }
    return adjacentPositions;
  };

  const getCellAtPos = ({ x, y }: Pos) => {
    return board[y][x];
  };

  const initPathFinding = () => {
    window.requestAnimationFrame(executePathFindingStep);
    algorithms[selectedAlgorithm] = new PathfindingAlgorithm(board);
    algorithms[selectedAlgorithm].initPathfinding(startPosition);
  }
  
  const executePathFindingStep = (time:number) => {
    if(startTime.current < 0){
      startTime.current = time;
      console.log("start time: ", startTime.current);
    }
    const elapsedTime = time - startTime.current;
    const currentRemainder = elapsedTime % searchIntervalTime.current;

    if(currentRemainder < prevRemainder.current){
      const {board, boardState, path} = algorithms[selectedAlgorithm].executeStep();

      setBoard(board);
      setBoardState(boardState);
      if(boardState === BOARDSTATE.searchComplete){
        fillInPath(path);
        return;
      }
    }
    prevRemainder.current = currentRemainder;
    requestAnimationFrame(executePathFindingStep);
  }

  return (
    <>
      <Banner
        selectAlgorithm={selectAlgorithm}
      >
        <ul className="tools-list">
          {tools.map((t: tool, index) => (
            <ToolButton
              key={index}
              toolDetials={t}
              selected={t.getIndex() === selectedTool.getIndex()}
              setSelectedTool={() => {
                setSelectedTool(t);
              }}
            />
          ))}
        </ul>
        <div className="d-flex align-items-center">
          <button onClick={resetPathSearch}>Reset Search</button>
          <button onClick={() => initPathFinding()}>Find Path</button>
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
