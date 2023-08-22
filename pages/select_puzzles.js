import { useState, useEffect } from "react"
import PuzzleTable  from "../components/puzzleTable"
import Layout from "../components/layout"
import PuzzleFormSelection from "@/components/puzzleSelection"
import { useSession } from "next-auth/react";
import LoadingIcon from "@/components/loadingIcon";

import getPuzzles from "./api/db/getPuzzles";

export default function SelectPuzzlesPage({puzzlesFromSearch, saved, socket}){
    const { data : session } = useSession()
    const [puzzles, setPuzzles] = useState(JSON.parse(puzzlesFromSearch))
    const [popDownTable, setPopDownTable] = useState(true)
    const [progress,  setProgress] = useState(0)
    const [displayProgress, setDisplayProgress] = useState(false)
   
    useEffect(() => {
        if(socket && !puzzles){
            
            socket.emit('gamesPgns', sessionStorage.getItem('gamePgns'))
            sessionStorage.setItem('gamePgns',JSON.stringify([]))
            
               
        }   

      }, [socket]) 
      useEffect(()=>{
        console.log(puzzles)
        if(socket){
            socket.on('puzzles', newPuzzles=>{
                newPuzzles = JSON.parse(newPuzzles)
            
                const newPuzzlesList = newPuzzles.concat(puzzles)
                setPuzzles(newPuzzlesList)
                setDisplayProgress(true)
                
                })
                socket.on('disconnect', () => {
                console.log('disconnect')
            })
            socket.on('progress', progress=>{
              setProgress(progress)
            })
            socket.on('puzzlesCompleted', ()=>{
              setDisplayProgress(false)
              setProgress(0)
            })
        }
        sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
      }, [puzzles, socket])
      return (
        <Layout><div className=" flex flex-col justify-between items-center overflow-hidden"><PuzzleFormSelection loggedIn={session} popdown={!popDownTable} setPopDown={setPopDownTable}></PuzzleFormSelection><PuzzleTable puzzles={puzzles} setPuzzles={setPuzzles} session={session} popdown={popDownTable} setPopDown={setPopDownTable} saved={saved}></PuzzleTable>{displayProgress&&<><LoadingIcon progress={progress}></LoadingIcon><label>{progress}%</label></>}</div></Layout>
      )

}
export async function getServerSideProps(context){
  console.log(context.query)
  let puzzles = null
  let saved = false
  if(Object.keys(context.query).length){
    puzzles = await getPuzzles(context.query)
    saved = true
  }
  return { props : { 'puzzlesFromSearch': JSON.stringify(puzzles), 'saved':saved }}
}