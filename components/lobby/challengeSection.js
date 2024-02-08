import { useState } from "react"

export default function ChallengeSection({selectedPuzzles, challenges, username, socket, token}){

   const [focusChallengeForm, setFocusChallengeForm] = useState(true)
   function acceptChallenge(challenge){
        const {challenger, challengerPuzzleIds, timeControl} = challenge
        if(socket && challengerPuzzleIds.length === selectedPuzzles.length){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle["Puzzle ID"])
            socket.emit('challengeAccepted', {token: token, challenge: {...challenge, challenger, challengerPuzzleIds, timeControl, opponentPuzzles:puzzleIds}})
            
        }
    } 
    function createChallenge(){
        if(socket){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle["Puzzle ID"])
            const timeControl = document.querySelector('input[name="timeControl"]:checked').value
            socket.emit('createChallenge', {token, challenge:{challengerPuzzleIds:puzzleIds, timeControl}})
        }
    }
   const focusChallenge = ()=>{
    setFocusChallengeForm(true)
     document.querySelector('#focusIncomingChallenge').classList.remove('text-blue-600')
     document.querySelector('#focusIncomingChallenge').classList.add('text-blue-400')
     document.querySelector('#focusIncomingChallenge').classList.add('border-blue-400')
     document.querySelector('#focusIncomingChallenge').classList.remove('border-blue-600')
     document.querySelector('#focusChallenge').classList.remove('text-blue-400')
     document.querySelector('#focusChallenge').classList.add('text-blue-600')
     document.querySelector('#focusChallenge').classList.add('border-blue-600')
     document.querySelector('#focusChallenge').classList.remove('border-blue-400')
     
   }
   const focusIncomingChallenge = ()=>{
    setFocusChallengeForm(false)
    document.querySelector('#focusIncomingChallenge').classList.remove('text-blue-400')
     document.querySelector('#focusIncomingChallenge').classList.add('text-blue-600')
     document.querySelector('#focusChallenge').classList.remove('text-blue-600')
     document.querySelector('#focusChallenge').classList.add('text-blue-400')
     document.querySelector('#focusIncomingChallenge').classList.add('border-blue-600')
     document.querySelector('#focusChallenge').classList.add('border-blue-400')
     document.querySelector('#focusChallenge').classList.remove('border-blue-600')
     document.querySelector('#focusIncomingChallenge').classList.remove('border-blue-400')
   }
    return (    
    <div className="h-full" >
        <span className=" w-full">
            <button id="focusChallenge" onClick={focusChallenge} className="text-blue-600 border-b-4 pb-1 px-3 border-blue-600" type="button">Create Challenge</button>
            <button id="focusIncomingChallenge" onClick={focusIncomingChallenge}  type="button" className=" text-blue-600 border-b-4 pb-1 px-3 border-blue-400">Incoming Challenges</button>
        </span>
        {focusChallengeForm&&
        <div className=" w-full h-4/5 inline-flex items-center flex-col justify-between m-1">
            <table className=" border-2">
            <thead className=" border-2">
            <tr><th className=" px-2">Puzzle ID</th><th className=" px-2">Rating</th><th className=" px-2">Attempts</th><th className=" px-2">Success Rate</th></tr>
            </thead> 
            <tbody className=" bg-white">
                {selectedPuzzles.map(puzzle => (
                <tr className=" border-b-2 border-slate-50" key={puzzle["Puzzle ID"]}><td>{puzzle["Puzzle ID"]}</td><td>{puzzle.Rating}</td><td>{puzzle.Attempts}</td><td>{puzzle["Success Rate"]}</td></tr>
                ))}
            </tbody>
            </table>
            <button type="button" onClick={createChallenge} className=" button-3 green font-bold text-white p-3 hover:bg-green-600">Create Challenge</button>
        </div>    
        }
        {!focusChallengeForm&&
        <div className=" w-full h-4/5 inline-flex items-center flex-col">
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

        }
        
        
    </div>
    )           
}