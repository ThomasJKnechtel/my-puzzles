import { LayoutContext } from "@/components/layout/layout";
import Layout from "@/components/layout/layout";
import GamesTable from "@/components/table";



export default function LoginPage() {
  

  function generatePuzzles(gamesPgns){
    if(gamesPgns.length>0){
      sessionStorage.setItem('puzzlesGenerated', true)
       window.location.href="/select_puzzles"
    }
    
  }
  return (

      <Layout search selectPuzzles lobby>
        <GamesTable/>
        <LayoutContext.Consumer>
          {
            (context)=>(context.gamesPgns.length!==0? (
                <div className='w-full inline-flex flex-row justify-center'>
                    
                         <button type="button" onClick ={()=>{generatePuzzles(context.gamesPgns)}} className="button-3 green text-l font-semibold">
                            Generate Puzzles
                        </button>
                    
                       
              </div>):(
                <div className='flex w-full h-full justify-center'><label >Search by player username, opponent name, date or time control to generate puzzles</label></div>
              )
              )
          }
          
        </LayoutContext.Consumer>
        
      </Layout>
    
  
    
  );
}
