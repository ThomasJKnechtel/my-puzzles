import Layout from "@/components/layout";


import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'


import { Chess } from "chess.js";
import PgnViewer from "@/components/pgn-viewer";
import LegalChess from "@/components/chessboard";
import { parseGame } from "@mliebelt/pgn-parser";
import Timer from "@/components/timer";
import ChessClock from "@/components/chessclock";
function GameLayout(){
    const searchParams = useSearchParams()
 
  //const gamePgn = JSON.parse(decodeURIComponent(searchParams.get('pgn')))
  const gamePgn = '1. e4 c5 (1... e5 2. Nf3 (2. Nc3)) 2. Nf3'
  const [currentVariaton, setCurrentVariation] = useState({moves:[], startingMove:0, firstMove: '', depth:0, parentVariations:[]})
  const [gamePgnObject, setGamePgnObject] = useState(parseGame(gamePgn))
 
  function onMoveClick(event){
    const moveComponent = event.target
    setCurrentVariation(
        {   
            moves:JSON.parse(moveComponent.getAttribute('variation')), 
            startingMove: moveComponent.getAttribute('variationStart'), 
            firstMove: moveComponent.getAttribute('variationFirstMove'),
            depth: moveComponent.getAttribute('depth'),
            parentVariations: JSON.parse(moveComponent.getAttribute('parentVariations')),
            coordinates: JSON.parse(moveComponent.getAttribute('coordinates'))
         })

  }
    return(
        <div className=" w-full inline-flex justify-center flex-row mt-5 "> 
            <ChessClock isLeftTurn={true} pause={true} />
            {/* <LegalChess variation={currentVariaton} gamePgnObject = {gamePgnObject} setGamePgnObject = {setGamePgnObject} setCurrentVariation={setCurrentVariation}></LegalChess>
            <PgnViewer pgnObject={gamePgnObject} onMoveClick={onMoveClick}></PgnViewer> */}
        </div>
    )
}

export default function Game(){
    
    return(
        <Layout>
           
            <GameLayout ></GameLayout>
            
        </Layout>
        
    )
    
}

