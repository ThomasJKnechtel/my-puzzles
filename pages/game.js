import Layout from "@/components/layout";


import { useEffect, useState } from "react";


import LegalChess from "@/components/chessboard";

import Link from "next/link";
import getPGNViewerObject, { addMove } from "@/utils/PGNViewerObject";
import PGNViewer from "@/components/pgnViewer";
import GameDataDisplay from "@/components/displayGameData";
function GameLayout(){
   


  const [pgnViewerObject, setPgnViewerObject] = useState(null)
  const [currentMove, setCurrentMove] = useState(null)
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  const [gamePgn, setGamePgn] = useState(null)
 
    
  useEffect(()=>{
    const searchParams = new URLSearchParams(location.search)
    setGamePgn(JSON.parse(decodeURIComponent(searchParams.get('pgn'))))
    setPgnViewerObject(getPGNViewerObject(JSON.parse(decodeURIComponent(searchParams.get('pgn')))))
}, [])
useEffect(()=>{
    console.log(pgnViewerObject)
}, [pgnViewerObject])
useEffect(()=>{
    console.log(currentMove)
}, [currentMove])
useEffect(()=>{
    console.log(fen)
}, [fen])
useEffect(()=>{
    console.log(gamePgn)
}, [gamePgn])
    return(
        <div className=" w-full inline-flex justify-center flex-row mt-5 "> 
            
            <div>
                <LegalChess fen={fen} setFen={setFen} currentMove={currentMove} setCurrentMove={setCurrentMove} pgnViewerObject={pgnViewerObject} setPgnViewerObject={setPgnViewerObject}></LegalChess>              
            </div>
            <div className="ml-1">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer>
            </div>
            <div className=" ml-2">
                <GameDataDisplay pgn={gamePgn}></GameDataDisplay>
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

