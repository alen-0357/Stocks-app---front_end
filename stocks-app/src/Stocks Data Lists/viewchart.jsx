// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import { IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close"
// import { Chart, TimeScale, registerables } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import { format } from 'date-fns';

// Chart.register(TimeScale, ...registerables);


// const StockPriceChart = ({ currentDate, closeEvent }) => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: 'Past Prices',
//         data: [],
//         borderColor: 'blue',
//         backgroundColor: 'rgba(0, 0, 255, 0.1)',
//         borderWidth: 1
//       },
//       {
//         label: 'Future Prices',
//         data: [],
//         borderColor: 'red',
//         backgroundColor: 'rgba(255, 0, 0, 0.1)',
//         borderWidth: 1
//       }
//     ]
//   });



//   const generatePastPrices = () => {
//     const pastPrices = [];
//     const currentDate = new Date();
//     for (let i = 10; i > 0; i--) {
//       const date = new Date(currentDate);
//       date.setDate(date.getDate() - i);
//       if (date < currentDate) {
//         const price = Math.random() * 100;
//         pastPrices.push({ date: format(date, 'yyyy-MM-dd'), price });
//       }
//     }
//     return pastPrices;
//   };
  
//   const generateFuturePrices = () => {
//     const futurePrices = [];
//     const currentDate = new Date();
//     for (let i = 0; i < 10; i++) {
//       const date = new Date(currentDate);
//       date.setDate(date.getDate() + i + 1);
//       if (date > currentDate) {
//         const price = Math.random() * 100;
//         futurePrices.push({ date: format(date, 'yyyy-MM-dd'), price });
//       }
//     }
//     return futurePrices;
//   };

// const updateChartData = () => {
//   const newPastPrices = generatePastPrices();
//   const newFuturePrices = generateFuturePrices();
//     setChartData({
//       labels: [
//         ...newPastPrices.map(price => price.date),
//         ...newFuturePrices.map(price => price.date)
//       ],
//       datasets: [
//         {
//           ...chartData.datasets[0],
//           data: newPastPrices.map(price => price.price)
//         },
//         {
//           ...chartData.datasets[1],
//           data: newFuturePrices.map(price => price.price),
//           borderColor: 'green',
//           backgroundColor: 'rgba(0, 255, 0, 0.1)'
//         }
//       ]
//     });
//   };

//   useEffect(() => {
//     console.log(currentDate);
//     updateChartData();
    
//   }, [currentDate]); // Run once on initial render

//   return (

//     <div>
//       <IconButton
//         style={{ position: "absolute", top: "0", right: "0" }}
//         onClick={closeEvent}
//       >
//         <CloseIcon />
//       </IconButton>
//       <Line
//         data={chartData}
//         options={{
//           plugins: {
//             datalabels: {
//               display: false
//             }
//           },
//           scales: {
//             x: {
//               type: 'time',
//               time: {
//                 unit: 'day',
//                 min: currentDate // Set the minimum value to the current date
//               },
//               title: {
//                 display: true,
//                 text: 'Date'
//               }
//             },
//             y: {
//               title: {
//                 display: true,
//                 text: 'Price'
//               }
//             }
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default StockPriceChart;
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from 'date-fns';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const StockPriceChart = ({ currentDate, closeEvent }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Past Prices',
        data: [],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderWidth: 1,
      },
      {
        label: 'Future Prices',
        data: [],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 1,
      },
      
    ],
  });

  const generatePrices = () => {
    const currentDateObj = new Date(currentDate);
    const pastPrices = [];
    const futurePrices = [];

    // Generate past prices
    for (let i = 10; i >= 0; i--) {
      const date = new Date(currentDateObj);
      date.setDate(date.getDate() - i);
      pastPrices.push({ x: date, y: Math.random() * 100 });
    }

    // Generate future prices
    for (let i = 0; i <= 10; i++) {
      const date = new Date(currentDateObj);
      date.setDate(date.getDate() + i + 1);
      futurePrices.push({ x: date, y: Math.random() * 100 });
    }

    setChartData({
      datasets: [
        {
          ...chartData.datasets[0],
          data: pastPrices,
        },
        {
          ...chartData.datasets[1],
          data: futurePrices,
        },
      ],
    });
  };

  useEffect(() => {
    generatePrices();
  }, [currentDate]); // Run whenever currentDate changes

  return (
    <div>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Line
        data={{
          datasets: chartData.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(point => ({ x: point.x, y: point.y })),
          })),
        }}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return format(tooltipItems[0].parsed.x, 'yyyy-MM-dd');
                  
                },
                label: (tooltipItem) => {
                  return `₹${tooltipItem.formattedValue}`;
                  
                }
              }
            },
            
          },
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: {
                  day: 'yyyy-MM-dd'
                }
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price'
              }
            }
          },
          
        }}
      />
    </div>
  );
};

export default StockPriceChart;
