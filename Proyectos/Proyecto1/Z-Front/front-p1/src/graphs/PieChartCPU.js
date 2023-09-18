import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
var options = {
    responsive: true,
    maintainAspectRatio: false,
};

var data = {
    labels: ['C', 'D'],
    datasets: [
        {
            label: 'Grafica CPU',
            data: [70, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        }
    ]
}

export default function PieChartCPU({dato}) {
    return (
        <div className="pie-chart-container">
            <Pie data={dato} options={options} />
        </div>
    )
}