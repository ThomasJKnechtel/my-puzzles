import { LayoutContext } from "@/components/layout";
import Layout from "@/components/layout";
import { GamesTable } from "@/components/table";
import io from 'socket.io-client'
import { useEffect } from "react";

export default function LoginPage() {
 
  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      const socket = io('http://localhost:3000')

      socket.on('connect', () => {
        console.log('connect')
        socket.emit('hello')
      })

      socket.on('hello', data => {
        console.log('hello', data)
      })

      socket.on('a user connected', () => {
        console.log('a user connected')
      })

      socket.on('disconnect', () => {
        console.log('disconnect')
      })
    })
  }, []) 
  
 
  return (

      <Layout search >
        <GamesTable></GamesTable>
        <LayoutContext.Consumer>
          {
            (context)=>{
              return (context.gamesPgns.length!==0? (
                <div className='w-full inline-flex flex-row justify-center'>
                    
                         <button onClick ={()=>{generatePuzzles(context.gamesPgns)}} className="button-3 green text-l font-semibold">
                            Generate Puzzles
                        </button>
                    
                       
              </div>):(
                <div className='flex w-full h-full justify-center'><label >Search by player username, opponent name, date or time control to generate puzzles</label></div>
              )
              )
            }
          }
          
        </LayoutContext.Consumer>
        
      </Layout>
    
  
    
  );
}
