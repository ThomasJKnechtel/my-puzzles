export default function formatMilliseconds(milliseconds) {
    const totalmicroseconds =  Math.floor(milliseconds/100)
    const microseconds = totalmicroseconds%10
    const totalSeconds = Math.floor(milliseconds / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
  
    return {seconds, minutes, hours, microseconds};
  }