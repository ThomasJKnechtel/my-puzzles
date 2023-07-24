import { useEffect, useState } from "react"

export default function Timer({time, start, reset, pause, restart}){
    
    const [timeLeft, setTimeLeft] = useState( time)
    const [endTime, setEndTime] = useState( Date.now()+time)
    const [pauseTime, setPauseTime] = useState(null)
    
    let timeObject = getTime(calculateTimeLeft())
    useEffect(()=>{
        if(timeLeft<0) setTimeLeft(0)
        if(reset){
            setTimeLeft(time)
            setEndTime(Date.now()+time)
            timeObject = getTime(timeLeft)
        }
        if(restart){
            const timePaused = Date.now()-pauseTime
            setEndTime(timePaused+endTime)
            timeObject = getTime(timeLeft)
        }
        else if(start){
            if(timeLeft > 0){
                const timer = setTimeout(()=>{

                setTimeLeft(calculateTimeLeft())
                timeObject = getTime(timeLeft)
                 }, 1000)
            
            }
            
        }
        else if(pause){
            setPauseTime(Date.now())
            timeObject = getTime(timeLeft)
        }
        if(timeLeft < 0)
        return ()=> clearTimeout()
    })
    function calculateTimeLeft(){
        return endTime - Date.now()
    }
    function getTime(milli){
        return {
            days : Math.floor(milli / (1000 * 60 * 60 * 24)),
            hours : Math.floor((milli % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes : Math.floor((milli % (1000 * 60 * 60)) / (1000 * 60)),
            seconds :  Math.floor((milli % (1000 * 60)) / 1000),
            microseconds : Math.floor((milli % (1000))/100)
        }
    }
    return (
        <div className="bg-slate-700 h-fit m-4 p-1 rounded-lg border-solid border-4 border-gray-600">
        
        {timeObject.days !== 0&&(
            <>
            <span className="bg-slate-500"><label>{timeObject.days}</label></span>
            <span className="font-bold text-2xl">:</span></>)
        }{timeObject.hours !== 0&&(<>
            <span><label>{timeObject.hours}</label></span>
            <span className="font-bold text-2xl">:</span> </>)
        }{timeObject.minutes !== 0&&(<>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg "><label className=" w-32">{timeObject.minutes/10 < 1&&0}{timeObject.minutes}</label></span>
            <span className="font-bold text-2xl">:</span></>)
        }{timeObject.seconds !== 0?(<>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>{timeObject.seconds/10 < 1&&0}{timeObject.seconds}</label></span>
           </>):(<>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>00</label></span>
            
            </>
                
            )
        }{(timeObject.minutes !== 0)?(<></>):(timeObject.microseconds === 0 && timeObject.minutes === 0)?(<>
            <span className="font-bold text-2xl">:</span>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>0</label></span>
           
            </>
                
            ):(<>
            <span className="font-bold text-2xl">:</span>
            <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg"><label>{timeObject.microseconds}</label></span></>
           )
        }
           
        </div>
    )
}