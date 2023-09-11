import dynamic from 'next/dynamic';

import {useEffect, useState } from 'react';
import { Chess } from 'chess.js';


import { addMove, getMove } from '@/utils/PGNViewerObject';
import { addMoveToGameState, playMove } from '@/utils/gameState';



export default function PuzzleChess({fen, gameState, addMove, playersTurn, }) {


  function onDrop({sourceSquare, targetSquare}){
   try{
    const game = new Chess(fen)
      const turn = game.turn()
      const moveNumber = game.moveNumber()
      const MOVE_OBJ = {
        'from': sourceSquare,
        'to':targetSquare,
        'promotion':'q'
      }
      if(gameState == "PLAYERS_TURN"){
        const MOVE = game.move(MOVE_OBJ)
        addMove({'turn':turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }}, game.fen())
      }
   }catch(err){
    console.log(err)
   }
      
  }
  const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
  });

    
    return <Chessboard id="game" position={fen} onDrop={onDrop} draggable={true} orientation={playersTurn=='w'?'white':'black'}></Chessboard>

}
