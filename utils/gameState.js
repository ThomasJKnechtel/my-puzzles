export function addMoveToGameState(gameState, move, fen){
    if(gameState.state == "PLAYERS_TURN"){
        if(gameState.nextMove == move){
            gameState.currentMoveNumber += 1 
            gameState.fen = fen
            if(gameState.currentMoveNumber < gameState.continuation.length ){
               gameState.nextMove = gameState.continuation[gameState.currentMoveNumber]
               gameState.state = "OPPONENTS_TURN"
            }else{
                gameState.nextMove = null
                gameState.state = "COMPLETED"
            }
        }else{
            gameState.state = "FAILED"
        }
    }
}
export function playMove(gameState, fen){
    console.log(gameState.state)
    if(gameState.state == "OPPONENTS_TURN"){
        
        gameState.currentMoveNumber += 1 
        gameState.fen = fen
        if(gameState.currentMoveNumber < gameState.continuation.length ){
            gameState.nextMove = gameState.continuation[gameState.currentMoveNumber]
            gameState.state = "PLAYERS_TURN"
        }else{
            gameState.state = "COMPLETED"
            gameState.nextMove = null
        }
    }
}