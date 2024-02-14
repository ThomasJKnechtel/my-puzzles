import { AgChartsReact } from "ag-charts-react"
import { useState } from "react"

export default function RatingChart({ data, lastUpdated }) {
    let chartData = []
    if(data){
        chartData = data.map((rating, index)=>({Session: index, Rating: rating}))
    }
    
  const [chartOptions, setChartOptions] = useState({
    
    data: chartData,
    title: {text: 'Puzzle Duel Rating Change'},
    subtitle:{text: `Last Updated: ${lastUpdated}`},
    axes: [
        { type: "number", position: "left", title: { text: "Rating" } },
        { type: "category", position: "bottom", title: { text: "Session" } },
      ],
      background: {
        fill: 'rgb(235, 245, 255)',
    },
    series: [{ type: 'line', xKey: 'Session', yKey: 'Rating'}],

    overlays: {
        noData: {
          text: "No data to display",
        },
      },
    width:380,
    height:300
  });

  return (
    // AgCharsReact component with options passed as prop
    <AgChartsReact options={chartOptions} />
  );
}