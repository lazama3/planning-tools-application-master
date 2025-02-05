import React, { useState } from "react";
import { useSelector } from "react-redux";

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

	console.log(dataset); // Log the dataset to verify

	return (
		<div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
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
						style={{ width: "90%",
								 height: "90%", 
								 display: "flex", 
								 justifyContent: "center", 
								 alignItems: "center" }}
					>
						<BarChart dataset={dataset} />
					</div>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box padding={1}>
						<Button variant="outlined" fullWidth color="success">
							Buscar asignación de recursos optima
						</Button>
					</Box>
					<Box padding={1}>
						<Typography variant="subtitle1" textAlign='center'>
							Resultados
						</Typography>
					</Box>
					<Box justifyContent='start' alignItems='start'>
						<Typography variant="subtitle1">
							Cantidad de iteraciones:
						</Typography>
						<Typography variant="subtitle1">
							Numero de iteracion actual: 
						</Typography>
						<Typography variant="subtitle1">
							Cantidad promedio de recursos asignados:
						</Typography>
					</Box>
				</Grid>
			</Grid>			
		</div>
	);
};

export default AsignacionRecursos;