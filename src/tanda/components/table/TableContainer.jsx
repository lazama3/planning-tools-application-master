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
} from "@mui/material";
import { useState } from "react";
import NorthWestTable from "./NorthWestTable";

const TableContainer = () => {
  const [rows, setRows] = useState(3); // Por defecto 3 para S1, S2 y S3
  const [columns, setColumns] = useState(4); // Por defecto 4 para D1, D2, D3 y D4
  const [solution, setSolution] = useState(false);

  const [tableData, setTableData] = useState({
    rows: 3,
    columns: 3,
    data: Array(3).fill(Array(4).fill(0)),
  });
  const handleSolve = () => {
    console.log(tableData);
    const demand = [5, 15, 15, 15];
    const supply = [15, 25, 10];
    const costs = tableData.data;
    console.log(costs);
    const newSolution = northWestCorner(supply, demand, costs);
    console.log(newSolution);
    setSolution(newSolution);
  };
  const [dimensions, setDimensions] = useState({ rows: 3, columns: 4 });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
                  <TableCell key={cellIndex}>{cell}</TableCell>
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
  const handleClose = () => {
    setAnchorEl(null);
  };
  const updateTableDimensions = () => {
    setTableData({
      ...tableData,
      rows: dimensions.rows,
      columns: dimensions.columns,
      data: Array(dimensions.rows).fill(Array(dimensions.columns).fill(0)),
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
  const solveEsquinaNoroeste = (data, supply, demand) => {
    let i = 0;
    let j = 0;

    // Inicializa una matriz de solución con todos los valores en cero
    let solution = Array.from({ length: supply.length }, () =>
      Array.from({ length: demand.length }, () => 0)
    );

    while (i < supply.length && j < demand.length) {
      // Encuentra la asignación mínima posible
      let minAllocation = Math.min(supply[i], demand[j]);

      solution[i][j] = minAllocation;

      supply[i] -= minAllocation;
      demand[j] -= minAllocation;

      // Si se satisface toda la oferta, avanza a la siguiente fila
      if (supply[i] === 0) i++;

      // Si se satisface toda la demanda, avanza a la siguiente columna
      if (demand[j] === 0) j++;
    }

    return solution;
  };

  const handleCellValueChange = (rowIndex, colIndex, newValue) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      const newRow = [...newData.data[rowIndex]];
      newRow[colIndex] = parseFloat(newValue) || 0;
      newData.data[rowIndex] = newRow;
      return newData;
    });
  };

  const handleDemandValueChange = (colIndex, newValue) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      newData.demand[colIndex] = parseFloat(newValue) || 0;
      return newData;
    });
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Número de filas"
          type="number"
          value={dimensions.rows}
          onChange={(e) =>
            setDimensions((prev) => ({ ...prev, rows: Number(e.target.value) }))
          }
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Número de columnas"
          type="number"
          value={dimensions.columns}
          onChange={(e) =>
            setDimensions((prev) => ({
              ...prev,
              columns: Number(e.target.value),
            }))
          }
        />
        <Button onClick={updateTableDimensions}>Actualizar tabla</Button>
        {/* No es necesario un botón de actualización, ya que el estado se reflejará automáticamente en la tabla.
                   Pero si deseas realizar alguna acción adicional al actualizar, puedes usar un botón. */}
      </div>
      <Paper elevation={3} style={{ maxWidth: "80%", margin: "50px auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#3e567a" }}>
              <TableCell
                align="center"
                style={{ color: "white", fontWeight: "bold" }}
              >
                S/D Name
              </TableCell>
              {Array.from({ length: tableData.columns }, (_, colIndex) => (
                <TableCell
                  key={colIndex}
                  align="center"
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  {`D${colIndex + 1}`}
                </TableCell>
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
            {Array.from({ length: tableData.rows }, (_, rowIndex) => (
              <TableRow
                key={rowIndex}
                style={{
                  background: "dodgerblue",
                  //   background: rowIndex % 2 === 0 ? "#8db2cc" : "#4d6b85",
                }}
              >
                <TableCell align="center">{`S${rowIndex + 1}`}</TableCell>
                {Array.from({ length: tableData.columns }, (_, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <TextField
                      value={tableData.data[rowIndex][colIndex]}
                      style={{
                        background: "white",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center",
                        textAlign: "center",
                      }}
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
                <TableCell align="center"></TableCell>
              </TableRow>
            ))}
            <TableRow style={{ background: "#7d90a2" }}>
              <TableCell
                align="center"
                style={{ color: "white", fontWeight: "bold" }}
              >
                Demand
              </TableCell>
              {Array.from({ length: tableData.columns }, (_, colIndex) => (
                <TableCell key={colIndex} align="center"></TableCell>
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
            solveEsquinaNoroeste();
          }}
        >
          Solución de Esquina Noroeste
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            solveMenorCosto();
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
      <button onClick={handleSolve}>Resolver</button>
      {solution ? <SolutionTable solution={solution} /> : null}
      {/* <EsquinaNoroesteTable
        data={tableData.data}
        // supply={supply}
        // demand={demand}
      /> */}
      {/* <NorthWestTable data={tableData.data} /> */}
    </div>
  );
};

export default TableContainer;
