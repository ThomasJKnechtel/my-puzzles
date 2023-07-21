const {  parseGame } = require("@mliebelt/pgn-parser");
const { Chess } = require("chess.js");
const { useState, useEffect } = require("react");
/**
 * Generates a component for a tree of subvariations 
 * @param {parseGame.move object} move 
 */
function SubVariation(move, isVariation, pgn){
    
    if(isVariation){
         return (
         <><label className="ml-1  text-gray-600">{move.moveNumber}.</label><label variation = {getPgn(move, game)} className=" text-gray-600 hover:text-gray-800 hover:font-semibold">{move.notation.notation}</label>
         {move.variations.length !== 0&&(
            <>
            <label className=" text-gray-600 m-1">(</label>
            {move.variations.map(variation=>{
                return variation.map((move)=>{
                    return SubVariation(move, true, variationObj)
                })
            })}
            <label className=" text-gray-600 m-1">)</label>
            </>
        )}</>
        )
    
    }else{
        game.history.pop()
        return <>{move.variations.length !== 0&&(
            <>
            <label className=" text-gray-600 m-1">(</label>
            {move.variations.map(variation=>{
                return variation.map((move)=>{
                    return SubVariation(move, true, variationObj)
                })
            })}
            <label className="m-1 text-gray-600">)</label>
            </>)
        }</>
    }
   
}
function pgnViewObject(pgnObject){
    console.log(pgnObject)
    const moves = pgnObject.moves
    const movePairs = []
    //if Blacks turn then add to own pair
    if(moves[0].turn.Black)movePairs.pop([moves.shift()])
    //add set of pairs to movePairs
    moves.map((move, index)=>{
        
        if (index % 2 === 0)
          movePairs.push(moves.slice(index, index + 2));
      });
    return movePairs
}
function getPgn(move, variation){
   variation.move(move.notation.notation)
   return variation.pgn()
    
}


    
export default function PgnViewer({pgn}){
   
    const [pgnObject, setPgnObject] = useState(parseGame(pgn))
    const MAIN_VARIATION = new Chess()
    
    return ( 
    <div className="ml-4 overflow-y-scroll max-h-[480px]">
    <table className='h-3/4 w-64  border-collapse border-2 border-black'>
        
        <thead className="bg-slate-500 sticky"><tr><th className="w-2/12 "></th><th className="w-[5/12] border-r-2 border-black"><label className="p-3">WHITE</label></th><th className="w-[5/12]"><label className="p-3">BLACK</label></th></tr></thead>
        <tbody>
            {   
                pgnViewObject(pgnObject).map((movePair)=>{
                if(movePair.length == 2){
                
                    return (<>

                   <tr id={movePair[0].moveNumber}>
                    <td className= "border-2 bg-slate-500 border-black ">{movePair[0].moveNumber}</td>
                    <td id={movePair[0].moveNumber+"White"} className="border-r-2 border-b-2 border-black hover:font-medium focus:bg-blue-200">
                        <button variation={getPgn(movePair[0], MAIN_VARIATION)}>{movePair[0].notation.notation}</button>
                    </td>
                    <td id={movePair[1].moveNumber+"Black"} className="border-r-2 border-b-2 border-black hover:font-medium focus-within:bg-blue-200">
                        <button variation={getPgn(movePair[1], MAIN_VARIATION)}>{movePair[1].notation.notation}</button>
                    </td>
                    </tr>
                   {movePair[0].variations.length!==0&&<tr><td className= "border-2 bg-slate-200 border-black" colSpan="3">{SubVariation(movePair[0], false, MAIN_VARIATION)}</td></tr>}
                   {movePair[1].variations.length!==0&&<tr><td className= "border-2 bg-slate-200 border-black" colSpan="3">{SubVariation(movePair[1], false,  MAIN_VARIATION)}</td></tr>}
                    </>)
                }else if(movePair[0].turn==="w"){
                    return <tr id={movePair[0].moveNumber}><td className= "border-2 bg-slate-500 border-black ">{movePair[0].moveNumber}</td><td id={movePair[0].moveNumber+"White"} className="border-r-2 border-b-2 border-black hover:font-medium focus-within:bg-blue-200"><button>{movePair[0].notation.notation}</button></td><td></td></tr>
                }else{
                    return <tr id={movePair[0].moveNumber}><td className= "border-2 bg-slate-500 border-black">{movePair[0].moveNumber}</td><td></td><td id={movePair[0].moveNumber+"Black"} className="border-r-2 border-b-2 border-black hover:font-medium focus-within:bg-blue-200"><button>{movePair[0].notation.notation}</button></td></tr>
                }
                
               })
            
               
               
            }
        </tbody>
        

    </table>
    </div>
    )
}