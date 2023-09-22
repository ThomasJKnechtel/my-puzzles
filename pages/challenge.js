/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import getPuzzles from "./api/db/getPuzzles";
import formatDate from "@/utils/formatDate";
import Layout from "@/components/layout";
;

export default function ChallengePage({socket, puzzles}){
    const [challenges, setChallenges] = useState([])
    const [selectedPuzzles, setSelectedPuzzles] = useState([])
    const {data: sessionData } = useSession()
    useEffect(()=>{
        if(socket){
            socket.emit('getChallenges')
            socket.on('challenges', (currentChallenges)=>{
                setChallenges(currentChallenges)
            })
            socket.on('game_message', (gameState)=>{
                if(gameState.state.state === "WAITING") window.location.href = "/puzzle_duel"
            })
        }
    }, [socket])

    function createChallenge(){
        if(socket){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle.puzzle_id)
            const timeControl = document.querySelector('input[name="timeControl"]:checked').value
            socket.emit('createChallenge', {token: sessionData.token, challenge:{challengerPuzzleIds:puzzleIds, timeControl}})
        }
    }
    function acceptChallenge(challenge){
        const {challenger, challengerPuzzleIds, timeControl} = challenge
        if(socket && challengerPuzzleIds.length === selectedPuzzles.length){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle.puzzle_id)
            socket.emit('challengeAccepted', {token: sessionData.token, challenge: {...challenge, challenger, challengerPuzzleIds, timeControl, opponentPuzzles:puzzleIds}})
            
        }
    }
    function onPuzzleChecked(event, puzzle){
        const checkedPuzzle = event.currentTarget
        if(checkedPuzzle.checked){
            setSelectedPuzzles(oldPuzzles => oldPuzzles.concat([puzzle]))
        }else{
            setSelectedPuzzles(oldPuzzles => oldPuzzles.filter(oldPuzzle => oldPuzzle.puzzle_id !== parseInt(checkedPuzzle.value, 10)))
        }
    }
   
    return (
        <Layout searchLink selectPuzzles>
        <div className=" flex flex-row items-center m-2 h-full justify-center gap-10">
            <div className=" inline-flex flex-col items-center bg-white  p-2 rounded-md shadow-md h-4/5">
                <h1 className=" font-bold text-2xl mb-2">Select Puzzles</h1>
                <div  className=" overflow-y-scroll h-[500px]">
                    <table className=" w-[400px] text-sm ">
                        <thead className=" border-2"><tr><th>Puzzle ID</th><th>Attempts</th><th>Success Rate</th><th>Upload Date</th></tr></thead>
                        <tbody>
                            {puzzles&& 
                                JSON.parse(puzzles).map((puzzle=>{
                                    const {puzzle_id, attempts, success_rate, white, black, date_uploaded} = puzzle
                                    return <tr key={puzzle_id}><td className=" underline text-blue-400"><input onChange={(e)=>{onPuzzleChecked(e, puzzle)}} value={puzzle_id} className=" mr-1" type="checkbox"/>{puzzle_id}</td><td>{attempts}</td><td>{success_rate}</td><td>{formatDate(date_uploaded)}</td></tr>
                                }))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className=" inline-flex flex-col items-center bg-white  p-2 rounded-md shadow-md justify-around h-4/5">
                <h1 className=" font-bold text-2xl mb-2">Challenge</h1>
                <div className=" overflow-y-scroll h-[200px]">
                    <table className=" w-[500px]">
                        <thead className=" border-2"><tr><th>Puzzle ID</th><th>Attempts</th><th>Success Rate</th><th>Upload Date</th></tr></thead>
                        <tbody>
                            {selectedPuzzles&& 
                                selectedPuzzles.map((puzzle=>{
                                    const {puzzle_id, attempts, success_rate, white, black, date_uploaded} = puzzle
                                    return <tr key={puzzle_id}><td className=" underline text-blue-400"><input onChange={onPuzzleChecked} value={puzzle_id} className=" mr-1" type="checkbox"/>{puzzle_id}</td><td>{attempts}</td><td>{success_rate}</td><td>{formatDate(date_uploaded)}</td></tr>
                                }))
                            }
                        </tbody>
                    </table>
                     
                
                </div>
                <div className=" ">
                    <label className="font-medium px-1">Number of Puzzles:</label><output>{selectedPuzzles.length}</output>
            
                </div>
                <div>
                    <input value="3Minute" name="timeControl" type="radio" defaultChecked/><label className=" px-2">3 Minute</label> <input value="5Minute" name="timeControl" type="radio"/><label className=" px-2">5 Minute</label>
                </div>
                <button className=" button-3 green mt-4" type="button" onClick={createChallenge}>Challenge</button>
            </div>
            <div className=" inline-flex flex-col items-center bg-white p-2 rounded-md shadow-md  h-4/5 ">
                <h1 className=" font-bold text-2xl mb-2">Incoming Challenges</h1>
                <div className=" h-[500px] border-2">
                    <table className=" w-[400px] text-sm">
                    <thead className=" font-bold border-b-2 overflow-y-scroll"><tr><td>User</td><td>Time Control</td><td>Number of Puzzles</td><td></td></tr></thead>
                    <tbody>
                        {
                            challenges.map(challenge=>{
                                const {challenger,  timeControl, challengerPuzzleIds, id } = JSON.parse(challenge)
                                return <tr key={id}><td>{challenger}</td><td>{timeControl}</td><td className={(selectedPuzzles.length!==challengerPuzzleIds.length)?"text-red-600":"text-black"}>{`${selectedPuzzles.length}/${challengerPuzzleIds.length}`}</td><td><button onClick={()=>acceptChallenge(JSON.parse(challenge))} className=" underline text-blue-500" type="button">Accept</button></td></tr>
                            })
                        }
                    </tbody>
                    </table>
                </div>
                
            </div>
        </div>
        </Layout>
        
       
    )

}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const puzzles = JSON.stringify(await getPuzzles({username: session.username, sortCriteria:'dateUploaded'}))
    return {
      props: {
        puzzles
      },
    };
  }
  