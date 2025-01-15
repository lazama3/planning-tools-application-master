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

export const BarChart = () => {
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [
            {
                label: 'Ventas',
                data: [120, 150, 180, 70, 90],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Configuración de las opciones
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // 'top', 'bottom', 'left', 'right'
            },
            title: {
                display: true,
                text: 'Gráfico de Barras - Ventas Mensuales',
            },
        },
    };

    return <Bar data={data} options={options}/>
}