const actividadesConHolgura = (activityData) => {
    return activityData.filter(activity => activity.arraySlack.length > 0);
};

const calcularRecursosPorColumna = (activityData, totalDuration) => {
    return Array.from({ length: totalDuration }, (_, col) => {
        return activityData.reduce((sum, activity) => {
            return activity.arrayDuration.includes(col) ? sum + activity.resources : sum;
        }, 0);
    });
};

export const calcularOptimo = (activityData, totalDuration) => {
    let recursosColumnas = calcularRecursosPorColumna(activityData, totalDuration);
    let frecuenciaRecursos = recursosColumnas.reduce((acc, recurso) => {
        if (recurso > 0) {
            acc[recurso] = (acc[recurso] || 0) + 1;
        }
        return acc;
    }, {});

    return Object.entries(frecuenciaRecursos).reduce((sum, [key, value]) => {
        return sum + (parseInt(key) ** 2) * value;
    }, 0);
};

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
    let distribuciones = generarDistribuciones(activityData, totalDuration);
    let mejorDistribucion = null;
    let menorOptimo = Infinity;

    for (let distribucion of distribuciones) {
        let resultado = calcularOptimo(distribucion, totalDuration);
        if (resultado < menorOptimo) {
            menorOptimo = resultado;
            mejorDistribucion = distribucion;
        }
    }

    // Obtener actividades con holgura
    let actividadesHolgura = actividadesConHolgura(activityData);

    // Crear una copia del activityData con las duraciones ajustadas
    let activityDataModificado = activityData.map((actividad, index) => {
        let actividadConHolgura = actividadesHolgura.find(a => a.id === actividad.id);
        if (actividadConHolgura) {
            return { ...actividad, arrayDuration: mejorDistribucion[index].arrayDuration };
        }
        return actividad;
    });

    // console.log("Distribución óptima aplicada a activityData:", activityDataModificado);
    return activityDataModificado;
};

// =======================================================================
// const actividadesConHolgura = (activityData) => {
//     return activityData.filter(activity => activity.arraySlack.length > 0);
// };

// const calcularRecursosPorColumna = (activityData, totalDuration) => {
//     return Array.from({ length: totalDuration }, (_, col) => {
//         return activityData.reduce((sum, activity) => {
//             return activity.arrayDuration.includes(col) ? sum + activity.resources : sum;
//         }, 0);
//     });
// };

// const calcular_cantidad_iteraciones = (activityData) => {
//     let filas_holgura = actividadesConHolgura(activityData);
//     return filas_holgura.reduce((total, fila) => total * fila.arraySlack.length, 1);
// };

// export const calcular_optimo = (activityData, totalDuration) => {
//     let holguras_filas = actividadesConHolgura(activityData);
//     if (holguras_filas.length === 0) {
//         console.log("No existen holguras y por ello no puede ejecutarse el código");
//         return;
//     }

//     let recursos_columnas = calcularRecursosPorColumna(activityData, totalDuration);
//     let frecuencia_recursos = recursos_columnas.reduce((acc, recurso) => {
//         if (recurso > 0) {
//             acc[recurso] = (acc[recurso] || 0) + 1;
//         }
//         return acc;
//     }, {});

//     let producto_recursos = Object.entries(frecuencia_recursos).reduce((acc, [key, value]) => {
//         let cuadrado = parseInt(key) ** 2;
//         acc[key] = cuadrado * value;
//         return acc;
//     }, {});

//     return Object.values(producto_recursos).reduce((sum, val) => sum + val, 0);
// };

// const generarDistribuciones = (activityData, totalDuration) => {
//     let distribuciones = [];

//     const generar = (indice, actual) => {
//         if (indice >= activityData.length) {
//             distribuciones.push(JSON.parse(JSON.stringify(actual))); // Guardar copia
//             return;
//         }

//         let actividad = activityData[indice];

//         if (actividad.arraySlack.length > 0) {
//             for (let desplazamiento of actividad.arraySlack) {
//                 let nuevaActividad = { 
//                     ...actividad, 
//                     arrayDuration: actividad.arrayDuration.map(d => d + desplazamiento) 
//                 };
                
//                 let maxDuracion = Math.max(...nuevaActividad.arrayDuration);

//                 if (maxDuracion < totalDuration && nuevaActividad.arrayDuration.every(d => d >= 0 && d < totalDuration)) {
//                     let nuevaActual = JSON.parse(JSON.stringify(actual));
//                     nuevaActual[indice] = nuevaActividad;
//                     generar(indice + 1, nuevaActual);
//                 }
//             }
//         } else {
//             let nuevaActual = JSON.parse(JSON.stringify(actual));
//             nuevaActual[indice] = actividad;
//             generar(indice + 1, nuevaActual);
//         }
//     };

//     generar(0, JSON.parse(JSON.stringify(activityData)));
//     return distribuciones;
// };

// export const encontrarDistribucionOptima = (activityData, totalDuration) => {
//     let distribuciones = generarDistribuciones(activityData, totalDuration);
//     let mejorDistribucion = null;
//     let menorOptimo = Infinity;

//     for (let distribucion of distribuciones) {
//         let resultado = calcular_optimo(distribucion, totalDuration);
//         if (resultado < menorOptimo) {
//             menorOptimo = resultado;
//             mejorDistribucion = distribucion;
//         }
//     }
//     console.log(mejorDistribucion);
//     return mejorDistribucion;
// };