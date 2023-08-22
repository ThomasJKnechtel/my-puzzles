export default function getTimeInMillis(timeControl){
    let time = 0
    if(timeControl){
        if(timeControl.seconds){
            time += timeControl.seconds*1000
        }
        if(timeControl.minutes){
            time += timeControl.minutes*60*1000
        }
        if(timeControl.hours){
            time += timeControl.hours*60*60*1000
        }
        if(timeControl.days){
            time += timeControl.days*24*60*60*1000
        }
    }
    return time
 }