import { useMemo, useState } from "react";
import { CELLSTATE } from "../Types/CellState";
import Pos from "../Types/Pos";
import tools, { placeTool, TOOL, tool } from "../Types/Tools";
import Banner from "./Banner/Banner";
import Board from "./Board/Board";
import ToolButton from "./Banner/ToolButton";
import useForceUpdate from "../Hooks/useForceUpdate";
import CellData from "../Types/CellData";
import { BOARDSTATE } from "../Types/BoardState";

// ------ INITIAL GRID DATA -------
export const gridHeight = 40;
export const gridWidth = 70;
function generateBoard() {
  const emptyBoard: CellData[][] = new Array(gridHeight);
  for (let y = 0; y < emptyBoard.length; y++) {
    emptyBoard[y] = new Array(gridWidth);
    for (let x = 0; x < emptyBoard[y].length; x++) {
      emptyBoard[y][x] = new CellData(new Pos({x,y}));
    }
  }
  return emptyBoard;
}

export default function PathFinder() {
  const [boardPosition, setBoardPosition] = useState<Pos>({ x: 0, y: 0 });
  const [board, setBoard] = useState(useMemo(generateBoard, []));
  const [boardState, setBoardState] = useState(BOARDSTATE.drawing);
  const [selectedTool, setSelectedTool] = useState(tools[TOOL.hand]);
  const [startPosition, setStartPosition] = useState<Pos>();
  const [targetPosition, setTargetPosition] = useState<Pos>();
  const [message, setMessage] = useState<string>();
  const forceUpdate = useForceUpdate();

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
    path.slice(0,-1).forEach((position) => {
      const cell = getCellAtPos(position);
      cell.walk();
    })
  }

  const onCellClick = (x: number, y: number): void => {
    if (!(selectedTool instanceof placeTool)) {
      return;
    }
    if (boardState === BOARDSTATE.pathFound){
      resetPathSearch();
    }
    const nextBoard = [...board];
    const { payload } = selectedTool.onMouseDown(new Pos({x, y}));
    if (payload.replacePrev) {
      const { x: prevX, y: prevY } = payload.previousPosition;
      nextBoard[prevY][prevX].state = CELLSTATE.empty;
      if (payload.newState === CELLSTATE.searchStart) {
        setStartPosition(new Pos({ x, y }));
      } else if (payload.newState === CELLSTATE.target) {
        setTargetPosition(new Pos({ x, y }));
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
    const { payload } = selectedTool.onMouseEnter(new Pos({x, y}));
    nextBoard[y][x].state = payload.newState;
    setBoard(nextBoard);
  };

  const getAdjacentPositions = ({ x, y }: Pos) => {
    const adjacentPositions: Pos[] = [];
    if (x > 0) {
      adjacentPositions.push(new Pos({ x: x - 1, y }));
    }
    if (x < gridWidth - 1) {
      adjacentPositions.push(new Pos({ x: x + 1, y }));
    }
    if (y > 0) {
      adjacentPositions.push(new Pos({ x, y: y - 1 }));
    }
    if (y < gridHeight - 1) {
      adjacentPositions.push(new Pos({ x, y: y + 1 }));
    }
    return adjacentPositions;
  };

  const getCellAtPos = ({ x, y }: Pos) => {
    return board[y][x];
  };

  const initPathFinding = () => {
    resetPathSearch();

    if (startPosition === undefined) {
      setMessage("No start position defined");
      return;
    }
    var target:Pos;

    const posQueue = getAdjacentPositions(startPosition);
    const paths:Record<string, Pos[]> = {};
    posQueue.forEach((position) => {
      // console.log(`adding stuff to (${position.toString()})`);
      paths[position.toString()] = [position];
    });

    while (posQueue.length > 0) {
      const currentCell = getCellAtPos(posQueue.shift());
      // console.log(`position of current cell: (${currentCell.position.toString()})`);
      if (!currentCell.isTravelValid()) {
        continue;
      }
      if (currentCell.state === CELLSTATE.target) {
        target = currentCell.position;
        break;
      }
      const adjacentPositions = getAdjacentPositions(currentCell.position);
      adjacentPositions.forEach((position:Pos) => {
        // console.log(`adding position: (${position.toString()}) to (${currentCell.position.toString()})`);

        paths[position.toString()] = paths[currentCell.position.toString()].concat(position);
      });
      currentCell.visit();
      posQueue.push(...adjacentPositions);
    }

    fillInPath(paths[target.toString()]);

    setBoard([...board]);
    setBoardState(BOARDSTATE.pathFound);
    setMessage("found target");
  };

  return (
    <>
      <Banner>
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
