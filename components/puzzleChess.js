import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';
import { useCallback } from 'react';

  const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
  });

export default function PuzzleChess({fen, gameState, addMove, playersTurn, }) {

  const onDrop = useCallback(({sourceSquare, targetSquare})=>{
    try{
      const game = new Chess(fen)
        const turn = game.turn()
        const moveNumber = game.moveNumber()
        const MOVE_OBJ = {
          'from': sourceSquare,
          'to':targetSquare,
          'promotion':'q'
        }
        if(gameState === "PLAYERS_TURN"){
          const MOVE = game.move(MOVE_OBJ)
          addMove({'turn':turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }}, game.fen())
        }
     }catch(err){
      console.log(err)
     }
  }, [fen,addMove,gameState])
    return <Chessboard id="game" position={fen} onDrop={onDrop} draggable orientation={playersTurn==='w'?'white':'black'}/>

}
