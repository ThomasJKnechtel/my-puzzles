import db from "@/utils/dbConnect";

export default async function addPuzzle(req, res){
    try{
         const { white, black, date, continuation, id, fen} = req.body
         const currentDate = new Date();
         const year = currentDate.getFullYear();
         const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
         const day = currentDate.getDate().toString().padStart(2, '0');
         const upload_date = `${year}:${month}:${day}`;
        console.log(req.body)
        const query = `INSERT INTO puzzles (white, black, date, fen, continuation, success_rate, attempts, user_id, date_uploaded) VALUES ('${white}', '${black}', '${date}', '${fen}', '${continuation}', 0, 0, ${id}, '${upload_date}') `
        await db.query(query)
    }catch(error){
        console.log(error)
    }
   
}