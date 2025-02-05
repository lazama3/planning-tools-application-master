import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar los componentes requeridos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = ({ dataset }) => {

    let valoresX = []
    let valoresY = []

    for(let data of dataset){
        valoresX.push(data.x)
        valoresY.push(data.y)
    }

    const data = {
        labels: valoresX,
        datasets: [
            {
                label: '', 
                data: valoresY,
                backgroundColor: '#C6E2B5',
                borderColor: '#C6E2B5',
                borderWidth: 1,
            },
        ],
    };

    // Configuración de las opciones
    const options = {
        responsive: true,
        maintainAspectRatio: true, // Mantener las proporciones
        scales: {
            y: {
                min: 0,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <Bar
            data={data}
            options={options}
        />
    )
}