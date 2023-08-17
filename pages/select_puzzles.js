import { useState, useEffect } from "react"
import PuzzleTable  from "../components/puzzleTable"
import Layout from "../components/layout"


export default function SelectPuzzlesPage({socket}){
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
      return (<Layout><PuzzleTable puzzles={puzzles} setPuzzles={setPuzzles}></PuzzleTable></Layout>)

}