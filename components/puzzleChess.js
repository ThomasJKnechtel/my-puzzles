import dynamic from 'next/dynamic';

import {useEffect, useState } from 'react';
import { Chess } from 'chess.js';


import { addMove, getMove } from '@/utils/PGNViewerObject';
import { addMoveToGameState, playMove } from '@/utils/gameState';



export default function PuzzleChess({ gameState, setGameState,  currentMove, setCurrentMove, pgnViewerObject, setPgnViewerObject}) {
  let game = new Chess()
  const [gameFen, setGameFen] = useState(null)
 
  useEffect(()=>{
    if(currentMove){
      game = new Chess(gameState.startingFEN)
      console.log(game.fen())
      currentMove.variation.map(move=>{
        try{
           game.move(move)
        }catch(err){
          console.log(err)
        }
       
      })
      if(gameFen != game.fen())setGameFen(game.fen())
    }
  }, [currentMove])
  useEffect(()=>{
    if(gameState){
         setGameFen(gameState.fen)
    }
   
  }, [gameState])

//Ignore spaghetti code
  function onDrop({sourceSquare, targetSquare}){
    game = new Chess(gameFen)
    const turn = game.turn()
    const moveNumber = game.moveNumber()
    const MOVE_OBJ = {
      'from': sourceSquare,
      'to':targetSquare,
      'promotion':'q'
    }
   
    try{
     if(turn == gameState.playerTurn && gameState.state == "PLAYERS_TURN"){
        const MOVE = game.move(MOVE_OBJ)
        setGameFen(game.fen())
        const tempPgnViewerObject = structuredClone(pgnViewerObject)
        
        let moveCoordinates = null
        if(currentMove){
            moveCoordinates = addMove(tempPgnViewerObject, currentMove.coordinates, {'turn': turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }}  )
        }else{
            moveCoordinates = addMove(tempPgnViewerObject, null,  {'turn': turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }})
        }
        let newCurrentMove = getMove(tempPgnViewerObject, moveCoordinates)
        
        setPgnViewerObject(tempPgnViewerObject)
        setCurrentMove(newCurrentMove)
        const newGameState = structuredClone(gameState)
        addMoveToGameState(newGameState, MOVE.san, game.fen())
        const nextMove = newGameState.nextMove
        if(nextMove&&newGameState.state=="OPPONENTS_TURN"){
          const [turn, moveNumber] = [game.turn(), game.moveNumber()]
          const MOVE = game.move(newGameState.nextMove)
          moveCoordinates = addMove(tempPgnViewerObject, newCurrentMove.coordinates, {'turn':turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }}  )
          newCurrentMove = getMove(tempPgnViewerObject, moveCoordinates)
          setPgnViewerObject(tempPgnViewerObject)
          setCurrentMove(newCurrentMove)
          playMove(newGameState, game.fen())
        }
        
        setGameState(newGameState)
        
    }
      
      
      
    }catch(err){
      console.log(err)
    }
  }
    const Chessboard = dynamic(() => import('chessboardjsx'), {
        ssr: false  // <- this do the magic ;)
        });

    
    return <Chessboard id="game" position={gameFen} onDrop={onDrop} draggable={true} orientation={(gameState.playerTurn == "w")?'white':'black'}></Chessboard>

}
