import { useState } from "react"

export default function PuzzleFormSelection({loggedIn}){
    const [popdown, setPopDown] = useState(false)
    return (
        <div className="w-4/5 mt-6">
        <div className=" bg-slate-400 w-fit pt-1 px-1 rounded-t-md shadow-md border-2 border-slate-300">
        <button onClick={()=>{setPopDown(!popdown)}}><label className="text-lg font-bold">Select Puzzles</label>{popdown?<label className="text-lg m-2 text-center">&#9650;</label>:<label className="text-lg m-2 text-center">&#9660;</label>}</button>
            
        </div>
        {popdown?(
            <form className=" p-2 bg-slate-300 rounded-b-md rounded-r-md mb-4 w-full shadow-md  ">
           
           <fieldset className="bg-slate-200 my-2 rounded-md flex">
               <div className=" w-1/2"><label className="m-2 mr-6" for="player">Player</label><input className="m-2 w-4/5 rounded-sm" type="text" name="player"></input></div>
               <div className=" w-1/2"><label className="m-2 mr-6" for="opponent">Opponent</label><input className="m-2 w-4/5 rounded-sm" type="text" name="opponent"></input></div>
               
           </fieldset>
          
           <fieldset className=" border-2 border-slate-500 p-2">
               <legend>Date Played</legend>
               <div className="bg-slate-200 flex justify-evenly rounded-md items-center flex-row">
               <div className="w-1/2 h-fit flex justify-between"> <label className="m-2 h-fit my-auto" for="startDate">From:</label><input className="mx-10 my-2 p-2 text-center rounded-sm w-60" type="date" name="startDate"></input></div>
               <div className="w-1/2 h-fit flex justify-between"><label className="m-2 h-fit  my-auto" for="endDate">To:</label><input className="mx-10 my-2 p-2 rounded-sm text-center w-60" type="date" name = "endDate"></input></div>
               
               </div>

           </fieldset>
           <fieldset className="border-2 border-slate-500 p-2">
               <legend>Date Uploaded</legend>

               <div className="bg-slate-200 flex justify-evenly rounded-md">
               <div className="w-1/2 flex justify-between"><label className="m-2 my-auto" for="startDateUploaded">From:</label><input className="mx-10 my-2 p-2 rounded-sm text-center w-60" type="date" name="startDateUploaded"></input></div>
               <div className="w-1/2 flex justify-between"><label className="m-2 my-auto" for="endDateUploaded">To:</label><input className="mx-10 my-2 p-2 rounded-sm text-center w-60" type="date" name = "endDateUploaded"></input></div>

               </div>
              
           </fieldset>
<div className="flex flex-row justify-between w-1/2 px-2 m-2 bg-slate-200 p-2 rounded-md">
            <label className="mx-2">Number of Games</label><input className="mr-8 w-60" type="number"></input>
           </div>
           <div className="flex flex-row justify-between">
             {loggedIn&&(<div className="inline-flex flex-row justify-between w-1/2 bg-slate-200 p-2 rounded-md m-2"><label className="">From my puzzles</label><label className="switch"><input className=" opacity-0 w-0 h-0" type="checkbox"></input><span className="slider"></span></label></div>)}
           <input type="submit" className="button-3 green m-2 w-24 self-end"></input>
           
           </div>
          
           
       </form>):(
        <div className=" h-6 bg-slate-300 rounded-b-md rounded-r-md"></div>
       )
       
    }
    
        </div>
    )
}