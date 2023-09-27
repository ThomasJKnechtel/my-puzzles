import Image from "next/image"

export default function ChallengeForm({formOpen, setFormOpen, selectedPuzzles, socket, token}){
    function createChallenge(){
        if(socket){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle["Puzzle ID"])
            const timeControl = document.querySelector('input[name="timeControl"]:checked').value
            socket.emit('createChallenge', {token, challenge:{challengerPuzzleIds:puzzleIds, timeControl}})
        }
    }
    return (
        <div id="challengeForm" className=" bg-white flex flex-col items-center gap-3 h-full w-full">
            <div className=' w-full flex flex-row items-center justify-center relative'>
            <h1 className=" font-bold font-serif text-xl self-center ">Create Challenge</h1>
            {
                formOpen?(<button id="minimize" type='button' onClick={()=>setFormOpen(false)}  className=' w-3 h-[3px] bg-slate-400 rounded-md absolute right-1' > </button>)
                :<button id="maximize" type="button" onClick={()=>setFormOpen(true)} className=" absolute right-1" ><Image src="https://img.icons8.com/ios-filled/50/plus-math.png" alt="maximize" width={15} height={15}/></button>
            }
            </div>    
            <div id="challengeFormBody" className={formOpen?" flex flex-col items-center gap-3 justify-evenly h-full":"hidden"}>
                <table className=" border-2">
                    <thead className=" border-2">
                        <tr><th className=" px-2">Puzzle ID</th><th className=" px-2">Rating</th><th className=" px-2">Attempts</th><th className=" px-2">Success Rate</th></tr>
                    </thead> 
                    <tbody className=" bg-white">
                        {
                            selectedPuzzles.map(puzzle => (
                                <tr className=" border-b-2 border-slate-50" key={puzzle["Puzzle ID"]}><td>{puzzle["Puzzle ID"]}</td><td>{puzzle["Rating"]}</td><td>{puzzle["Attempts"]}</td><td>{puzzle["Success Rate"]}</td></tr>
                            ))
                        }
                    </tbody>
                </table>
                <span><input type="radio" name="timeControl" value="3Minute"/><label className=" ml-1 mr-3" htmlFor="timeControl">3 Minute</label><input type="radio" name="timeControl" value="5Minute"/><label htmlFor="timeControl" className=" ml-1">5 Minute</label></span>
                <button type="button" className=" button-3 mb-4" onClick={createChallenge}>Challenge</button> 
            </div>
        </div>
    )
}