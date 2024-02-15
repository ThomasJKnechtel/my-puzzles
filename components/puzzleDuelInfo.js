import Link from "next/link"

export default function PuzzleDuelInfo({ gameState, ready, resign}){

    return (
        <div className=" bg-white flex flex-col items-center gap-2 rounded-md">
          <h1 className=" font-bold text-3xl font-mono green w-full text-center text-white p-2 rounded-t-md">Puzzle Duel</h1> 
          <h1 className=" font-medium text-[20px] opacity-70">{gameState.state.timeControl}</h1>
          <div className=" inline-flex flex-row gap-2">
           
            <div className=" flex items-center flex-col font-medium">
              <h2 >{gameState.playerState.username}</h2>
              <h3 className=" text-xs opacity-50 inline-flex flex-row">{`${gameState.playerState.rating}`}{gameState.state?.state === "FINISHED"&&<span className=" opacity-60 inline-flex flex-row"><h3 className=" ml-1">{gameState.playerState?.ratingChange>=0?"+":"-"}</h3><h3>{Math.abs(gameState.playerState?.ratingChange)}</h3></span>}</h3>
              <h3  className={gameState.playerState.state==="CONNECTED"||gameState.playerState.state==="READY"||gameState.playerState?.state==="WON"||gameState.playerState?.state==="FINISHED"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}>{gameState?.playerState.state}</h3>
              <h3>{gameState.playerState?.puzzlesCompleted}</h3>
              </div>
            <h2 className=" italic">vs</h2>
            <div className=" flex items-center flex-col font-medium">
            <h2>{gameState.opponentState.username}</h2>
            <h3 className=" text-xs opacity-50">{gameState.opponentState.rating}{gameState.state.state === "FINISHED"&&<span className=" opacity-60 inline-flex flex-row"><h3 className=" ml-1">{gameState.opponentState.ratingChange>=0?"+":"-"}</h3><h3>{Math.abs(gameState.opponentState.ratingChange)}</h3></span>}</h3>
            <h3  className={gameState?.opponentState?.state==="CONNECTED"||gameState.opponentState.state==="READY"||gameState.opponentState.state==="WON"||gameState.opponentState.state==="FINISHED"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}> {gameState.opponentState.state}</h3>
            <h3>{gameState.opponentState.puzzlesCompleted}</h3>
            </div>
            
          </div>
          <h2 className=" font-medium opacity-70 mb-5">{`Puzzles: ${gameState.state.numberOfPuzzles}`}</h2>
          {gameState?.state?.state === "WAITING"&&
            <button id="readyButton" type="button" className="button-3 green m-5" onClick={ready}>Ready</button>
          }
          {gameState?.state?.state === "IN_PROGRESS"&&
            <button id="resignButton" type="button" className="button-3 green m-5" onClick={resign}>Resign</button>
          }
          {gameState?.state?.state === "FINISHED"&&
            <Link className=" button-3 green mb-5" href="/lobby">To Lobby</Link>
          }
          
        </div>
    )
}