import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';

import { checkIfMoveExists, getNextMove } from './pgn_utilities';



export default function PuzzleChess({variation, gamePgnObject, setGamePgnObject, setCurrentVariation, currentPosition, setCurrentMove}) {
  const game = new Chess(currentPosition)
  
  if(variation.moves.length!=0||variation.parentVariations.length!=0){
    game.reset()
    console.log(variation)
    variation.parentVariations.map(variation=>{
  
      variation.map((move, index)=>{
        if(index!=variation.length-1){
           game.move(move)
        }
       
      })
    })
    variation.moves.map(move=>{
        game.move(move)
    })
  }

//Ignore spaghetti code
  function onDrop({sourceSquare, targetSquare}){
    const MOVE_OBJECT = {
      turn : game.turn(),
      moveNumber : game.moveNumber(),
      notation: {from: sourceSquare, to: targetSquare, notation: ''},
      variations: [],
    }
    try{
      if(game.fen == currentPosition){
        game.move({from: sourceSquare, to: targetSquare, promotion: 'q'})
        MOVE_OBJECT.notation.notation = game.history().pop()
        const [NEXT_MOVE, moves] = getNextMove(gamePgnObject, variation.coordinates, 1)
        
        if(!NEXT_MOVE){ //if last move in variation
            variation.moves.push(MOVE_OBJECT.notation.notation)
            variation.coordinates[variation.coordinates.length-1][0] += 1
            moves.push(
            MOVE_OBJECT
            )
        }else if(checkIfMoveExists(NEXT_MOVE, MOVE_OBJECT.notation.notation)){
            console.log("move exists")
        }else{
            NEXT_MOVE.variations.push([MOVE_OBJECT])
            variation.moves.push(NEXT_MOVE.notation.notation)
            variation.parentVariations.push(variation.moves)
            variation.moves = [MOVE_OBJECT.notation.notation]
            variation.depth += 1
            variation.coordinates[variation.coordinates.length-1][0] += 1
            variation.coordinates[variation.coordinates.length-1].push(NEXT_MOVE.variations.length-1)
            variation.coordinates.push([0])
        }
      
      setGamePgnObject(structuredClone(gamePgnObject))
      setCurrentVariation(structuredClone(variation))
      }
      
      
      }
      
    catch(error){
      console.error(error)
    }
  }
    const Chessboard = dynamic(() => import('chessboardjsx'), {
        ssr: false  // <- this do the magic ;)
        });

    
    return <Chessboard id="game" position={game.fen()} onDrop={onDrop} draggable={true}></Chessboard>

}

