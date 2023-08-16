import { LayoutContext } from "@/components/layout";
import Layout from "@/components/layout";
import { GamesTable } from "@/components/table";
import io from 'socket.io-client'
import { useEffect, useState } from "react";

let socket
export default function LoginPage() {
  
  useEffect(() => {
    fetch('http://localhost:5050/getPuzzles').finally(() => {
      socket = io('http://localhost:5050')

      socket.on('puzzles', puzzles=>{
        let puzzleList
        if(puzzleList = sessionStorage.getItem('puzzles')){
          sessionStorage.setItem('puzzles', puzzleList.concat(puzzles))
        }else{
          sessionStorage.setItem('puzzles', puzzles)
        }
      })
      socket.on('disconnect', () => {
        console.log('disconnect')
      })
    })
  }, []) 
  
  function generatePuzzles(gamesPgns){
    if(gamesPgns.length>0){
       socket.emit('gamesPgns', JSON.stringify(gamesPgns))
    }
   
  }
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
