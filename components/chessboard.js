import { Chess } from "chess.js";
import "@chrisoakman/chessboardjs/"
export function ChessBoardContainer({fen, moves, name, className, onlyLegal}){
    const game = new Chess(fen)
    function getMoves(){
        
    }
    const board = Chessboard(name, fen)

}