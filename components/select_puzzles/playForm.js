/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from "react"

export default function PlayForm({puzzles}){
    const [mode, setMode] = useState("3 Minute")
    const [popupOpen, setPopupOpen] = useState(false)
    
    function play(){
        puzzles.forEach(puzzle => {
            if(typeof puzzle.continuation !== 'string'){
                // eslint-disable-next-line no-param-reassign
                puzzle.continuation = JSON.stringify(puzzle.continuation)
            }
        })
         sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
         if(mode==="3 Minute" && puzzles){
            window.location.href = "./play/blitz?timeControl=3" 
         }else if(mode==="5 Minute" && puzzles){
            window.location.href = "./play/blitz?timeControl=5"
         }else if(mode==="Random"){
            sessionStorage.setItem('previousPuzzles', JSON.stringify([]))
            fetch('/api/db/getRandomPuzzle', { 
                method:"POST",
                headers:{
                    'content-type':'application/json'
                },
                body : JSON.stringify({})
            } ).then( response => {
                if(!response.ok) console.log(response.status)
                return response.text()
            }).then( puzzleId => {
                window.location.href=`/play/${puzzleId}`
            })
         }
          
    }
    return (
        puzzles&&
            <div className={(mode==="3 Minute"||mode==="5 Minute")&&puzzles.length===0? "rounded-md p-2 relative bg-gray-400": "green rounded-md p-2 relative"}>
                <button type="button" onClick={play} className=" font-medium">
                    <label>{`Play ${mode}`}</label>
                </button>
                <button type="button" onClick={()=>{setPopupOpen(!popupOpen)}} name="mode" className=" px-2">▼</button> 
                 
                 {popupOpen&&
                     <div className=" absolute green z-10 inline-flex flex-col w-28 top-10 left-11 rounded-md border-2 shadow-xl" >
                        <button type="button" className=" font-medium" value="Infinite" onClick={()=>{setMode("Random"); setPopupOpen(false)}} >Random</button>
                        <button type="button"  className=" font-medium" onClick={()=>{setMode("3 Minute"); setPopupOpen(false)}}>3 Minute</button>
                        <button type="button" className=" font-medium" onClick={()=>{setMode("5 Minute"); setPopupOpen(false)}}>5 Minute</button>
                    </div>
                 }
                   
            </div>
        
            
            
           
    )
}