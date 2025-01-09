import React, { useState } from "react";
import { useSelector } from "react-redux";

import { 
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
 } from "@mui/material";
import { Toolbar } from "../../shared/ui";
import { selectActivitiesWithoutExtremes } from "../../shared/store/slices/activity";
import { selectProcessed } from "../../shared/store/slices/planning/planning.slice";
import { FormatAlignJustify } from "@mui/icons-material";

const AsignacionRecursos = () => {
	const isProcessed = useSelector(selectProcessed);
	const activities = useSelector(selectActivitiesWithoutExtremes).reverse();

  const activityData = activities.map((activity) => {
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
		};
	});
  
  let totalDuration = activityData[activityData.length - 1].arraySlack[activityData[activityData.length - 1].arraySlack.length - 1] + 1;
	
	const columns = Array.from({ length: totalDuration }, (_, i) => i);

  return (
    <>
    <Toolbar title="Asignacion de recursos" previousPage="/paths" previousPageTitle="Resultados" />
    <Box textAlign="center" display="flex" flexDirection="column" gap={2}>

    </Box>
    <Box textAlign="center" mt={1}>
      <Typography variant="subtitle1">Algoritmo de Burgess-Killebrew</Typography>
    </Box>
    <Box textAlign="start" padding={1}>
      <Typography variant="subtitle1">Diagrama de Gantt</Typography>
    </Box>
    {/* <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <TableContainer component={Paper} sx={{ padding: 2}}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: 0, border: '1px solid #ddd', height: '10px'}}>Actividad</TableCell>
              {columns.map((col) => (
                <TableCell key={col} align="center" sx={{ padding: 0, border: '1px solid #ddd', height: '10px' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activityData.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell sx={{ padding: 0, border: '1px solid #ddd', height: '10px'}}>{activity.name}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col} align="center" sx={{
                    padding: 0,
                    border: '1px solid #ddd',
                    height: '10px',
                    backgroundColor: activity.arrayDuration.includes(col) ? '#C6E2B5' : activity.arraySlack.includes(col) ? '#87CEEB' : 'transparent'
                  }}>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box> */}
      
      {console.log(activityData[activityData.length - 1].arraySlack.length)}
      {console.log(activityData[activityData.length - 1].arraySlack)}  
      {console.log(activityData)}  
			{console.log(activities)}
			{console.log(totalDuration)} 

    <Divider/>
    </>
  );
};

export default AsignacionRecursos;