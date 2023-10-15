import React from "react";
import { 
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Title,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Grafica CPU (Tiempo Real)',
            font: {
                size: 24,
            }
        },
    },
    maintainAspectRatio: false,
};
/*
var data = {
    labels: ['C', 'D'],
    datasets: [
        {
            label: 'Grafica CPU',
            data: [70, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        }
    ]
}
*/

export default function PieChartCPU({dato}) {
    return (
        <div className="pie-chart-container">
            <Pie data={dato} options={options} />
        </div>
    );
}