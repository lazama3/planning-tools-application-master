// identifico las actividades con holguras
const actividadesConHolgura = (activityData) => {
    return activityData.filter(activity => activity.arraySlack.length > 0);
};

// calculos los recursos de cada columna
const eliminarRepetidos = (recursosPorColumna) => {
    let frecuenciaRecursos = recursosPorColumna.reduce((acc, recurso) => {
        if (recurso > 0) {
            acc[recurso] = (acc[recurso] || 0) + 1;
        }
        return acc;
    }, {});

    // Convertir a array con el formato deseado
    let response = Object.entries(frecuenciaRecursos).map(([recursos, frecuencia]) => ({
        recursos: parseInt(recursos),
        frecuencia
    }));

    // console.log(response)
    return response
}

export const calcularRecursosPorColumna = (activityData, totalDuration) => {
    let recursosPorColumna = Array.from({ length: totalDuration }, () => 0);

    activityData.forEach(activity => {
        activity.arrayDuration.forEach(col => {
            if (col >= 0 && col < totalDuration) {
                recursosPorColumna[col] += activity.resourses;
            }
        });
    });
    // console.log(recursosPorColumna)

    recursosPorColumna = eliminarRepetidos(recursosPorColumna)
    // console.log("recursos por columna: ", recursosPorColumna)
    return recursosPorColumna;
};

// calculo los cuadrados de los recursos
export const cuadradoDeRecursos = (activityData, totalDuration) => {
    let recursosPorColumna = calcularRecursosPorColumna(activityData, totalDuration)

    let response = recursosPorColumna.map(recurso => ({
        recursos: recurso.recursos ** 2,
        frecuencia: recurso.frecuencia
    }))

    // console.log("cuadrado de recursos: ", response)
    return response
}

// calculo los totales
export const multiplicarRecursosPorFrecuencia = (activityData, totalDuration) => {
    let cuadrados = cuadradoDeRecursos(activityData, totalDuration)

    let response = cuadrados.map(recurso => ({
        recursos: recurso.recursos,
        frecuencia: recurso.frecuencia,
        multiplicacion: (recurso.recursos) * recurso.frecuencia
    }))

    // console.log("Multiplicacion de recursos por frecuencias: ", response)
    return response
}

export const calcularTotal = (activityData, totalDuration) => {
    let multiplicados = multiplicarRecursosPorFrecuencia(activityData, totalDuration)
    let total = 0

    for(let multiplicado of multiplicados) {
        total = total + multiplicado['multiplicacion']
    }

    // console.log("total de la distribucion: ", total)
    return total
}

// busqueda de la mejor distribucion
const generarDistribuciones = (activityData, totalDuration) => {
    let distribuciones = [];

    const generar = (indice, actual) => {
        if (indice >= activityData.length) {
            distribuciones.push(JSON.parse(JSON.stringify(actual))); 
            return;
        }

        let actividad = activityData[indice];

        if (actividad.arraySlack.length > 0) {
            for (let desplazamiento of actividad.arraySlack) {
                let minDuracion = Math.min(...actividad.arrayDuration);
                let nuevaDuracion = actividad.arrayDuration.map(d => d - minDuracion + desplazamiento);
                let maxDuracion = Math.max(...nuevaDuracion);

                if (maxDuracion < totalDuration && nuevaDuracion.every(d => d >= 0 && d < totalDuration)) {
                    let nuevaActividad = { ...actividad, arrayDuration: nuevaDuracion };
                    actual[indice] = nuevaActividad;
                    generar(indice + 1, actual);
                }
            }
        } else {
            generar(indice + 1, actual);
        }
    };

    generar(0, JSON.parse(JSON.stringify(activityData)));
    return distribuciones;
};

export const encontrarDistribucionOptima = (activityData, totalDuration) => {
    let total_orignial = calcularTotal(activityData, totalDuration)
    let nuevo_total = 0
    let iteraciones = 0

    let distribuciones = generarDistribuciones(activityData, totalDuration);
    let mejorDistribucion = null;
    let menorOptimo = Infinity;

    for (let distribucion of distribuciones) {
        let resultado = calcularTotal(distribucion, totalDuration);
        console.log("Resultado: ", resultado)
        console.log("Resultado de calcularTotal para distribución:", resultado);

        if (resultado < menorOptimo && resultado < total_orignial) {
            menorOptimo = resultado;
            nuevo_total = resultado
            mejorDistribucion = JSON.parse(JSON.stringify(distribucion)); // Clonamos la mejor distribución
            console.log("Original: ", calcularTotal(activityData, totalDuration), " | ", "Nuevo: ", resultado)
            // console.log("distribucion actual: ", mejorDistribucion)
        }
        iteraciones += 1
    }

    if(nuevo_total === 0) {
        nuevo_total = total_orignial
    }

    // console.log("Total originial: ", calcularTotal(activityData, totalDuration))
    // console.log("Nuevo total: ", resultado)
    // console.log("Mejor distribución con menor total:", mejorDistribucion, total_orignial, nuevo_total);
    return {
        mejorDistribucion,
        total_orignial,
        nuevo_total,
        iteraciones
    }; // Retornar la mejor distribución encontrada
};
