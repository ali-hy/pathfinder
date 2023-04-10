import BoardData from "../Types/BoardData";

export default function copyBoard(board:BoardData){
  const newBoard = new BoardData();
  newBoard.width = board.width;
  newBoard.height = board.height;
  newBoard.grid = board.grid;
  newBoard.state = board.state;
  return newBoard;
}