import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";

export default function CustomTable() {
  const [rows, setRows] = useState(3); // Por defecto 3 filas (S1, S2, S3)
  const [columns, setColumns] = useState(4); // Por defecto 4 columnas (D1, D2, D3, D4)
  const [anchorEl, setAnchorEl] = useState(null);
  const [method, setMethod] = useState(null);
  const [maxBenefit, setMaxBenefit] = useState(null);
  const createInitialTableData = (rows, columns) => {
    let data = [];
    for (let i = 0; i < rows; i++) {
      data.push({ values: Array(columns).fill(0), supply: 0 });
    }
    return {
      rows: data,
      demand: Array(columns).fill(0),
    };
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [tableData, setTableData] = useState(
    createInitialTableData(rows, columns)
  );
  const [solution, setSolution] = useState(false);

  const handleSolve = (selectedMethod) => {
    console.log(tableData);
    const demand = tableData.demand;
    const supply = tableData.rows.map((el) => el.supply);
    const costs = tableData.rows.map((el) => el.values);
    console.log(costs);
    let newSolution;
    if (selectedMethod === "Esquina noroeste") {
      console.log("northwest");
      newSolution = northWestCorner(supply, demand, costs);
    }
    if (selectedMethod === "Menor Costo") {
      console.log("least cost");
      newSolution = leastCostMethod(supply, demand, costs);
      console.log("newSolution");
      console.log(newSolution);
    }
    console.log("newSolution");
    console.log(newSolution);
    setSolution(newSolution);
    const objVal = calculateObjectiveValue(tableData, newSolution);
    console.log(objVal);
    setMaxBenefit(objVal);
    // console.log(newSolution);
  };
  const handleCellValueChange = (rowIndex, colIndex, newValue) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      newData.rows[rowIndex].values[colIndex] = parseFloat(newValue) || 0;
      return newData;
    });
  };

  const handleSupplyChange = (rowIndex, newValue) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      newData.rows[rowIndex].supply = parseFloat(newValue) || 0;
      return newData;
    });
  };

  const handleDemandChange = (colIndex, newValue) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      newData.demand[colIndex] = parseFloat(newValue) || 0;
      return newData;
    });
  };
  const northWestCorner = (supply, demand, costs) => {
    const solution = Array.from({ length: supply.length }, () =>
      Array(demand.length).fill(0)
    );
    let supplyLeft = [...supply];
    let demandLeft = [...demand];

    let i = 0,
      j = 0;

    while (i < supply.length && j < demand.length) {
      const possibleAllocation = Math.min(supplyLeft[i], demandLeft[j]);

      solution[i][j] = possibleAllocation;

      supplyLeft[i] -= possibleAllocation;
      demandLeft[j] -= possibleAllocation;

      if (supplyLeft[i] === 0) i++;
      if (demandLeft[j] === 0) j++;
    }

    return solution;
  };
  const findLeastCostCell = (costs, supply, demand) => {
    let minCost = Infinity;
    let coordinates = { i: -1, j: -1 };

    for (let i = 0; i < costs.length; i++) {
      for (let j = 0; j < costs[0].length; j++) {
        if (costs[i][j] < minCost && supply[i] > 0 && demand[j] > 0) {
          minCost = costs[i][j];
          coordinates = { i, j };
        }
      }
    }
    return coordinates;
  };

  function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
  const leastCostMethod = (costs, supply, demand) => {
    let solution = Array.from({ length: supply.length }, () =>
      Array(demand.length).fill(0)
    );

    let remainingSupply = [...supply];
    let remainingDemand = [...demand];

    while (
      remainingSupply.some((s) => s > 0) &&
      remainingDemand.some((d) => d > 0)
    ) {
      let { i, j } = findLeastCostCell(costs, remainingSupply, remainingDemand);
      console.log("i,j");
      console.log(i, j);
      let amount = Math.min(remainingSupply[i], remainingDemand[j]);
      console.log("amount");
      console.log(amount);
      solution[i][j] = amount;
      remainingSupply[i] -= amount;
      remainingDemand[j] -= amount;

      if (remainingSupply[i] === 0) {
        for (let k = 0; k < costs[0].length; k++) {
          costs[i][k] = Infinity; // To ignore this row in future iterations.
        }
      }

      if (remainingDemand[j] === 0) {
        for (let k = 0; k < costs.length; k++) {
          costs[k][j] = Infinity; // To ignore this column in future iterations.
        }
      }
    }

    console.log("solution");
    console.log(transpose(solution));
    return transpose(solution);
  };
  const calculateObjectiveValue = (tableData, assignmentMatrix) => {
    let objectiveValue = 0;
    for (let i = 0; i < tableData.rows.length; i++) {
      for (let j = 0; j < tableData.rows[i].values.length; j++) {
        objectiveValue += tableData.rows[i].values[j] * assignmentMatrix[i][j];
      }
    }
    return objectiveValue;
  };
  useEffect(() => {
    setTableData(createInitialTableData(rows, columns));
  }, [rows, columns]);

  const SolutionTable = ({ solution }) => {
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {solution[0].map((_, index) => (
                <TableCell key={index}>{`D${index + 1}`}</TableCell>
              ))}
              <TableCell>Supply</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solution.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{`S${rowIndex + 1}`}</TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    style={{
                      background: cell ? "dodgerblue" : "inherit",
                    }}
                    key={cellIndex}
                  >
                    {cell}
                  </TableCell>
                ))}
                <TableCell>
                  {row.reduce((acc, curr) => acc + curr, 0)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Demand</TableCell>
              {solution[0].map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  {solution.reduce(
                    (acc, currRow) => acc + currRow[columnIndex],
                    0
                  )}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  };

  return (
    <div>
      <div>
        <TextField
          label="Número de Filas"
          type="number"
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
        />
        <TextField
          label="Número de Columnas"
          type="number"
          value={columns}
          onChange={(e) => setColumns(parseInt(e.target.value))}
        />
      </div>
      <Paper elevation={3} style={{ maxWidth: "80%", margin: "50px auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#7d90a2" }}>
              <TableCell
                align="center"
                style={{ color: "white", fontWeight: "bold" }}
              >
                S/D Name
              </TableCell>
              {Array.from({ length: columns }, (_, colIndex) => (
                <TableCell
                  key={colIndex}
                  align="center"
                  style={{ color: "white", fontWeight: "bold" }}
                >{`D${colIndex + 1}`}</TableCell>
              ))}
              <TableCell
                align="center"
                style={{ color: "white", fontWeight: "bold" }}
              >
                Supply
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                style={{
                  background: rowIndex % 2 === 0 ? "#8db2cc" : "#4d6b85",
                }}
              >
                <TableCell align="center">{`S${rowIndex + 1}`}</TableCell>
                {row.values.map((value, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <TextField
                      value={value}
                      onChange={(e) =>
                        handleCellValueChange(
                          rowIndex,
                          colIndex,
                          e.target.value
                        )
                      }
                      type="number"
                    />
                  </TableCell>
                ))}
                <TableCell align="center">
                  <TextField
                    value={row.supply}
                    onChange={(e) =>
                      handleSupplyChange(rowIndex, e.target.value)
                    }
                    type="number"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow style={{ background: "#7d90a2" }}>
              <TableCell
                align="center"
                style={{ color: "white", fontWeight: "bold" }}
              >
                Demand
              </TableCell>
              {tableData.demand.map((value, colIndex) => (
                <TableCell key={colIndex} align="center">
                  <TextField
                    value={value}
                    onChange={(e) =>
                      handleDemandChange(colIndex, e.target.value)
                    }
                    type="number"
                  />
                </TableCell>
              ))}
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Button onClick={handleClick}>Resolver Problema</Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            // solveEsquinaNoroeste();
            handleSolve("Esquina noroeste");
            setMethod("Esquina noroeste");
          }}
        >
          Solución de Esquina Noroeste
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            handleSolve("Menor Costo");
            setMethod("Menor Costo");
          }}
        >
          Solución de Comienzo por Menor Costo
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            solveMetodoVoguel();
          }}
        >
          Solución del Método de Voguel
        </MenuItem>
      </Menu>
      {/* <button onClick={handleSolve}>Resolver</button> */}
      {solution ? (
        <>
          <SolutionTable solution={solution} />
          <Typography variant="h6" component="h2">
            Metodo: {method} | Beneficio maximo: {maxBenefit}
          </Typography>
          <Typography
            style={{ textAlign: "center" }}
            variant="h6"
            component="h2"
          >
            {/* Beneficio maximo: {maxBenefit} */}
          </Typography>
        </>
      ) : null}
    </div>
  );
}
