import { Chess} from "chess.js";



export default function playPuzzle({fen, continuation, movesLeft, playerColour, progress}, move){
    const game = new Chess(fen)
    function play(move){
        if(addMove(move)){
            fen = game.fen()
            const opponentMove = getNextMove()
            if(opponentMove){
                try{ 
                    game.move(opponentMove)
                    movesLeft.shift()
                    fen = game.fen()
                }catch(err){
                    console.error(err)
                }
            }
        }
    }
    /**
     * make move
     * @param {Chess.move} move move that player played
     * @returns true if move can be played false otherwise
     */
    function addMove(move){
        try{

            if(game.turn() == playerColour?("w"):("b")){
                 const moveMade = game.move(move)
                 if(__isMoveCorrect(moveMade.san)){
                    movesLeft.shift()
                    if(movesLeft.length==0){
                        progress = "COMPLETED"
                    }
                 }else{
                    progress = "FAILED"
                 }
                 return true
            }
            return false

        }catch(err){
            console.log(err)
            return false
        }
    }
    function getNextMove(){
        if(movesLeft.length>0){
            return movesLeft[0]
        }else{
            return null
        }
    }
    function __isMoveCorrect(move){
        const nextMove = getNextMove()
        if(nextMove){
            return nextMove == move
        }
        return false
    }
    play(move)
    return {'fen': fen, 'continuation':continuation, 'movesLeft':movesLeft, 'progress': progress, 'playerColour': playerColour}
   
}