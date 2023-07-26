import { useEffect, useState } from "react"

export default function Timer({time, start, reset, pause, restart}){
    
    const [timeLeft, setTimeLeft] = useState(getTime(time))
    const [endTime, setEndTime] = useState( Date.now()+time)
    const [pauseTime, setPauseTime] = useState(null)

    
    useEffect(()=>{
        if(reset){
            setTimeLeft(getTime(time))
            setEndTime(Date.now()+time)
            
        }
    }, [reset])
    useEffect(()=>{
        if(restart && pauseTime){
            const timePaused = Date.now()-pauseTime
            setEndTime(timePaused+endTime)
            
        }
    }, [restart])
    useEffect(()=>{
        if(pause){
            setPauseTime(Date.now())
          
        }
    }, [pause])
    useEffect(()=>{
        if(timeLeft.total<0) setTimeLeft(getTime(0))
        else if(start && !pause){
            if(timeLeft.total > 0){
                const timer = setTimeout(()=>{
                if(!pause){
                    setTimeLeft(getTime(calculateTimeLeft()))
                }
                
               
                 }, 100)
            
            }
            
        }
        return ()=> clearTimeout()
    }, [start, timeLeft, endTime])
    function calculateTimeLeft(){
        return endTime - Date.now()
    }
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
    return (
        <div className="bg-slate-700 h-fit m-1 p-1 rounded-lg border-solid border-4 border-gray-600">
        {timeLeft.days !== 0&&(
            <>
            <span className="bg-slate-500"><label>{timeLeft.days}</label></span>
            <span className="font-bold text-2xl">:</span></>)
        }{timeLeft.hours !== 0&&(<>
            <span><label>{timeLeft.hours}</label></span>
            <span className="font-bold text-2xl">:</span> </>)
        }{timeLeft.minutes !== 0&&(<>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg "><label className=" w-32">{timeLeft.minutes/10 < 1&&0}{timeLeft.minutes}</label></span>
            <span className="font-bold text-2xl">:</span></>)
        }{timeLeft.seconds !== 0?(<>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>{timeLeft.seconds/10 < 1&&0}{timeLeft.seconds}</label></span>
           </>):(<>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>00</label></span>
            
            </>
                
            )
        }{(timeLeft.minutes !== 0)?(<></>):(timeLeft.microseconds === 0 && timeLeft.minutes === 0)?(<>
            <span className="font-bold text-2xl">:</span>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>0</label></span>
           
            </>
                
            ):(<>
            <span className="font-bold text-2xl">:</span>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>{timeLeft.microseconds}</label></span></>
           )
        }
           
        </div>
    )
}