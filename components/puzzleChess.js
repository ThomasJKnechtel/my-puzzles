import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';
import { useCallback } from 'react';
import useCookies from './hooks/useCookies';


  const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
  });

export default function PuzzleChess({fen, gameState, addMove, playersTurn, boardSize=600 }) {
  const cookies = useCookies()
 
  const [lightColour, darkColour] = cookies.boardStyle? cookies.boardStyle.split(','):['#eedc97', '#964d22']
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
    return <Chessboard darkSquareStyle={{backgroundColor:darkColour}} lightSquareStyle={{backgroundColor:lightColour}} showNotation={cookies.showNotation} width={boardSize} id="game" position={fen} onDrop={onDrop} draggable orientation={playersTurn==='w'?'white':'black'}/>

}
