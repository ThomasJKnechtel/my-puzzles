import Layout from "@/components/layout";


import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'


import { Chess } from "chess.js";
import PgnViewer from "@/components/pgn-viewer";
import LegalChess from "@/components/chessboard";
import { parseGame } from "@mliebelt/pgn-parser";
import Timer from "@/components/timer";
import getTimeInMillis from "@/utils/getTimeMillis";
import ChessClock from "@/components/chessclock";
import Link from "next/link";
function GameLayout(){
    const searchParams = useSearchParams()
 
  const gamePgn = JSON.parse(decodeURIComponent(searchParams.get('pgn')))
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
            <ChessClock isLeftTurn={true} pause={true} timeLeft={getTimeInMillis(gamePgnObject.tags.TimeControl[0])} timeRight={getTimeInMillis(gamePgnObject.tags.TimeControl[0])}/>
            <div>
            
                <span className=" inline-flex justify-between w-full font-medium"><label>{gamePgnObject.tags.White}</label><label>{gamePgnObject.tags.WhiteElo}</label></span>
                <LegalChess variation={currentVariaton} gamePgnObject = {gamePgnObject} setGamePgnObject = {setGamePgnObject} setCurrentVariation={setCurrentVariation}></LegalChess>
                <span className=" inline-flex justify-between w-full font-medium"><label>{gamePgnObject.tags.Black}</label><label>{gamePgnObject.tags.BlackElo}</label></span>
            </div>
            <div className="m-4">
                <PgnViewer pgnObject={gamePgnObject} onMoveClick={onMoveClick}></PgnViewer>
                <Link href="/"><button className="button-3 green mt-4">Back to Search</button></Link>
            </div>
            
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

