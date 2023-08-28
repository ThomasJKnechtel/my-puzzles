

export default function PuzzleFormSelection({loggedIn, popdown, setPopDown}){


    
    return (
        
            
            <form id="puzzleForm" action="" method="GET" className=" bg-white pt-2  pr-8 relative w-full hidden">
           
           

           
           <fieldset className=" border-t-2 ">
               <div className=" flex-col items-start my-2 mx-10"><label className=" font-medium block" htmlFor="player">Player</label><input className=" border-2 shadow-sm bg-slate-100  w-full" type="text" name="player" id="player"></input></div>
               <div className=" fex-col items-end my-2 mx-10"><label className=" font-medium block" htmlFor="opponent">Opponent</label><input className="border-2 shadow-sm bg-slate-100  w-full" type="text" name="opponent"></input></div>
               
           </fieldset>
          <fieldset className=" border-t-2 flex flex-row">
                <div className=" inline-flex w-full mx-10 justify-between my-2">
                    <label className=" font-medium text-lg">Select Dates Played</label>
                    <div>
                        <div className=" inline-flex flex-col items-start mx-20">
                            <label className=" font-medium " htmlFor="startDate">From </label><input className=" border-2 shadow-sm bg-slate-100 px-2"  type="date" name="startDate"></input>
                        </div>
                        <div className=" inline-flex flex-col items-start"><label className=" font-medium" htmlFor="endDate">To</label><input className=" border-2 shadow-sm bg-slate-100 px-2"  type="date" name = "endDate"></input></div>
                    </div></div>
            </fieldset>
            <fieldset className="  flex flex-row">
                <div className=" inline-flex w-full mx-10 justify-between my-2">
                    <label className=" font-medium text-lg">Select Dates Uploaded</label>
                    <div>
                         <div className=" inline-flex flex-col items-start mx-20"><label className=" font-medium" htmlFor="startDateUploaded">From</label><input className=" border-2 shadow-sm bg-slate-100 px-2" type="date" name="startDateUploaded"></input></div>
                    <div className=" inline-flex flex-col items-start  "><label className=" font-medium" htmlFor="endDateUploaded">To</label><input className=" border-2 shadow-sm bg-slate-100 px-2" type="date" name = "endDateUploaded"></input></div>
                    </div>
                   
                </div>
               
              </fieldset>
              
                <fieldset className="flex flex-row border-t-2">
                    <div className=" mx-10 inline-flex flex-row w-full my-2">
                        <label className="font-medium text-lg">Sort Criteria</label>
                        <div className=" mx-32">
                            <div><input type="radio" name="sortCriteria" value="datePlayed"></input><label className=" font-medium mx-2">Date Played</label></div>
                            <div><input type="radio" name="sortCriteria" value="dateUploaded"></input><label  className=" font-medium mx-2">Date Uploaded</label></div>
                            <div><input type="radio" name="sortCriteria" value="mostAttempts"></input><label  className=" font-medium mx-2">Most Attempts</label></div>
                            <div><input type="radio" name="sortCriteria" value="leastAttempts"></input><label className=" font-medium mx-2">Least Attempts</label></div>
                            <div><input type="radio" name="sortCriteria" value="lowSuccessRate"></input><label className=" font-medium mx-2">Low Success Rate</label></div>
                        </div>
                    </div>
                </fieldset>
                <fieldset className=" flex flex-row border-t-2">
                <div className=" flex flex-row justify-end w-full my-2">

                
                <div className=" inline-flex flex-col mx-10">
                    <label className=" font-medium" htmlFor="numberOfPuzzles">Number of Puzzles</label><input className=" border-2 shadow-sm bg-slate-100 px-2" type="number" name="numberOfPuzzles"></input>
                </div>
                    {loggedIn&&(
                        <div className=" inline-flex flex-col items-end  mx-10"><label className=" font-medium" htmlFor="myPuzzles">From my puzzles</label><label className="switch"><input className=" opacity-0 w-0 h-0" type="checkbox" name="myPuzzles"></input><span className="slider"></span></label></div>)
                    }
                    <input type="submit"  className="button-3 green m-2 w-24 self-end  mx-10"></input></div>
                </fieldset>
           {/* 

           
           
           
           <fieldset className="">
            <legend>Sort Criteria</legend>
            <div className=" "><div><label className="">Date Played</label><input type="radio" name="sortCriteria" value="datePlayed"></input></div><div><label  className="">Date Uploaded</label><input type="radio" name="sortCriteria" value="dateUploaded"></input></div><div><label  className="mr-20">Most Attempts</label><input type="radio" name="sortCriteria" value="mostAttempts"></input></div><div><label className="mr-20">Least Attempts</label><input type="radio" name="sortCriteria" value="leastAttempts"></input></div><div><label className="mr-20">Low Success Rate</label><input type="radio" name="sortCriteria" value="lowSuccessRate"></input></div></div>
           </fieldset>
<div className="">
            <label className="" htmlFor="numberOfPuzzles">Number of Puzzles</label><input className="" type="number" name="numberOfPuzzles"></input>
           </div>
           <div className="">
             {loggedIn&&(<div className=""><label className="" htmlFor="myPuzzles">From my puzzles</label><label className="switch"><input className=" opacity-0 w-0 h-0" type="checkbox" name="myPuzzles"></input><span className="slider"></span></label></div>)}
           <input type="submit"  className="button-3 green m-2 w-24 self-end"></input>
           
           </div> */}
          
           
       </form>
       
    
    
        
    )
}