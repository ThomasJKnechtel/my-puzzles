import { parseGame } from "@mliebelt/pgn-parser";

export default function getPGNViewerObject(pgn){
    const {moves} = parseGame(pgn)

    function setMoveCoordinates(moves, parentCoordinates, variationIndex){
        if(!moves) return
        moves.map((move, index)=>{
            let coordinates = structuredClone(parentCoordinates)
            coordinates.push({'index':index, 'variationIndex':variationIndex})
            move.coordinates = coordinates
            move.variations.map((variation, index) => setMoveCoordinates(variation, coordinates, index))
        })
    }
    function setMovesVariation(moves, variation){
        if(!moves) return
        moves.map((move)=>{
            variation.push(move.notation.notation)
            move.variation = structuredClone(variation)
            let parentVariation =structuredClone(variation)
            parentVariation.pop()
            move.variations.map((moves)=> setMovesVariation(moves, parentVariation ))
        })
    }

    setMoveCoordinates(moves, [], null)
    setMovesVariation(moves, [])
    return moves
}
export function getMove(moves, coordinatesOfMove){
    //at end of variation or in middle
    let variation = moves
    let lastMove = null
    coordinatesOfMove.map(({index, variationIndex})=>{
        if(variationIndex==null){
            lastMove = variation[index]
            
        }else{
            lastMove = lastMove.variations[variationIndex][index]
        }
    })
    return lastMove
}

export function addMove(moves, coordinatesOfLastMove, move){
    /**
     * Cases: 1. Is at end of variation
     * 2. Is in middle of variation and no sub variatins
     * 3. is in middle but subvariations
     * 4. move exists
     */
    //at end of variation or in middle
    let parentVariation = null
    let variation = moves
    let lastMove = null
    coordinatesOfLastMove.map(({index, variationIndex})=>{
        if(variationIndex==null){
            lastMove = variation[index]
            parentVariation = variation
        }else{ 
            parentVariation = lastMove.variations[variationIndex]
            lastMove = lastMove.variations[variationIndex][index]
        }
    })
    const lastCoordinate = lastMove.coordinates[lastMove.coordinates.length-1]
    if(parentVariation.length > lastCoordinate['index']+1){
        const parentMoveIndex = lastCoordinate.index + 1
        const parentMove = parentVariation[parentMoveIndex]
        if(parentMove.notation.notation == move) return parentMove.coordinates
        else{
            let moveCoordinates = parentMove.variations.map((variation, index)=>{
                if(variation[0].notation.notation==move) return variation[0].coordinates
                
            })
            if(moveCoordinates) return moveCoordinates
            const moveVariation = [...lastMove.variation]
            moveVariation.push(move)
            moveCoordinates = structuredClone(parentMove.coordinates)
            moveCoordinates.push({'index': 0, 'variationIndex': parentMove.variations.length})
            parentMove.variations.push({
                        'variation':moveVariation,
                        'coordinates':moveCoordinates,
                        'notation':{notation:move}
                    })
            return moveCoordinates
            
        }
    }else{
        const moveVariation = [...lastMove.variation]
        moveVariation.push(move)
        const moveCoordinates = structuredClone(lastMove.coordinates)
        moveCoordinates[moveCoordinates.length-1].index += 1
        parentVariation.push({'variation':moveVariation,
        'coordinates':moveCoordinates,
        'notation':{notation:move}})
    }
}