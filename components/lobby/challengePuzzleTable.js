import { useEffect } from "react"

export default function ChallengePuzzleTable({challenges, username, selectedPuzzles,  socket, token}){
    function acceptChallenge(challenge){
        const {challenger, challengerPuzzleIds, timeControl} = challenge
        if(socket && challengerPuzzleIds.length === selectedPuzzles.length){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle["Puzzle ID"])
            socket.emit('challengeAccepted', {token: token, challenge: {...challenge, challenger, challengerPuzzleIds, timeControl, opponentPuzzles:puzzleIds}})
            
        }
    }
    return (
        <div className=" flex flex-col items-center bg-white border-2 h-full w-full gap-10 p-2">
            <h1 className=" font-bold text-xl">Incoming Challenges</h1>
            <table className=" w-full">
                <thead className=" border-2"><tr><th>Time Control</th><th>Player</th><th>Number of Puzzles</th><th> </th></tr></thead>
                <tbody>
                    {   
                        challenges.map(challenge =>{
                           const { challenger, challengerPuzzleIds, challengerId, timeControl}=JSON.parse(challenge)
                           if(username === challenger){
                                return <tr className=" bg-blue-200"><td>{timeControl}</td><td>{challenger}</td><td>{challengerPuzzleIds.length}</td><td></td></tr>
                           }
                           return <tr><td>{timeControl}</td><td>{challenger}</td><td>{challengerPuzzleIds.length}</td><td><button className=" underline text-blue-400" onClick={()=>{acceptChallenge(JSON.parse(challenge))}} >Accept</button></td></tr>
                        } )
                    }
                </tbody>
            </table>
        </div>
    )
}