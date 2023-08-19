import { useState, useEffect } from "react"
import PuzzleTable  from "../components/puzzleTable"
import Layout from "../components/layout"
import PuzzleFormSelection from "@/components/puzzleSelection"
import { useSession } from "next-auth/react";
export default function SelectPuzzlesPage({socket}){
    const { data : session } = useSession()
    const [puzzles, setPuzzles] = useState([])
    useEffect(() => {
        if(socket){
            
            socket.emit('gamesPgns', sessionStorage.getItem('gamePgns'))
            sessionStorage.setItem('gamePgns',JSON.stringify([]))
            
               
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
        }
        sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
      }, [puzzles, socket])
      return (
        <Layout><div className=" flex flex-col justify-between items-center"><PuzzleFormSelection loggedIn={session}></PuzzleFormSelection><PuzzleTable puzzles={puzzles} setPuzzles={setPuzzles} session={session}></PuzzleTable></div></Layout>
      )

}