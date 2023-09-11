import dynamic from 'next/dynamic';

import {useEffect, useState } from 'react';
import { Chess } from 'chess.js';


import { addMove, getMove } from '@/utils/PGNViewerObject';



export default function LegalChess({fen='', currentMove, setCurrentMove, pgnViewerObject, setPgnViewerObject}) {
  const [gameFen, setGameFen] = useState(fen)
 
  useEffect(()=>{
    if(currentMove){
      const game = new Chess(fen)
      currentMove.variation.map(move=>{
        try{
           game.move(move)
        }catch(err){
          console.log(err)
        }
       
      })
      setGameFen(game.fen())
    }
  }, [currentMove, fen])

  function onDrop({sourceSquare, targetSquare}){
    const game = new Chess(gameFen)
    const turn = game.turn()
    const moveNumber = game.moveNumber()
    const MOVE_OBJ = {
      'from': sourceSquare,
      'to':targetSquare,
      'promotion':'q'
    }
   
    try{
      const MOVE = game.move(MOVE_OBJ)
      const tempPgnViewerObject = pgnViewerObject
      
      let moveCoordinates = null
      if(currentMove){
        moveCoordinates = addMove(tempPgnViewerObject, currentMove.coordinates, {'turn': turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }}  )
      }else{
        moveCoordinates = addMove(tempPgnViewerObject, null,  {'turn': turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }})
      }
      const newCurrentMove = getMove(tempPgnViewerObject, moveCoordinates)
      newCurrentMove.variation.map(move=>{
        try{
           game.move(move)
        }catch(err){
          console.log(err)
        }
       
      })
      setGameFen(game.fen())
      setPgnViewerObject(tempPgnViewerObject)
      setCurrentMove(newCurrentMove)
      
      
    }catch(err){
      console.log(err)
    }
  }
    const Chessboard = dynamic(() => import('chessboardjsx'), {
        ssr: false  // <- this do the magic ;)
        });

    
    return <Chessboard id="game" position={gameFen} onDrop={onDrop} draggable={true}></Chessboard>

}


