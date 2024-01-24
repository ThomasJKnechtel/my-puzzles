import { getServerSession } from "next-auth";

// eslint-disable-next-line import/no-unresolved, import/extensions

import db from "@/utils/dbConnect";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../auth/[...nextauth]";


export default async function addPuzzle(req, res){
    try{
        const token = await getToken({req, secret: authOptions.secret })
        if(token){
            
                const { white, black, date, continuation, fen, turn, username} = req.body
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.getDate().toString().padStart(2, '0');
                const uploadDate = `${year}-${month}-${day}`;
                const query = `DECLARE @new_puzzle_id int; EXEC add_puzzle @white='${white}', @black='${black}', @date='${date}', @fen='${fen}', @continuation='${JSON.stringify(continuation)}', @attempts=0, @success_rate=0.0, @username='${username}', @date_uploaded='${uploadDate}', @event=NULL, @turn=${turn},  @puzzle_id = @new_puzzle_id OUTPUT;`
                const result = await db.query(query)
                res.json(result)
            
        }else{
            console.log('not logged in')
            res.status(401).send()
        }
    }catch(error){
        console.log(error)
        res.status(300).send()
    }
   
}