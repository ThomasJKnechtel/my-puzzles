const {  parseGame } = require("@mliebelt/pgn-parser");
const { Chess } = require("chess.js");
const { useState, useEffect } = require("react");

function Variation({moves, currentVariation, depth}){
    
    
    function removeLastMove(){
        const copy = [...currentVariation]
        copy.pop()
        return copy
    }
    function updateVariation(move, isNewVariation){
        
        currentVariation.push(move.notation.notation)
        return [...currentVariation]
    }
    function depthClass(){
        const FONT_COLOR = 950-depth*200
        if(depth!==0) return " text-sm text-gray-500 font-[400]"
    }
    return (
        moves.map((move, index)=>{
            
            return (
                <>
                <div key={move.turn+move.notation.notation+"div"} className={depthClass()+" inline-block font-[400] focus-within:bg-blue-200 hover:font-medium"}>
                {move.moveNumber&&<label key={move.moveNumber}>{move.moveNumber+"."}</label>}
                <button key={move.turn+move.notation.notation} variation = {updateVariation(move)} className={"mr-1"}>{move.notation.notation}</button>
                </div>
                {move.variations.length!==0&&
                    
                    move.variations.map(variation=>{
                    return <><br></br><label className="mr-1">(</label><Variation moves={variation} currentVariation={removeLastMove()} depth={depth+1}></Variation><label className="mr-1">)</label></>
                    })
                }
                </>
                )
        })
    )
}
    
export default function PgnViewer({pgn}){
   
    const PGN_OBJECT = parseGame(pgn)

    return ( <div className="w-48 h-64 bg-white p-2 shadow-md border-solid"><div className="h-1/6 w-full bg-slate-400"></div><div className="w-full h-5/6 bg-amber-50"><Variation moves={PGN_OBJECT.moves} currentVariation={[]} depth={0}></Variation></div></div>)
}