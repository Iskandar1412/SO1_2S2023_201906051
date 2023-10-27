import React from "react";
import {
    Chart as chartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

chartJS.register (
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const options = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Alumnos con Mejor Promedio',
            font: {
                size: 20,
            }
        },
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },

};

const charAlumnos = {
    labels: ['1er', '2do', '3er'],
    datasets: [
        {
            label: '1°',
            data: [25, 10, 15],
            backgroundColor: [
                'rgba(160, 115, 29, 0.7)',
            ],
        },
        {
            label: 'e',
            data: [30, 12, 16],
            backgroundColor: [
                'rgba(29, 160, 96, 0.7)',
            ],
        },
        {
            label: '3°',
            data: [40, 22, 25],
            backgroundColor: [
                'rgba(78, 207, 29, 0.7)',
            ],
        },
    ],
};

export default function MultiDataBar() {
    return (
        <div className="bar-char-alumno-container">
            <Bar data ={charAlumnos} options={options} />
        </div>
    );
}