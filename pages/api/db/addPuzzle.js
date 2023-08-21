import db from "@/utils/dbConnect";

export default async function addPuzzle(req, res){
    try{
         const { white, black, date, continuation, fen, username} = req.body
         const currentDate = new Date();
         const year = currentDate.getFullYear();
         const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
         const day = currentDate.getDate().toString().padStart(2, '0');
         const upload_date = `${year}-${month}-${day}`;
        console.log(req.body)
        const query = `EXEC add_puzzle @white='${white}', @black='${black}', @date='${date}', @fen='${fen}', @continuation='${continuation}', @attempts=0, @success_rate=0.0, @username='${username}', @date_uploaded='${upload_date}', @event=NULL `
        await db.query(query)
    }catch(error){
        console.log(error)
    }
   
}