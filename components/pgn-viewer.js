const {  parseGame } = require("@mliebelt/pgn-parser");
const { Chess } = require("chess.js");
const { useState, useEffect } = require("react");

export default function PgnViewer({pgn}){
   
    const [pgnObject, setPgnObject] = useState(parseGame(pgn))
    const game = new Chess()
    game.loadPgn(pgn)
    
    //update pgnObject when pgn changes
    useEffect(()=>{
        setPgnObject(parseGame(pgn))
    }, [pgn])
    //format the object into move-pairs
    function PgnViewObject(pgnObject){
        const moves = pgnObject.moves
        const movePairs = []
        if(moves[0].turn.Black)movePairs.pop([moves.shift()])
        moves.map((move, index)=>{
            
            if (index % 2 === 0)
              movePairs.push(moves.slice(index, index + 2));
          });
        return movePairs
    }
    return ( 
    <div className="ml-4 overflow-y-scroll max-h-[480px]">
    <table className='h-3/4 w-64  border-collapse border-2 border-black'>
        
        <thead className="bg-slate-500 sticky"><tr><th className="w-2/12 "></th><th className="w-[5/12] border-r-2 border-black"><label className="p-3">WHITE</label></th><th className="w-[5/12]"><label className="p-3">BLACK</label></th></tr></thead>
        <tbody>
            {
               PgnViewObject(pgnObject).map((movePair)=>{
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