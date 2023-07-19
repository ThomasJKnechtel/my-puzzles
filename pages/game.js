import Layout from "@/components/layout";
import LegalChess from "@/components/chessboard";
import { parse } from "@mliebelt/pgn-parser";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { Chess } from "chess.js";
function PgnViewer({game}){

    
    function PgnViewObject(){
        const moves = game.moves
        const movePairs = []
        if(moves[0].turn.Black)movePairs.pop([moves.shift()])
        moves.map((move, index)=>{
            
            if (index % 2 === 0)
              movePairs.push(moves.slice(index, index + 2));
          });
        return movePairs
    }
 
   
    return(
        <div className="ml-4 overflow-y-scroll max-h-[480px]">
        <table className='h-3/4 w-64  border-collapse border-2 border-black'>
            
            <thead className="bg-slate-500 sticky"><tr><th className="w-2/12 "></th><th className="w-[5/12] border-r-2 border-black"><label className="p-3">WHITE</label></th><th className="w-[5/12]"><label className="p-3">BLACK</label></th></tr></thead>
            <tbody>
                {
                   PgnViewObject().map((movePair, index)=>{
                    if(movePair.length == 2){
                        return <tr id={movePair[0].moveNumber}><td className= "border-2 bg-slate-500 border-black">{movePair[0].moveNumber}</td><td id={movePair[0].moveNumber+"White"} className="border-r-2 border-b-2 border-black"><button>{movePair[0].notation.notation}</button></td><td id={movePair[1].moveNumber+"Black"} className="border-r-2 border-b-2 border-black"><button>{movePair[1].notation.notation}</button></td></tr>
                    }
                    
                   })
                }
            </tbody>
            

        </table>
        </div>
    )
}
function GameLayout(){
    const searchParams = useSearchParams()
 
  const gamePgn = JSON.parse(decodeURIComponent(searchParams.get('game')))
  const game = new Chess()
  gamePgn.moves.map((move)=>(game.move(move.notation.notation)))
  console.log(game)
    return(
        <div className=" w-full inline-flex justify-center flex-row mt-5 ">
            <LegalChess game={game}></LegalChess>
            <PgnViewer game={gamePgn}></PgnViewer>
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

