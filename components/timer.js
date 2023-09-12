/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback, useEffect, useState } from "react"

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

export default function Timer({time, start, reset, pause, restart}){
    
    const [timeLeft, setTimeLeft] = useState(getTime(time))
    const [endTime, setEndTime] = useState( Date.now()+time)
    const [pauseTime, setPauseTime] = useState(null)
    useEffect(()=>{
        setTimeLeft(getTime(time))
        setEndTime(Date.now()+time)
    }, [time])
    
    useEffect(()=>{
        if(reset){
            setTimeLeft(getTime(time))
            setEndTime(Date.now()+time)
            
        }
    }, [reset, time])
    useEffect(()=>{
        if(restart && pauseTime){
            const timePaused = Date.now()-pauseTime
            setEndTime(oldEndTime => oldEndTime+timePaused)
            
        }
    }, [restart, pauseTime])
    useEffect(()=>{
        if(pause){
            setPauseTime(Date.now())
          
        }
    }, [pause])
    useEffect(()=>{
        let timer = null
        function calculateTimeLeft(){
            return endTime - Date.now()
        }
        if(timeLeft.total<0) setTimeLeft(getTime(0))
        else if(start && !pause){
            if(timeLeft.total > 0){
                timer = setTimeout(()=>{
                    if(!pause){
                        setTimeLeft(getTime(calculateTimeLeft()))
                    }
                }, 100)
                
            }
            
        }
        return ()=> clearTimeout(timer)
    }, [start, timeLeft, pause, endTime])
    const getTimerDisplay = useCallback(()=>{
        let content = []
        if(timeLeft.days !== 0) content.push(
             <>
            <span className="bg-slate-500 w-8 inline-block text-center "><label>{timeLeft.days}</label></span>
            <span className="font-bold text-2xl">:</span>
            </>
        )
        if(timeLeft.hours !==0) content.push(
            <>
            <span className="bg-slate-500 w-8 inline-block text-center "><label>{timeLeft.days}</label></span>
            <span className="font-bold text-2xl">:</span>
            </>
        )
        if(timeLeft.minutes !== 0){
            content.push(
                <>
                <span className="bg-slate-600 m-1 rounded-md p-1 w-8 font-medium text-white text-lg inline-block text-center ">
                    <label className=" w-32">{timeLeft.minutes/10 < 1&&0}{timeLeft.minutes}</label>
                </span>
                <span className="font-bold text-2xl">:</span>
                </>
            )
        }if(timeLeft.seconds !== 0){
            content.push(
                    <span className="bg-slate-600 m-1 rounded-md p-1 w-8 font-medium text-white text-lg inline-block text-center"><label>{timeLeft.seconds/10 < 1&&0}{timeLeft.seconds}</label></span>  
            )
        }else{
            content.push(
                    <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg w-8 inline-block text-center"><label>00</label></span> 
            )
        }
        if(timeLeft.microseconds === 0 && (timeLeft.minutes === 0 && timeLeft.hours === 0)){
            content.push(
                <>
                    <span className="font-bold text-2xl">:</span>
                    <span className="bg-slate-600 m-1 rounded-md p-1 font-medium w-8 text-white text-lg inline-block text-center"><label>0</label></span>
                </>
            )
        }else if(timeLeft.microseconds !== 0  && (timeLeft.minutes === 0 && timeLeft.hours === 0)){
            content.push(
                <>
                <span className="font-bold text-2xl">:</span>
                <span className="bg-slate-600 m-1 rounded-md p-1 font-medium text-white text-lg w-8 inline-block text-center"><label>{timeLeft.microseconds}</label></span>
                </>
            )
        }
        return <div>{content}</div>        
    }, [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds, timeLeft.microseconds])    
    
   
    return (
        <div className="bg-slate-700 h-fit m-1 rounded-lg border-solid border-4 border-gray-600 w-fit relative inline-flex flex-row">
        
        {getTimerDisplay()}
           
        </div>
    )
}