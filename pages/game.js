import Layout from "@/components/layout";
import LegalChess from "@/components/chessboard";
import { parse } from "@mliebelt/pgn-parser";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { Chess } from "chess.js";
import PgnViewer from "@/components/pgn-viewer";
function GameLayout(){
    const searchParams = useSearchParams()
 
  const gamePgn = JSON.parse(decodeURIComponent(searchParams.get('pgn')))
  
    return(
        <div className=" w-full inline-flex justify-center flex-row mt-5 ">
            <PgnViewer pgn={gamePgn}></PgnViewer>
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

