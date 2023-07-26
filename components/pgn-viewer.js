const {  parseGame } = require("@mliebelt/pgn-parser");
const { Chess } = require("chess.js");
const { useState, useEffect } = require("react");

function Variation({moves, depth, parentVariations, onMoveClick, coordinates}){
    
    let firstMove = ''
    let firstMoveNumber = 0
    const currentVariation = []
    function removeLastMove(){
        const copy = [...currentVariation]
        copy.pop()
        return copy
    }
    function updateVariation(move){
        
        currentVariation.push(move.notation.notation)
        return currentVariation
    }
    function updateParentVariations(){
        const newParentVariations = [...parentVariations]
        newParentVariations.push([...currentVariation])
        return [...newParentVariations]
    }
    function updateCoordinates(coordinate){
        const copyCoordinates = [...coordinates]
        copyCoordinates.push(coordinate)
        return copyCoordinates
    }
    return (
        moves.map((move, moveIndex)=>{
            
            if(moveIndex===0){
                firstMove=move.notation.notation
                firstMoveNumber=move.moveNumber
            }
            return (
                <>
                <div key={move.notation.notation+"div"} className=" inline-block font-[400] focus-within:bg-blue-200 hover:font-medium">
                {move.moveNumber&&<label key={move.moveNumber}>{move.moveNumber+"."}</label>}
                <button key={move.notation.notation} variation = {JSON.stringify(updateVariation(move))} moveNumber ={firstMoveNumber+moveIndex} variationStart = {firstMoveNumber} variationFirstMove = {firstMove} onClick={onMoveClick} className={"mr-1"} depth={depth} parentVariations={JSON.stringify(parentVariations)} coordinates={JSON.stringify(updateCoordinates([moveIndex]))}>{move.notation.notation}</button>
                </div>
                {move.variations.length!==0&&
                    
                    move.variations.map((variation, index)=>{
                        return <><br></br><label className="mr-1">(</label><Variation moves={variation} currentVariation={removeLastMove()} depth={depth+1} onMoveClick={onMoveClick} parentVariations={updateParentVariations()} coordinates={updateCoordinates([moveIndex, index])}></Variation><label className="mr-1">)</label></>
                    })
                }
                </>
                )
        })
    )
}
    
export default function PgnViewer({pgnObject, onMoveClick}){
   
    

    return ( <div className="w-48 h-64 shadow-md border-solid  overflow-auto bg-white"><div className="h-1/6 w-full bg-slate-400"></div><div className="w-full h-5/6"><Variation moves={pgnObject.moves} currentVariation={[]} depth={0} parentVariations={[]} onMoveClick={onMoveClick} coordinates={[]}></Variation></div></div>)
}