/* eslint-disable jsx-a11y/label-has-associated-control */
import { useMemo, useState } from "react"
import { getServerSession } from "next-auth"

import LobbyPuzzleTable from "../components/lobby/lobbyPuzzleTable"
import { authOptions } from "./api/auth/[...nextauth]"
import getPuzzles from "./api/db/getPuzzles"
import { useSession } from "next-auth/react"

export default function AcceptChallenge({queryStr, puzzles, socket}){
    const query = JSON.parse(queryStr)
    const {data: session} = useSession()
    const [selectedPuzzles, setSelectedPuzzles] = useState([])
    function acceptChallenge(e){
        e.preventDefault()
        if(session && socket && selectedPuzzles?.length === query.challengerPuzzles.length){
            const puzzleIds = selectedPuzzles.map(puzzle => puzzle["Puzzle ID"])
            socket.emit('friendAcceptsChallenge', {token: session.token, puzzleIds, challengeId: query.challengeId})
            window.location.href="/puzzle_duel"
        }
    }
    return (
    <div className=" w-full h-full p-2">
        <form onSubmit={acceptChallenge} id="acceptChallengeForm" className=" bg-white w-4/5 h-full flex flex-col  p-2 mx-auto border-2 m-2">
            
            <h1 className=" font-bold text-2xl border-b-2 w-full text-center">Accept Challenge</h1>
            <label className=" font-medium text-slate-600">Opponent</label>
            <label className=" font-medium text-xl bg-slate-300 w-[300px] px-1 opacity-40">{query.challenger}</label>
            <label className=" font-medium text-slate-600">Time Control</label>
            <label className=" font-medium text-xl bg-slate-300 w-[300px] px-1 opacity-40">{query.timeControl}</label>
            <div className=" w-full h-4/5 m-2 border-2 self-center">
                 {useMemo(()=><LobbyPuzzleTable setSelectedPuzzles={setSelectedPuzzles} puzzles={JSON.parse(puzzles)}/>, [puzzles])}
            </div>
           <label className=" font-medium text-xl text-slate-600 my-1">Selected Puzzles: {selectedPuzzles.length}/{query.challengerPuzzles.length}</label>
            <input type="submit" className=" bg-green-600 px-2 py-1 rounded-md font-medium hover:bg-green-500 w-fit"></input>
        </form>
    </div>
        
    )
}

export async function getServerSideProps(context){
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    if(!session.username){
        return {
            redirect: {
              destination: '/signup',
              permanent: false,
            },
          };
    }
    const puzzles =await getPuzzles({username: session.username, sortCriteria:'dateUploaded'})
    const query = context.query

    return {props: {queryStr:JSON.stringify(query), puzzles:JSON.stringify(puzzles)}}
}