export default function formatDate(dateStr){
    let date = new Date(dateStr)
    if(!(date instanceof Date) || Number.isNaN(date.valueOf())){
        const [year, month, day] = dateStr.split('.');
        date = new Date(year, month, day)
    }
    const formattedYear = date.getFullYear();
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = date.getDate().toString().padStart(2, '0');
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}