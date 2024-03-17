import { parseGame } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";

export default function splitPGN(pgn, splitMoves){
    const splitPGNs = []
    const pgnObject = parseGame(pgn)
    const {White, Black, Event, Date, Result, WhiteElo, BlackElo, TimeControl} = pgnObject.tags
    let chess = new Chess()
    chess.header('Event', Event, 'Date', Date.value, 'White', White,'Black', Black, 'Result', Result, 'WhiteElo', WhiteElo, 'BlackElo', BlackElo, 'TimeControl', TimeControl.value)
    pgnObject.moves.forEach((move, ply) => {
        if(move.moveNumber === 15 && move.turn === "w" && ply !== moves.length){
            splitPGNs.push(chess.pgn())
            chess = new Chess(chess.fen())
            chess.header('Event', Event, 'Date', Date.value, 'White', White,'Black', Black, 'Result', Result, 'WhiteElo', WhiteElo, 'BlackElo', BlackElo, 'TimeControl', TimeControl.value)
        }
        chess.move(move.notation.notation)

    })
    splitPGNs.push(chess.pgn())
    return splitPGNs
}