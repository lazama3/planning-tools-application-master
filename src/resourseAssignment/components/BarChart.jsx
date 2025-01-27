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

    // const valoresX = dataset.map(data => data.x)
    // const valoresY = dataset.map(data => data.y)

    let valoresX = []
    let valoresY = []

    for(let data of dataset){
        valoresX.push(data.x)
        valoresY.push(data.y)
        console.log("x:", data.x)
        console.log("y:", data.y)
    }

    // console.log("valores de X:", valoresX)
    // console.log("valores de Y:", valoresY)

    const data = {
        // valores del eje X
        // labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        labels: valoresX,
        datasets: [
            {
                label: 'Recusos sumados',
                // valores del eje Y
                // data: [120, 150, 180, 70, 90],
                data: valoresY,
                backgroundColor: '#1976D2',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Configuración de las opciones
    const options = {
        responsive: true,
        maintainAspectRatio: true, // Mantener las proporciones
        plugins: {
            legend: {
                position: 'top', // 'top', 'bottom', 'left', 'right'
            },
            title: {
                display: true,
                text: 'Distribucion de recursos',
            },
        },
    };

    return (
        <Bar
            data={data}
            options={options}
            style={{ 
                maxWidth: '40%', 
                maxHeight: '450px' 
            }}
        />
    )
}