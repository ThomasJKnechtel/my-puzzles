/* eslint-disable jsx-a11y/label-has-associated-control */


export default function PuzzleFormSelection({loggedIn}){


    
    return (
        
            
            <form id="puzzleForm" action="" method="GET" className=" bg-white pt-2  pr-8 relative w-full hidden">
           
           <fieldset className=" border-t-2 ">
               <div className=" flex-col items-start my-2 mx-10"><label className=" font-medium block" htmlFor="player">Player</label><input className=" border-2 shadow-sm bg-slate-100  w-full" type="text" name="player" id="player" /></div>
               <div className=" fex-col items-end my-2 mx-10"><label className=" font-medium block" htmlFor="opponent">Opponent</label><input className="border-2 shadow-sm bg-slate-100  w-full" type="text" name="opponent" /></div>
               
           </fieldset>
          <fieldset className=" border-t-2 flex flex-row">
                <div className=" inline-flex w-full mx-10 justify-between my-2">
                    <label className=" font-medium text-lg">Select Dates Played</label>
                    <div>
                        <div className=" inline-flex flex-col items-start mx-20">
                            <label className=" font-medium " htmlFor="startDate">From </label><input className=" border-2 shadow-sm bg-slate-100 px-2"  type="date" name="startDate" />
                        </div>
                        <div className=" inline-flex flex-col items-start"><label className=" font-medium" htmlFor="endDate">To</label><input className=" border-2 shadow-sm bg-slate-100 px-2"  type="date" name = "endDate" /></div>
                    </div></div>
            </fieldset>
            <fieldset className="  flex flex-row">
                <div className=" inline-flex w-full mx-10 justify-between my-2">
                    <label className=" font-medium text-lg">Select Dates Uploaded</label>
                    <div>
                         <div className=" inline-flex flex-col items-start mx-20"><label className=" font-medium" htmlFor="startDateUploaded">From</label><input className=" border-2 shadow-sm bg-slate-100 px-2" type="date" name="startDateUploaded" /></div>
                    <div className=" inline-flex flex-col items-start  "><label className=" font-medium" htmlFor="endDateUploaded">To</label><input className=" border-2 shadow-sm bg-slate-100 px-2" type="date" name = "endDateUploaded" /></div>
                    </div>
                   
                </div>
               
              </fieldset>
              
                <fieldset className="flex flex-row border-t-2">
                    <div className=" mx-10 inline-flex flex-row w-full my-2">
                        <label className="font-medium text-lg">Sort Criteria</label>
                        <div className=" mx-32">
                            <div><input type="radio" name="sortCriteria" value="datePlayed" /><label className=" font-medium mx-2">Date Played</label></div>
                            <div><input type="radio" name="sortCriteria" value="dateUploaded" /><label  className=" font-medium mx-2">Date Uploaded</label></div>
                            <div><input type="radio" name="sortCriteria" value="mostAttempts" /><label  className=" font-medium mx-2">Most Attempts</label></div>
                            <div><input type="radio" name="sortCriteria" value="leastAttempts" /><label className=" font-medium mx-2">Least Attempts</label></div>
                            <div><input type="radio" name="sortCriteria" value="lowSuccessRate" /><label className=" font-medium mx-2">Low Success Rate</label></div>
                        </div>
                    </div>
                </fieldset>
                <fieldset className=" flex flex-row border-t-2">
                <div className=" flex flex-row justify-end w-full my-2">

                
                <div className=" inline-flex flex-col mx-10">
                    <label className=" font-medium" htmlFor="numberOfPuzzles">Number of Puzzles</label><input className=" border-2 shadow-sm bg-slate-100 px-2" type="number" name="numberOfPuzzles" />
                </div>
                    {loggedIn&&(
                        <div className=" inline-flex flex-col items-end  mx-10"><label className=" font-medium" htmlFor="myPuzzles">From my puzzles</label><label className="switch"><input className=" opacity-0 w-0 h-0" type="checkbox" name="username" value={loggedIn.user.name} /><span className="slider" /></label></div>)
                    }
                    <input type="submit"  className="button-3 green m-2 w-24 self-end  mx-10" /></div>
                </fieldset>
           
       </form>
       
    
    
        
    )
}