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
} from "@mui/material";
import ResultTable from "../ResultTable/ResultTable";
import "./index.css";
import BalanceAlert from "../BalanceAlert/BalanceAlert";
import { Footer } from "../../../shared/ui";
import { useNavigate } from "react-router-dom";

const MainTable = () => {
  let navigate = useNavigate();
  const [rows, setRows] = useState(3); // Por defecto 3 filas (S1, S2, S3)
  const [columns, setColumns] = useState(4); // Por defecto 4 columnas (D1, D2, D3, D4)
  const [reset, setReset] = useState(false);
  const [balanced, setBalanced] = useState(false);
  const [update, setUpdate] = useState(false);
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
    if (balanced) {
      setSolution(false);
      const demand = tableData.demand;
      const supply = tableData.rows.map((el) => el.supply);
      const costs = tableData.rows.map((el) => el.values);
      let newSolution;
      if (selectedMethod === "Esquina noroeste") {
        newSolution = northWestCorner(supply, demand, costs);
        const objVal = calculateObjectiveValue(tableData, newSolution);
        setMaxBenefit(objVal);
      }
      if (selectedMethod === "Menor Costo") {
        newSolution = leastCostMethod(costs, supply, demand);
        const objVal = calculateObjectiveValue(tableData, newSolution);
        console.log(tableData, newSolution, objVal);
        setMaxBenefit(objVal);
      }
      if (selectedMethod === "Voguel") {
        newSolution = vogelApproximationMethod(costs, supply, demand);
        const objVal = calculateObjectiveValue(tableData, newSolution);
        setMaxBenefit(objVal);
      }
      setSolution(newSolution);
    }
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
  function leastCostMethod(costs, supply, demand) {
    // Crear copias de los arreglos supply y demand para no modificar los originales
    let remainingSupply = supply.slice();
    let remainingDemand = demand.slice();

    // Inicializar la matriz de soluciones con ceros
    let solution = Array.from({ length: supply.length }, () =>
      Array(demand.length).fill(0)
    );

    // Crear arreglos para marcar las filas y columnas ya usadas
    let usedRows = new Array(supply.length).fill(false);
    let usedCols = new Array(demand.length).fill(false);

    // Continuar mientras haya oferta y demanda no satisfechas
    while (
      remainingSupply.some((s) => s > 0) &&
      remainingDemand.some((d) => d > 0)
    ) {
      let { i, j } = findLeastCostCell(
        costs,
        remainingSupply,
        remainingDemand,
        usedRows,
        usedCols
      );
      let amount = Math.min(remainingSupply[i], remainingDemand[j]);

      solution[i][j] = amount;
      remainingSupply[i] -= amount;
      remainingDemand[j] -= amount;

      // Marcar la fila o columna como usada si la oferta o demanda se han agotado
      if (remainingSupply[i] === 0) {
        usedRows[i] = true;
      }
      if (remainingDemand[j] === 0) {
        usedCols[j] = true;
      }
    }

    return solution;
  }

  function findLeastCostCell(
    costs,
    remainingSupply,
    remainingDemand,
    usedRows,
    usedCols
  ) {
    let minCost = Infinity;
    let coordinates = { i: -1, j: -1 };

    // Buscar la celda con el costo mínimo que aún no ha sido usada
    for (let i = 0; i < costs.length; i++) {
      if (usedRows[i]) continue; // Ignorar las filas ya utilizadas
      for (let j = 0; j < costs[i].length; j++) {
        if (usedCols[j]) continue; // Ignorar las columnas ya utilizadas
        if (
          costs[i][j] < minCost &&
          remainingSupply[i] > 0 &&
          remainingDemand[j] > 0
        ) {
          minCost = costs[i][j];
          coordinates = { i, j };
        }
      }
    }

    return coordinates;
  }
  function calculatePenalties(costs, remainingSupply, remainingDemand) {
    const penalties = {
      row: new Array(costs.length).fill(-1), // Inicia con -1 indicando que no hay penalización calculada aún
      col: new Array(costs[0].length).fill(-1),
    };

    // Calcular penalizaciones de fila
    costs.forEach((rowCosts, i) => {
      if (remainingSupply[i] > 0) {
        let filteredCosts = rowCosts.filter((_, j) => remainingDemand[j] > 0);
        if (filteredCosts.length > 1) {
          let sortedCosts = filteredCosts.slice().sort((a, b) => a - b); // Clonar y ordenar los costos filtrados
          penalties.row[i] = sortedCosts[1] - sortedCosts[0]; // Diferencia entre el menor y el segundo menor costo
        }
      }
    });
    for (let j = 0; j < costs[0].length; j++) {
      if (remainingDemand[j] > 0) {
        let filteredCosts = costs
          .map((row) => row[j])
          .filter((_, i) => remainingSupply[i] > 0);
        if (filteredCosts.length > 1) {
          let sortedCosts = filteredCosts.slice().sort((a, b) => a - b);
          penalties.col[j] = sortedCosts[1] - sortedCosts[0];
        }
      }
    }
    return penalties;
  }

  function vogelApproximationMethod(costs, supply, demand) {
    let solution = Array.from({ length: supply.length }, () =>
      Array(demand.length).fill(0)
    );
    let remainingSupply = [...supply];
    let remainingDemand = [...demand];
    while (
      remainingSupply.some((s) => s > 0) &&
      remainingDemand.some((d) => d > 0)
    ) {
      let penalties = calculatePenalties(
        costs,
        remainingSupply,
        remainingDemand
      );
      // Encuentra la penalización más alta entre filas y columnas
      let maxRowPenalty = Math.max(
        ...Object.values(penalties.row).filter(Boolean)
      );
      let maxColPenalty = Math.max(
        ...Object.values(penalties.col).filter(Boolean)
      );

      let i, j;

      if (maxRowPenalty >= maxColPenalty) {
        i = penalties.row.findIndex((p) => p === maxRowPenalty);
        j = costs[i]
          .map((cost, index) => ({ cost, index }))
          .filter((cell) => remainingDemand[cell.index] > 0)
          .sort((a, b) => a.cost - b.cost)[0].index;
      } else {
        j = penalties.col.findIndex((p) => p === maxColPenalty);
        i = costs
          .map((row, index) => ({ cost: row[j], index }))
          .filter((cell) => remainingSupply[cell.index] > 0)
          .sort((a, b) => a.cost - b.cost)[0].index;
      }
      let value = Math.min(remainingSupply[i], remainingDemand[j]);
      solution[i][j] = value;
      remainingSupply[i] -= value;
      remainingDemand[j] -= value;
      if (remainingSupply[i] < 0) remainingSupply[i] = 0;
      if (remainingDemand[j] < 0) remainingDemand[j] = 0;
      if (
        remainingSupply.filter((el) => el > 0).length === 1 &&
        remainingDemand.filter((el) => el > 0).length == 1
      ) {
        const demandIndex = remainingDemand.findIndex((el) => el > 0);
        const supplyIndex = remainingSupply.findIndex((el) => el > 0);
        solution[supplyIndex][demandIndex] = remainingDemand[demandIndex];
        remainingDemand[demandIndex] = 0;
        remainingSupply[supplyIndex] = 0;
        break;
      }
    }
    return solution;
  }
  const calculateObjectiveValue = (tableData, assignmentMatrix) => {
    let objectiveValue = 0;
    for (let i = 0; i < tableData.rows.length; i++) {
      for (let j = 0; j < tableData.rows[i].values.length; j++) {
        objectiveValue += tableData.rows[i].values[j] * assignmentMatrix[i][j];
      }
    }
    return objectiveValue;
  };
  const handleClearAll = () => {
    setReset(!reset);
    setRows(3);
    setColumns(4);
    // navigate("/transport", { replace: true });
  };
  const handleGoBack = () => {
    navigate("/", { replace: true });
  };
  useEffect(() => {
    setTableData(createInitialTableData(rows, columns));

    // balanced;
    setSolution(false);
  }, [rows, columns, reset]);
  const FOOTER_BUTTONS = [
    {
      text: "volver",
      icon: "back",
      type: "icon",
      color: "inherit",
      handle: handleGoBack,
      position: "left",
      // disabled: isSaving,
    },
    {
      text: "reiniciar",
      icon: "reset",
      type: "icon",
      color: "inherit",
      handle: handleClearAll,
      position: "left",
      // disabled: isSaving,
    },
  ];
  return (
    <div>
      <div className="MainTable" style={{ margin: "1rem" }}>
        <TextField
          size="small"
          label="Número de Filas"
          type="number"
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
        />
        <TextField
          size="small"
          label="Número de Columnas"
          type="number"
          value={columns}
          onChange={(e) => setColumns(parseInt(e.target.value))}
        />
      </div>
      <Paper elevation={3} style={{ margin: "0 1rem" }}>
        <Table>
          <TableHead>
            <TableRow
            // style={{ background: "#7d90a2" }}
            >
              <TableCell
                align="center"
                // style={{ color: "white", fontWeight: "bold" }}
              >
                {/* S/D Name */}
              </TableCell>
              {Array.from({ length: columns }, (_, colIndex) => (
                <TableCell
                  key={colIndex}
                  align="center"
                  // style={{ color: "white", fontWeight: "bold" }}
                >{`D${colIndex + 1}`}</TableCell>
              ))}
              <TableCell
                align="center"
                // style={{ color: "white", fontWeight: "bold" }}
              >
                Oferta
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                // style={{
                //   background: rowIndex % 2 === 0 ? "#8db2cc" : "#4d6b85",
                // }}
              >
                <TableCell align="center">{`O${rowIndex + 1}`}</TableCell>
                {row.values.map((value, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <TextField
                      size="small"
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
                    size="small"
                    value={row.supply}
                    onChange={(e) =>
                      handleSupplyChange(rowIndex, e.target.value)
                    }
                    type="number"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow
            // style={{ background: "#7d90a2" }}
            >
              <TableCell
                align="center"
                // style={{ color: "white", fontWeight: "bold" }}
              >
                Demanda
              </TableCell>
              {tableData.demand.map((value, colIndex) => (
                <TableCell key={colIndex} align="center">
                  <TextField
                    size="small"
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
      <Button style={{ margin: "0.5rem 1rem 5rem" }} onClick={handleClick}>
        Resolver Problema
      </Button>
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
            handleSolve("Voguel");
            setMethod("Voguel");
          }}
        >
          Solución del Método de Voguel
        </MenuItem>
      </Menu>
      <BalanceAlert
        setBalanced={setBalanced}
        update={update}
        supply={tableData.rows.map((el) => el.supply)}
        demand={tableData.demand}
      />
      {solution ? (
        <ResultTable
          solution={solution}
          method={method}
          result={maxBenefit}
          // update={update}
        />
      ) : null}
      <Footer buttons={FOOTER_BUTTONS} />
    </div>
  );
};

export default MainTable;
