import dynamic from 'next/dynamic';

import {useCallback} from 'react';
import { Chess } from 'chess.js';


const Chessboard = dynamic(() => import('chessboardjsx'), {
        ssr: false  // <- this do the magic ;)
});

export default function LegalChess({fen, addMove, boardSize}) {

  
  const onDrop = useCallback(({sourceSquare, targetSquare})=>{
    const game = new Chess(fen)
    const turn = game.turn()
    const moveNumber = game.moveNumber()
    const MOVE_OBJ = {
      'from': sourceSquare,
      'to':targetSquare,
      'promotion':'q'
    }
   
    try{
      const MOVE = game.move(MOVE_OBJ)
      addMove({turn, moveNumber, notation :{notation:MOVE.san}}, game.fen())
    }catch(err){
      console.log(err)
    }
  }, [addMove, fen])
    

    
    return <Chessboard transitionDuration={100} id="game" position={fen} onDrop={onDrop} draggable width={boardSize}/>

}


