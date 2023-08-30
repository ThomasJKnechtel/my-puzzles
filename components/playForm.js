import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
export default function PlayForm({setOpen, puzzles}){
    const [mode, setMode] = useState("Infinite")
    const [popupOpen, setPopupOpen] = useState(false)

    function play(){
         sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
         window.location.href = "./play/blitz"   
    }
    return (
        <div className=" bg-white border-2 rounded-md flex flex-col items-center">
        <button className=" absolute right-1 text-sm font-mono text-red-700" onClick={()=>{setOpen(false)}}>✖</button>
            <label className=" w-full font-bold text-2xl bg-green-600 text-center">Play</label>
            <div className=" inline-flex flex-col items-end p-4">
                
                <div>
                    <label className=" mx-5 font-medium text-slate-400">Selected Puzzles</label>
                    <input type="radio" value="Selected Puzzles" name="puzzleType"></input>
                </div>
                <div>
                    <label className=" mx-5 font-medium text-slate-400">My Puzzles</label>
                    <input type="radio" value="My Puzzles" name="puzzleType"></input>
                </div>
                <div>
                    <label className=" mx-5 font-medium text-slate-400">Random Puzzles</label>
                    <input type="radio" value="Random Puzzles" name="puzzleType"></input>
                </div>
                
            </div>
            <div className=" green rounded-md p-2">
                <button onClick={play} className=" font-medium">
                    <label>{"Play "+mode}</label>
                </button>
                <button onClick={()=>{setPopupOpen(!popupOpen)}} name="mode" className=" px-2">▼</button> 
                {popupOpen&&  
                    <div className=" absolute green z-10 inline-flex flex-col w-28 bottom-[-25px] left-11 rounded-md border-2 shadow-xl" >
                        <button className=" font-medium" value="Infinite" onClick={()=>{setMode("Infinite"); setPopupOpen(false)}} >Infinite</button>
                        <button  className=" font-medium" value="3" onClick={()=>{setMode("3 Minute"); setPopupOpen(false)}}>3 Minute</button>
                        <button className=" font-medium" value="5" onClick={()=>{setMode("5 minute"); setPopupOpen(false)}}>5 Minute</button>
                    </div>
                }
    
            </div>
            <div className=" bg-green-600 h-[33px] flex justify-center w-full mt-5">
            <Image src="https://img.icons8.com/ios-filled/50/FFFFFF/puzzle.png" alt="puzzlePiece" width={50} height={50} className="absolute bottom-0 rotate-180"/>
        </div>
        </div>
    )
}