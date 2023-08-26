const { addMoveToGameState, playMove } = require("../../utils/gameState")

addMoveToGameState
test('Updates state on move added', ()=>{
    let gameState = {
        "puzzle_id": 7041,
        "start_time": 10,
        "continuation" : ["e4", "e5", "Nf3"],
        "nextMove" : "e4",
        "state" : "PLAYERS_TURN",
        "fen" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "playerTurn" : "b",
        "startingFEN" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
        "currentMoveNumber" : 0
    }
    addMoveToGameState(gameState, "e4", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1" )
    expect(gameState).toStrictEqual({
        "puzzle_id": 7041,
        "start_time":10,
        "continuation":["e4","e5","Nf3"],
        "nextMove":"e5",
        "state":"OPPONENTS_TURN",
        "fen":"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "playerTurn":"b",
        "startingFEN":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "currentMoveNumber" : 1
    })
})

test('update state on move added and play opponents move', ()=>{
    let gameState = {
        "puzzle_id": 7041,
        "start_time": 10,
        "continuation" : ["e4", "e5", "Nf3"],
        "nextMove" : "e4",
        "state" : "PLAYERS_TURN",
        "fen" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "playerTurn" : "b",
        "startingFEN" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
        "currentMoveNumber" : 0
    }
    addMoveToGameState(gameState, "e4", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1" )
    playMove(gameState, "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2")
    expect(gameState).toStrictEqual({
        "puzzle_id": 7041,
        "start_time":10,
        "continuation":["e4","e5","Nf3"],
        "nextMove":"Nf3",
        "state":"PLAYERS_TURN",
        "fen":"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "playerTurn":"b",
        "startingFEN":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "currentMoveNumber" : 2
    })
})
test("update state with final move", ()=>{
    let gameState = {
        "puzzle_id": 7041,
        "start_time": 10,
        "continuation" : ["e4", "e5", "Nf3"],
        "nextMove" : "e4",
        "state" : "PLAYERS_TURN",
        "fen" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "playerTurn" : "b",
        "startingFEN" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
        "currentMoveNumber" : 0
    }
    addMoveToGameState(gameState, "e4", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1" )
    playMove(gameState, "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2")
    addMoveToGameState(gameState, "Nf3", "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2")
    expect(gameState).toStrictEqual({
        "puzzle_id": 7041,
        "start_time":10,
        "continuation":["e4","e5","Nf3"],
        "nextMove":null,
        "state":"COMPLETED",
        "fen":"rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "playerTurn":"b",
        "startingFEN":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "currentMoveNumber" : 3
    })
})
test("test wrong move", ()=>{
    let gameState = {
        "puzzle_id": 7041,
        "start_time": 10,
        "continuation" : ["e4", "e5", "Nf3"],
        "nextMove" : "e4",
        "state" : "PLAYERS_TURN",
        "fen" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "playerTurn" : "b",
        "startingFEN" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
        "currentMoveNumber" : 0
    }
    addMoveToGameState(gameState, "d4", "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1" )
    expect(gameState).toStrictEqual({
        "puzzle_id": 7041,
        "start_time":10,
        "continuation":["e4","e5","Nf3"],
        "nextMove":"e4",
        "state":"FAILED",
        "fen":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "playerTurn":"b",
        "startingFEN":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "currentMoveNumber" : 0
    })
})