import { useState } from "react"

export default function PuzzleFormSelection({loggedIn}){
    const [popdown, setPopDown] = useState(false)
    return (
        <div className="w-4/5 mt-6">
        <div className=" bg-slate-400 w-fit pt-1 px-1 rounded-t-md shadow-md">
        <button onClick={()=>{setPopDown(!popdown)}}><label className="text-lg font-bold">Select Puzzles</label>{popdown?<label className="text-lg m-2 text-center">&#9650;</label>:<label className="text-lg m-2 text-center">&#9660;</label>}</button>
            
        </div>
        {popdown?(
            <form className=" p-2 bg-slate-300 rounded-b-md rounded-r-md mb-4 w-full shadow-md ">
           
           <fieldset className="bg-slate-200 my-2 rounded-md flex">
               <div className=" w-1/2"><label className="m-2 mr-6" for="player">Player</label><input className="m-2 w-4/5 rounded-sm" type="text" name="player"></input></div>
               <div className=" w-1/2"><label className="m-2 mr-6" for="opponent">Opponent</label><input className="m-2 w-4/5 rounded-sm" type="text" name="opponent"></input></div>
               
           </fieldset>
          
           <fieldset className=" border-2 border-slate-500 p-2">
               <legend>Date Played</legend>
               <div className="bg-slate-200 flex justify-evenly rounded-md items-center flex-row">
               <div className="w-1/2 h-fit flex justify-between"> <label className="m-2 h-fit my-auto" for="startDate">From:</label><input className="mx-10 my-2 p-2 rounded-sm" type="date" name="startDate"></input></div>
               <div className="w-1/2 h-fit flex justify-between"><label className="m-2 h-fit  my-auto" for="endDate">To:</label><input className="mx-10 my-2 p-2 rounded-sm" type="date" name = "endDate"></input></div>
               
               </div>

           </fieldset>
           <fieldset className="border-2 border-slate-500 p-2">
               <legend>Date Uploaded</legend>

               <div className="bg-slate-200 flex justify-evenly rounded-md">
               <div className="w-1/2 flex justify-between"><label className="m-2 my-auto" for="startDateUploaded">From:</label><input className="mx-10 my-2 p-2 rounded-sm" type="date" name="startDateUploaded"></input></div>
               <div className="w-1/2 flex justify-between"><label className="m-2 my-auto" for="endDateUploaded">To:</label><input className="mx-10 my-2 p-2 rounded-sm" type="date" name = "endDateUploaded"></input></div>

               </div>
              
           </fieldset>
           {loggedIn&&(<><label className="m-2">My Puzzles</label><input className="m-2" type="radio"></input></>)}
           
           <label className="m-2">Number of Games</label><input className="m-2" type="number"></input>
           
       </form>):(
        <div className=" h-6 bg-slate-300 rounded-b-md rounded-r-md"></div>
       )
    }
        </div>
    )
}