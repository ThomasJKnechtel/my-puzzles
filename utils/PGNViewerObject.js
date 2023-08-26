import { parseGame } from "@mliebelt/pgn-parser";

export default function getPGNViewerObject(pgn){
    let moves = []
    if(pgn){
        moves = parseGame(pgn).moves
    }

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
    if(moves.length==0){
        moves.push({
            'moveNumber':move.moveNumber,
            'turn':move.turn,
            'notation':{ notation : move.notation.notation},
            'coordinates':[{ index:0, variationIndex: null }],
            'variations':[],
            'variation':[move.notation.notation]
        })
        return [{ index:0, variationIndex: null }]
    }
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
        if(parentMove.notation.notation == move.notation.notation) return parentMove.coordinates
        else{
            let moveCoordinates = null
             parentMove.variations.map((variation, index)=>{
                if(variation[0].notation.notation==move.notation.notation) moveCoordinates = variation[0].coordinates
            })
            if(moveCoordinates) return moveCoordinates
            const moveVariation = [...lastMove.variation]
            moveVariation.push(move.notation.notation)
            moveCoordinates = structuredClone(parentMove.coordinates)
            moveCoordinates.push({'index': 0, 'variationIndex': parentMove.variations.length})
            parentMove.variations.push([{
                        'variation':moveVariation,
                        'coordinates':moveCoordinates,
                        'notation':{notation:move.notation.notation},
                        'turn': move.turn,
                        moveNumber: move.moveNumber,
                        variations: []
                    }])
            return moveCoordinates
            
        }
    }else{
        const moveVariation = [...lastMove.variation]
        moveVariation.push(move.notation.notation)
        const moveCoordinates = structuredClone(lastMove.coordinates)
        moveCoordinates[moveCoordinates.length-1].index += 1
        parentVariation.push({'variation':moveVariation,
        'coordinates':moveCoordinates,
        'notation':{notation:move.notation.notation},
        'turn':move.turn,
        moveNumber: move.moveNumber,
        variations: []
    })
        return moveCoordinates
    }
    
}
export function getNextMove(pgnViewerObject, currentMove){
    let parentVariation = pgnViewerObject
    if(currentMove){
        let currentCoordinates = structuredClone(currentMove.coordinates)
        let lastCoordinate = currentCoordinates.pop()
        let lastMove 
        currentCoordinates.map(({index, variationIndex}) => {
            if(variationIndex==null){
                lastMove = parentVariation[index]
            }else{ 
                parentVariation = lastMove.variations[variationIndex]
                lastMove = lastMove.variations[variationIndex][index]
            }
        })
        if(lastCoordinate&&lastMove){
            parentVariation = lastMove.variations[lastCoordinate.variationIndex]
        }
        if(parentVariation.length > lastCoordinate.index+1){
            return parentVariation[lastCoordinate.index+1]
        }
    }
}
export function getLastMove(pgnViewerObject, currentMove){
    let parentVariation = pgnViewerObject
    if(currentMove){
        let currentCoordinates = structuredClone(currentMove.coordinates)
        let lastCoordinate = currentCoordinates.pop()
        let lastMove 
        currentCoordinates.map(({index, variationIndex}) => {
            if(variationIndex==null){
                lastMove = parentVariation[index]
            }else{ 
                parentVariation = lastMove.variations[variationIndex]
                lastMove = lastMove.variations[variationIndex][index]
            }
        })
        if(lastCoordinate&&lastMove){
            parentVariation = lastMove.variations[lastCoordinate.variationIndex]
        }
        if(lastCoordinate.index!=0){
            return parentVariation[lastCoordinate.index-1]
        }
    }
}