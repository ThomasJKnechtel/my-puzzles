import { useState, useEffect } from "react"
import PuzzleTable  from "../components/puzzleTable"
import Layout from "../components/layout"
import PuzzleFormSelection from "@/components/puzzleSelection"
import { useSession } from "next-auth/react";
import LoadingIcon from "@/components/loadingIcon";
export default function SelectPuzzlesPage({socket}){
    const { data : session } = useSession()
    const [puzzles, setPuzzles] = useState([])
    const [popDownTable, setPopDownTable] = useState(true)
    const [progress,  setProgress] = useState(0)
    const [displayProgress, setDisplayProgress] = useState(false)
    useEffect(() => {
        if(socket){
            
            socket.emit('gamesPgns', sessionStorage.getItem('gamePgns'))
            sessionStorage.setItem('gamePgns',JSON.stringify([]))
            setDisplayProgress(true)
               
        }   

      }, [socket]) 
      useEffect(()=>{
        if(socket){
            socket.on('puzzles', newPuzzles=>{
                newPuzzles = JSON.parse(newPuzzles)
            
                const newPuzzlesList = newPuzzles.concat(puzzles)
                setPuzzles(newPuzzlesList)
                
                
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
        <Layout><div className=" flex flex-col justify-between items-center overflow-hidden"><PuzzleFormSelection loggedIn={session} popdown={!popDownTable} setPopDown={setPopDownTable}></PuzzleFormSelection><PuzzleTable puzzles={puzzles} setPuzzles={setPuzzles} session={session} popdown={popDownTable} setPopDown={setPopDownTable}></PuzzleTable>{displayProgress&&<LoadingIcon progress={progress}></LoadingIcon>}</div></Layout>
      )

}