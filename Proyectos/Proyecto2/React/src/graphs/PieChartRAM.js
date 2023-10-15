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
            text: 'Grafica RAM (Tiempo Real)',
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
            label: 'Grafica RAM',
            data: [70, 30],
            backgroundColor: [
                'rgba(42, 167, 124, 0.7)',
                'rgba(42, 111, 167, 0.7)',
            ],
            borderColor: [
                'rgba(42, 167, 124, 1)',
                'rgba(42, 111, 167, 1)',
            ],
            borderWidth: 1,
        }
    ]
}
*/

export default function PieChartRAM({ dato }) {
    return (
        <div className="pie-chart-container">
            <Pie data={dato} options={options} />
        </div>
    );
}