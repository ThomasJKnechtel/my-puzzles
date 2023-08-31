import db from "@/utils/dbConnect"

export default async function getRandomPuzzle(req, res){
    try{
        const {lastPuzzle, secondLastPuzzle, thirdLastPuzzle} = req.body
  
        const query = `EXEC getRandomPuzzle @lastPuzzle=${lastPuzzle}, @secondLastPuzzle=${secondLastPuzzle}, @thirdLastPuzzle=${thirdLastPuzzle}`
        const result = (await db.query(query)).recordset
        const puzzle_id = result[0].puzzle_id
        
        res.send(puzzle_id)
    }catch(err){
        console.log(err)
        res.status(300).send()
    }
    
}