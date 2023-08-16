import { Server } from 'socket.io'
import { spawn } from 'child_process'


const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)

    io.on('connection', socket => {
     
      socket.on('hello', msg => {
        socket.emit('hello', 'world!')
      })

      socket.on('gamesPgns', async gamePgns =>{
        console.log('test')
       
        
    })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

async function generatePuzzles(gamePgns){
  
    console.log('test');
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [process.env.WEBSITE_PATH+"/Modules/PuzzleGenerator/PuzzleGenerator.py", JSON.stringify(gamePgns)]);
      let result = null;
  
      pythonProcess.stdout.on('data', (data) => {
        result = data.toString();
        console.log(result);
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error executing Python script: ${data.toString()}`);
        reject(data.toString());
      });
  
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          console.log(result);
          resolve(result);
        } else {
          console.log(`Python script exited with code ${code}`);
          reject(`Python script exited with code ${code}`);
        }
      });
    });
  }
  

export default ioHandler