import { useState } from "react"
import Image from "next/image"
export default function DisplayPuzzleData({timeSpent, successRate, attempts, solution, result}){
    const [exit, setExit] = useState(false)
    function convertToDateString(){
        let dateStr = ""
        const { days, hours, minutes, seconds} = timeSpent
        if(days == 1)dateStr += days + " day "
        else if(days != 0) dateStr += days + " days "
        if(hours == 1) dateStr += hours + " hour "
        else if(hours != 0) dateStr += hours + " hours "
        if(minutes == 1) dateStr += minutes + " minute "
        else if(minutes != 0) dateStr += minutes + " minutes "
        if(seconds == 1) dateStr += seconds + " second"
        else if(seconds != 0) dateStr += seconds+ " seconds"
        return dateStr
    }
    return (
        !exit&&(
            <div className="  rounded-md relative border-4 border-green-600 bg-white shadow-lg">
        <button className=" absolute right-1 text-sm font-mono text-red-700" onClick={()=>{setExit(true)}}>✖</button>
    {result=="COMPLETED"?
        <div className="  bg-green-600  text-center p-2">
         <label className="  p-2 font-bold text-lg text-white">Correct!</label>
        </div>: 
        <div className="  bg-red-600  text-center p-2">
         <label className="  p-2 font-bold text-lg text-white">Incorrect</label>
        </div>
    }
    
    <div className=" pt-6 px-6 relative pb-3 ">
         <div>
        <label className=" font-medium m-2">Solving Time:</label><label>{convertToDateString()}</label>
        </div>
        <div>
            <label className=" font-medium m-2">Success Rate:</label><label>{successRate}</label>
        </div>
        <div>
            <label className=" font-medium m-2">Attempts:</label><label>{attempts}</label>
        </div> 
        <div>
            <label className=" font-medium m-2">Solution:</label><label className=" bg-black hover:bg-opacity-0">{solution}</label>
        </div>
        <div className=" text-center ">
           <button className="button-3 green font-medium w-20">Exit</button> <button className="button-3 green font-medium w-20 m-2 ">Next</button>
        </div>
        
        
        
    </div>
        
        <div className=" bg-green-600 h-[33px] flex justify-center">
            <Image src="https://img.icons8.com/ios-filled/50/FFFFFF/puzzle.png" alt="puzzlePiece" width={50} height={50} className="absolute bottom-0 rotate-180"/>
        </div>
   
    </div>)
    )
    
}