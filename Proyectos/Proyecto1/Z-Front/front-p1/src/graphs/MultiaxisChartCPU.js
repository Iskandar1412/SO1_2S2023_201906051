import React from "react";
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from "react-chartjs-2";
//import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        //mode: 'index' as const, 
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Grafica CPU a lo Largo del tiempo'
        },
    },
    scales: {
        y: {
            //type: 'linear' as const,
            display: true,
        },
        y1: {
            display: true,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};
/*
var data  = {
    labels: ['en', 'feb', 'mar', 'abr', 'may', 'jun'],
    datasets: [
        {
            label: 'G1',
            data: [100, 20, 30, 50, 700, 20],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y',
        },
        {
            label: 'G2',
            data: [5, 70, 10, 500, 40, 90],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.2)',
            yAxisID: 'y',
        },
    ],
};
*/

export default function MultiaxisChartCPU({ dato }) {
    return (
        <div className="multi-chart-container">
            <Line data={dato} options={options} />
        </div>
    );
}