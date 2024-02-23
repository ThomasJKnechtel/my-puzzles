export default function formatDate(dateStr){
    const [year, month, day] = dateStr.split('.');
    const date = new Date(year, month, day)
    const formattedYear = date.getFullYear();
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = date.getDate().toString().padStart(2, '0');
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}