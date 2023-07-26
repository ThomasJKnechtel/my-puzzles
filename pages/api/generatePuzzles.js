import {spawn}from "child_process"
export default function handler(req, res){
    if(req.method === "POST"){
        const { gamePgns } =req.body
        console.log( gamePgns)
        const pythonProcess = spawn('python', [process.env.WEBSITE_PATH+"/Modules/PuzzleGenerator/PuzzleGenerator.py", JSON.stringify(gamePgns)])
        let result = null
        pythonProcess.stdout.on('data', (data)=>{
            result = data.toString()
            console.log(result)
        })
        pythonProcess.stderr.on('data', (data) => {
            //res.status(500).json({error: data.toString()})
            console.error(`Error executing Python script: ${data.toString()}`);
        });
    
        pythonProcess.on('close', (code) => {
            if(code === 0){
                console.log(result)
                //res.status(200).json({puzzles: result})
            }else{
            // res.status(500).json({error: `Python script exited with code ${code}`})
                console.log(`Python script exited with code ${code}`);
            }
            
            
        });
   }
   
}
