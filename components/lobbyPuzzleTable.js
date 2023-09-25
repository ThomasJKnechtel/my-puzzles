import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import formatDate from '@/utils/formatDate';
import Image from 'next/image';


export default function LobbyPuzzleTable({puzzles, setSelectedPuzzles}){
    
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [open, setOpen] = useState(true)
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {field: 'Puzzle ID', filter: true, checkboxSelection: true, cellStyle:{'text-decoration-line':'underline', 'color':'blue'}},
    {field: 'Rating', filter: true},
    {field: 'Attempts'},
    {field: 'Success Rate'},
    {field: 'Upload Date',  filter: true, cellDataType: 'dateString'},
    {field: 'Date Played', filter: true, cellDataType: 'dateString'}
    
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo( ()=> ({
      sortable: true,
      
    }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

  // Example load data from server
  useEffect(() => {
    const data = puzzles.map(puzzle => ({
            'Puzzle ID': puzzle.puzzle_id,
            'Rating':puzzle.rating,
            'Attempts':puzzle.attempts,
            'Success Rate':puzzle.success_rate,
            'Upload Date': formatDate(puzzle.date_uploaded),
            'Date Played': formatDate(puzzle.date)
        }))
        setRowData(data)
  }, [puzzles]);

  const getSelectedPuzzles = useCallback(()=>{
    const selectedPuzzleNodes = gridRef.current.getSelectedNodes()
    const selectedPuzzles = selectedPuzzleNodes.map(node => node.data)
    setSelectedPuzzles(selectedPuzzles)
  }, [setSelectedPuzzles])

  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
   function minimize(){
    if(open){
        document.getElementById('TableContainer').style.height = "20px"
        document.getElementById('AgGridContainer').style.display = "none"
        document.getElementById('minimize').style.display = "none"
        document.getElementById('maximize').style.display = "block"
        setOpen(false)
    }
  }
  function maximize(){
    if(!open){
         document.getElementById('TableContainer').style.height = "100%"
        document.getElementById('AgGridContainer').style.display = "block"
       
        document.getElementById('minimize').style.display = "block"
        document.getElementById('maximize').style.display = "none"
        setOpen(true)
    }
  }

  return (
    
        <div id="TableContainer" className="ag-theme-alpine border-2 h-full" >
            <div className=' w-full flex flex-row items-center justify-end p-[1px]'>
                <button id="minimize" type='button' onClick={minimize} className=' w-3 h-[3px] bg-slate-400 rounded-md' > </button>
                <button id="maximize" type="button" onClick={maximize} className=' hidden' ><Image src={"https://img.icons8.com/ios-filled/50/plus-math.png"} alt="maximize" width={15} height={15}/></button>
            </div>
            <div id="AgGridContainer" className=' w-full h-full' style={{width:'100%', height: '100%'}}>
                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API

                    rowData={rowData} // Row Data for Rows
                    
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties

                    animateRows // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows
                    gridOptions={{headerHeight:30}}
                    onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    onSelectionChanged={getSelectedPuzzles}
                    onGridReady={onGridReady}
                    />
        </div>
        
      
        
      </div>
   
  );

};

