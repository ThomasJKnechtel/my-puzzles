import PGNViewer from "@/components/pgnViewer";
import getPGNViewerObject, { addMove, getMove, getNextMove } from "@/utils/PGNViewerObject";
import { parseGame } from "@mliebelt/pgn-parser";
import { useEffect, useState } from "react";

export default function PuzzlePage({pgn=""}){
   
   const [pgnViewerObject, setPgnViewerObject] = useState(null)
   const [currentMove, setCurrentMove] = useState(null)
   useEffect(()=>{
    if(pgn){
         setPgnViewerObject(getPGNViewerObject(pgn))
    }
   
   }, [pgn])
   useEffect(()=>{
     console.log(currentMove)
     console.log(getNextMove(pgnViewerObject, currentMove))
   }, [currentMove])
  
   function onMoveClick(){
    const tempPgnViewerObject = structuredClone(pgnViewerObject)
     const moveCoordinates = addMove(tempPgnViewerObject, [{index: 4, variationIndex: null},{index:2, variationIndex:0},{index:0, variationIndex:0}],{notation: {notation: 'test'}, turn: 'w', variations:[], moveNumber: 1})
     setPgnViewerObject(tempPgnViewerObject)
     setCurrentMove(getMove(tempPgnViewerObject, moveCoordinates))
   }
    return (<><PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer><button onClick={onMoveClick}>Test</button></>)
}