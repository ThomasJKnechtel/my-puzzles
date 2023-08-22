import getPGNViewerObject, { addMove, getMove } from "@/utils/PGNViewerObject";
import { useEffect } from "react";


export default function PGNViewer({}){
//Notes: Must display all moves and variations, must add move to any variation, must display current move, on move click must return the variation of the move 
    
    useEffect(()=>{
        const pgn = "1. e4 e5 2. Nf3 Nc6 (2... Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 (5. Nc3) (5. d3)) 3. Bb5"
        const pgnViewerObject = getPGNViewerObject(pgn)
       
        console.log(getMove(pgnViewerObject, [{index: 3, variationIndex: null}, {index:5, variationIndex: 0}, {index:0, variationIndex:1}]))
        console.log(addMove(pgnViewerObject,  [{index: 4, variationIndex: null}], 'test'))
        console.log(pgnViewerObject)
    }, [])
    
    return (<div></div>)
}
