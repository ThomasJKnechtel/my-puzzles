import { useEffect, useState } from "react";

export default function Stopwatch({start, stop, setTimeSpent}){
    const [startTime, setStartTime] = useState(null)
   
    const [currentTime, setCurrentTime] = useState(null)
    useEffect(()=>{
        if(start){
            setStartTime(Date.now())
        }
        
        
    }, [start])
    useEffect(()=>{
        if(stop){
            setTimeSpent(getTime(Date.now()-startTime))
        }
    }, [stop])
    useEffect(()=>{
        let timer = null
        
        let isDisplayed = false
        if(start&&!stop){
            const secondsDisplay = document.getElementById('secondsDisplay')
            timer = setInterval(()=>{
            setCurrentTime(Date.now())
            if(isDisplayed&&secondsDisplay){
                 secondsDisplay.style.visibility = "visible"
            }else if(secondsDisplay){
                secondsDisplay.style.visibility = "hidden"
            }
            isDisplayed = !isDisplayed
        }, 1000)
        }
       
        if(stop){
            clearInterval(timer)
        }
        return () => {
            clearInterval(timer); // Clean up the timer on unmount or when dependencies change
          }
    }, [startTime, stop])
    function getTime(milli){
        return {
            days : Math.floor(milli / (1000 * 60 * 60 * 24)),
            hours : Math.floor((milli % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes : Math.floor((milli % (1000 * 60 * 60)) / (1000 * 60)),
            seconds :  Math.floor((milli % (1000 * 60)) / 1000),
            microseconds : Math.floor((milli % (1000))/100),
            total : milli
        }
    }
    function convertToDateTime(startTime, currentTime){
        const timePast = getTime(currentTime-startTime)
        return ( 
           
            <div className="">
           

            
                {timePast.days != 0 &&
                    <>
                    <span className="bg-slate-500 w-8 inline-block text-center"><label>{timePast.days}</label></span>
                    <span className="font-bold text-2xl w-8 inline-block">:</span></>

                }
                {timePast.hours != 0 &&
                    <>
                    <span className="w-8 inline-block font-bold text-2xl text-center"><label>{timePast.hours}</label></span>
                    <span className="font-bold text-2xl w-8 inline-block">:</span> </>
                }
                {timePast.minutes != 0 && timePast.days==0 ?
                    <>
                    <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg w-8 inline-block text-center"><label className=" w-32">{timePast.minutes/10 < 1&&0}{timePast.minutes}</label></span>
                    <span className="font-bold text-2xl">:</span></>
                    : timePast.days == 0 ?
                    <>
                    <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg w-8 inline-block text-center"><label className=" w-32">00</label></span>
                    <span className="font-bold text-2xl">:</span></>
                    :<></>
                }
                {(timePast.seconds != 0 && timePast.hours == 0)?<>
                    <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg w-8 inline-block text-center"><label>{timePast.seconds/10 < 1&&0}{timePast.seconds}</label></span></>
                    :timePast.hours == 0?(<>
                        <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg w-8 inline-block"><label>00</label></span>
            
                    </>):(<></>)
                }
            
            </div>
            
        )
    }

    return (
        startTime&&currentTime&&
        <div className="bg-slate-700 h-fit m-1 p-1 rounded-lg border-solid border-4 border-gray-600 relative">
        {
            convertToDateTime(startTime, currentTime)
       
        }
        <div id="secondsDisplay" className=" rounded-full w-1 h-1 bg-slate-400 absolute top-1 right-1"></div>
        </div>
    )
}