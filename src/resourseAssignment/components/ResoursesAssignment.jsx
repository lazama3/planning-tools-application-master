import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { encontrarDistribucionOptima, calcularOptimo } from "./distribucion_optima";
import { calcularRecursosPorColumna, cuadradoDeRecursos, multiplicarRecursosPorFrecuencia, calcularTotal, encontrarDistribucionOptima } from "./distribucion_optimav2";
import {
	Grid,
	Box,
	Divider,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Button,
} from "@mui/material";

// import { BarChart } from "@mui/x-charts/BarChart;
import { BarChart } from "./BarChart";

import { Toolbar } from "../../shared/ui";
import { selectActivitiesWithoutExtremes } from "../../shared/store/slices/activity";
import { selectProcessed } from "../../shared/store/slices/planning/planning.slice";
import { FormatAlignJustify } from "@mui/icons-material";

const AsignacionRecursos = () => {
	const isProcessed = useSelector(selectProcessed);
	const activities = useSelector(selectActivitiesWithoutExtremes).reverse();

	const initialActivityData = activities.map((activity) => {
		const earlyStart = parseInt(activity.earlyStart, 10);
		const duration = parseInt(activity.duration, 10);
		const arrayDuration = Array.from({ length: duration }, (_, i) => earlyStart + i);

		const slack = parseInt(activity.slack, 10);
		const earlyFinish = parseInt(activity.earlyFinish, 10);
		const arraySlack = Array.from({ length: slack }, (_, i) => earlyFinish + i);
		return {
			id: activity.id,
			name: activity.name,
			arrayDuration,
			arraySlack,
			resourses: 0,
		};
	});

	const [activityData, setActivityData] = useState(initialActivityData);
	const [totalOriginal, setTotalOriginal] = useState(0)
	const [nuevoTotal, setNuevoTotal] = useState(0)
	const [iteraciones, setIteraciones] = useState(0)

	const handleResoursesChange = (id, newResourses) => {
		setActivityData((prevData) =>
			prevData.map((activity) =>
				activity.id === id ? { ...activity, resourses: newResourses } : activity
			)
		);
	};

	let totalDuration = activityData[activityData.length - 1].arraySlack[activityData[activityData.length - 1].arraySlack.length - 1] + 1;

	if (isNaN(totalDuration)) {
		totalDuration = activityData[activityData.length - 1].arrayDuration[activityData[activityData.length - 1].arrayDuration.length - 1] + 1;
	}

	const columns = Array.from({ length: totalDuration }, (_, i) => i);

	// Create dataset for resources per column
	const dataset = columns.map((col) => {
		const totalResources = activityData.reduce((sum, activity) => {
			return activity.arrayDuration.includes(col) ? sum + activity.resourses : sum;
		}, 0);
		return { x: col, y: totalResources };
	});

	// console.log(dataset); // Log the dataset to verify

	const handleTest = () => {
		let distribucion = encontrarDistribucionOptima(activityData, totalDuration)
		const { mejorDistribucion, nuevo_total, total_orignial, iteraciones } = distribucion

		mejorDistribucion != null ? setActivityData(mejorDistribucion) : null

		total_orignial != null ? setTotalOriginal(total_orignial) : null
		nuevoTotal != null ? setNuevoTotal(nuevo_total) : null
		iteraciones != null ? setIteraciones(iteraciones) : null

		console.log(mejorDistribucion != null ? mejorDistribucion : null)
	}

	const handleReset = () => {
		setActivityData(initialActivityData)
		// mejorDistribucion = null
		setTotalOriginal(0)
		setNuevoTotal(0)
		setIteraciones(0)
	}

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
			<Toolbar title="Asignacion de recursos" previousPage="/paths" previousPageTitle="Resultados" />
			<Box textAlign="center" mt={1}>
				<Typography variant="subtitle1">Algoritmo de Burgess-Killebrew</Typography>
			</Box>
			<Box textAlign="start" padding={1}>
				<Typography variant="subtitle1">Diagrama de Gantt</Typography>
			</Box>
			<TableContainer component={Paper} sx={{ padding: 2 }}>
				<Table align="center" sx={{ alignItems: 'center' }} >
					<TableHead>
						<TableRow>
							<TableCell align="center" sx={{ padding: 0, border: '1px solid #ddd', height: '10px', width: '90px', alignItems: 'center' }}>Actividad</TableCell>
							<TableCell align="center" sx={{ padding: 0, border: '1px solid #ddd', height: '10px', width: '90px', alignItems: 'center' }}>Recursos</TableCell>
							{columns.map((col) => (
								<TableCell key={col} align="center" sx={{ padding: 0, border: '1px solid #ddd', height: '10px', alignItems: 'center' }}>
									{col}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{activityData.map((activity) => (
							<TableRow key={activity.id}>
								<TableCell align="center" sx={{ padding: 0, border: '1px solid #ddd', height: '10px', alignItems: 'center' }}>{activity.name}</TableCell>
								<TableCell align="center" sx={{ padding: 0, border: '1px solid #ddd', height: '10px', alignItems: 'center' }}>
									<TextField
										type="number"
										value={activity.resourses}
										onChange={(e) => {
											const newResourses = parseInt(e.target.value, 10);
											handleResoursesChange(activity.id, isNaN(newResourses) ? 0 : newResourses);
										}}
										inputProps={{ min: 0 }}
										sx={{ width: '60px', padding: 0 }}
									/>
								</TableCell>
								{columns.map((col) => (
									<TableCell key={col} align="center" sx={{
										padding: 0,
										border: '1px solid #ddd',
										alignItems: 'center',
										height: '10px',
										width: '90px',
										backgroundColor: activity.arrayDuration.includes(col) ? '#C6E2B5' : activity.arraySlack.includes(col) ? '#87CEEB' : 'transparent'
									}}>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Divider />

			<Box textAlign="center" mt={2}>
				<Typography variant="subtitle1">Grafico de recursos</Typography>
			</Box>
			<Grid
				container
				direction="row"
				sx={{
					justifyContent: "center",
					alignItems: "flex-start",
					marginTop: "10px"
				}}
			>
				<Grid item xs={6}>
					<Box padding={1}>
						<div
							style={{
								width: "90%",
								height: "90%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<BarChart dataset={dataset} />
						</div>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box padding={1}>
						{/* <Button variant="outlined" fullWidth color="success" onClick={() => encontrarDistribucionOptima(activityData, totalDuration)}> */}
						{/* <Button variant="outlined" fullWidth color="success" onClick={handleEncontrarDistribucionOptima}> */}
						{/* Buscar asignación de recursos optima
						</Button> */}
						{/* testeo */}
						<Button variant="outlined" fullWidth color="success" onClick={handleTest}>
							Buscar optimo
						</Button>
					</Box>
					<Box justifyContent='start' alignItems='start'>
						<Box padding={1}>
							<Typography variant="subtitle1" textAlign='center'>
								Resultados
							</Typography>
						</Box>
						<Typography variant="subtitle1">
							Iteraciones realizadas: <strong>{iteraciones}</strong>
						</Typography>
						<Typography variant="subtitle1">
							Algoritmo de Burgess-Killebrew de la distribucion orignial: <strong>{totalOriginal}</strong>
						</Typography>
						<Typography variant="subtitle1">
							Algoritmo de Burgess-Killebrew de la nueva distribucion: <strong>{nuevoTotal}</strong>
						</Typography>
					</Box>
					<Box padding={1}>
						<Button variant="outlined" fullWidth color="success" onClick={handleReset}>
							Reiniciar
						</Button>
					</Box>
				</Grid>
			</Grid>
		</div>
	);
};

export default AsignacionRecursos;