import { parseGame } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";

export default function splitPGN(pgn, splitMoves){
    const splitPGNs = []
    let nextSplit = splitMoves.shift()
    const pgnObject = parseGame(pgn)
    const {White, Black, Event, Date, Result, WhiteElo, BlackElo, TimeControl} = pgnObject.tags
    let chess = new Chess()
    chess.header('Event', Event, 'Date', Date.value, 'White', White,'Black', Black, 'Result', Result, 'WhiteElo', `${WhiteElo}`, 'BlackElo', `${WhiteElo}`, 'TimeControl', TimeControl.value)
    pgnObject.moves.forEach((move, ply) => {
        if(move.moveNumber === nextSplit && move.turn === "w" && ply !== pgnObject.moves.length){
            nextSplit = splitMoves.pop()
            splitPGNs.push(chess.pgn())
            chess = new Chess(chess.fen())
            chess.header('Event', Event, 'Date', Date.value, 'White', White,'Black', Black, 'Result', Result, 'WhiteElo', `${WhiteElo}`, 'BlackElo', `${BlackElo}`, 'TimeControl', TimeControl.value)
        }
        chess.move(move.notation.notation)

    })
    splitPGNs.push(chess.pgn())
    return splitPGNs
}