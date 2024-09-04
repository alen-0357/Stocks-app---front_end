import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

const StockRealtimeChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:5000/api/stock-data');
            updateChartData(result.data);
        };

        fetchData();

        const interval = setInterval(async () => {
            const result = await axios.get('http://localhost:5000/api/update-price');
            updateChartData(result.data);
        }, 300000); // Update every minute 60000 - 1 min , 5 min - 300000

        return () => clearInterval(interval);
    }, []);

    const updateChartData = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Invalid data format or empty data array:', data);
            return;
        }
    
        const formattedData = {
            labels: data.map(d => format(new Date(d.date), 'yyyy-MM-dd HH:mm:ss')),
            datasets: [
                {
                    label: 'Stock Price',
                    data: data.map(d => d.price),
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        };
        setChartData(formattedData);
    };

    return (
        <div>
            <h2 align="center">Real-Time Stock Price</h2>
            {chartData.labels ? (
                <Line 
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    tooltipFormat: 'dd, MMM HH:mm a', // Tooltip format
                                    displayFormats: {
                                        minute: 'dd, MMM HH:mm a', // Display format for x-axis
                                    },
                                },
                                ticks: {
                                    callback: function(value) {
                                        return format(new Date(value), 'dd, MMM '); // Custom tick format
                                    },
                                },
                                title: {
                                    display: true,
                                    text: 'Date',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Price',
                                },
                            },
                        },
                    }}
                />
            ) : (
                <p>Loading chart data...</p>
            )}
        </div>
    );
};

export default StockRealtimeChart;
