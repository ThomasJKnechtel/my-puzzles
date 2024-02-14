import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import formatDate from '@/utils/formatDate';
import Image from 'next/image';


export default function LobbyPuzzleTable({puzzles, setSelectedPuzzles}){
    
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
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
      resizable: true,
      flex:1
    }));
  const gridOptions = {
   
    headerHeight:30
  }

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
  

  return (
    
        
            
            <div id="AgGridContainer" className=' ag-theme-alpine w-full h-full' style={{width:'100%', height: '100%'}}>
                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API

                    rowData={rowData} // Row Data for Rows
                    
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    animateRows // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows
                    gridOptions={gridOptions}
                    onSelectionChanged={getSelectedPuzzles}
                    onGridReady={onGridReady}
                    
                    />
        </div>
     
   
  );

};

