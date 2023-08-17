import { LayoutContext } from "@/components/layout";
import Layout from "@/components/layout";
import { GamesTable } from "@/components/table";
import getSocket from "@/utils/socket";

import { useEffect, useState } from "react";


export default function LoginPage({socket, setSocket}) {
  

  function generatePuzzles(gamesPgns){
    if(gamesPgns.length>0){
       window.location.href="/select_puzzles"
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
