export function getMoveFromPgn(pgnObject, coordinates){
    let moves = pgnObject.moves
    let move = {}
    coordinates.map((coordinate)=>{
        if(coordinate.length==1){ 
            move = moves[coordinate[0]] //this is the current move
          }else{
            moves = moves[coordinate[0]].variations[coordinate[1]]
          }
    })
    return move
  }

  export function checkIfMoveExists(pgnMove, moveStr){
   
    if(pgnMove.notation.notation === moveStr) return true
    return !pgnMove.variations.every((variation=>{
        return variation[0].notation.notation !== moveStr
    }))
  }
  export function getNextMove(pgnObject, coordinates, index){
    let moves = pgnObject.moves
    let move = {}
    coordinates.map((coordinate)=>{
        if(coordinate.length==1){ 
            if(moves.length <= coordinate[0]+index) move = false
            else move = moves[coordinate[0]+1] //this is the current move
          }else{
            moves = moves[coordinate[0]].variations[coordinate[1]]
          }
    })
    return [move, moves]

  }