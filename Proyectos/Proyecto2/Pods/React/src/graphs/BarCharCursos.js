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
    indexAxis:'y',
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Cursos con Mayor Número de Alumnos',
            font: {
                size: 20,
            }
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                color: 'rgba(150, 150, 150, 0.2)', // Cambia el color de las líneas del grid en el eje X
            },
            ticks: {
                color: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)'
                ],
            }
        },
        y: {
            stacked: true,
            grid: {
                color: 'rgba(150, 150, 150, 0.2)', // Cambia el color de las líneas del grid en el eje X
            },
        },
    },

};

export default function BarCharCursos({ dato }) {
    return (
        <div className="bar-char-alumno-container">
            <Bar data ={dato} options={options} />
        </div>
    );
}

/*
<PieChartCPU dato={charDataCPU} />
                            <BarCharAlumnos dato={charAlumnos} />
                            <BarCharCursos dato={charCursos} />
*/