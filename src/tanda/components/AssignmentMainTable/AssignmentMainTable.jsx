import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import ResultTable from "../ResultTable/ResultTable";
import "./index.css";
import BalanceAlert from "../BalanceAlert/BalanceAlert";
import { Footer } from "../../../shared/ui";
import { useNavigate } from "react-router-dom";

const AssignmentMainTable = () => {
  let navigate = useNavigate();
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [reset, setReset] = useState(false);
  const [balanced, setBalanced] = useState(false);
  const [update, setUpdate] = useState(false);
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

  const [tableData, setTableData] = useState(
    createInitialTableData(rows, columns)
  );
  const [solution, setSolution] = useState(false);

  const handleSolve = () => {
    const costs = tableData.rows.map((el) => el.values);
    const newSolution = hungarianAlgorithm(costs);
    console.log(newSolution);
    setSolution(newSolution);
    // let newSolution2 = newSolution;
    // for (let i = 0; i < 10; i++) {
    //   newSolution2 = hungarianAlgorithm(newSolution2);
    // }
    // console.log(newSolution2);
    // setSolution(newSolution2);
  };
  function hungarianAlgorithm(costMatrix) {
    const n = costMatrix.length;
    let u = new Array(n).fill(0);
    let v = new Array(n).fill(0);
    let ind = new Array(n).fill(-1);

    for (let i = 0; i < n; ++i) {
      const links = new Array(n).fill(-1);
      const mins = new Array(n).fill(Infinity);
      const visited = new Array(n).fill(false);
      let markedI = i,
        markedJ = -1,
        j;
      while (markedI !== -1) {
        j = -1;
        for (let j1 = 0; j1 < n; ++j1)
          if (!visited[j1]) {
            const cur = costMatrix[markedI][j1] - u[markedI] - v[j1];
            if (cur < mins[j1]) {
              mins[j1] = cur;
              links[j1] = markedJ;
            }
            if (j === -1 || mins[j1] < mins[j]) j = j1;
          }
        const delta = mins[j];
        for (let j1 = 0; j1 < n; ++j1)
          if (visited[j1]) {
            u[ind[j1]] += delta;
            v[j1] -= delta;
          } else {
            mins[j1] -= delta;
          }
        u[i] += delta;
        visited[j] = true;
        markedJ = j;
        markedI = ind[j];
      }
      while (links[j] !== -1) {
        ind[j] = ind[links[j]];
        j = links[j];
      }
      ind[j] = i;
    }
    return ind;
  }
  const handleCellValueChange = (rowIndex, colIndex, newValue) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      newData.rows[rowIndex].values[colIndex] = parseFloat(newValue) || 0;
      return newData;
    });
  };
  const handleClearAll = () => {
    setReset(!reset);
    setRows(3);
    setColumns(3);
  };
  const handleGoBack = () => {
    navigate("/", { replace: true });
  };
  useEffect(() => {
    setTableData(createInitialTableData(rows, columns));

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
    },
    {
      text: "reiniciar",
      icon: "reset",
      type: "icon",
      color: "inherit",
      handle: handleClearAll,
      position: "left",
    },
  ];
  return (
    <div>
      <div className="MainTable" style={{ margin: "1rem" }}>
        <TextField
          size="small"
          label="Número de Filas y Columnas"
          type="number"
          value={rows}
          onChange={(e) => {
            setRows(parseInt(e.target.value));
            setColumns(parseInt(e.target.value));
          }}
        />
      </div>
      <Paper elevation={3} style={{ margin: "0 1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              {Array.from({ length: columns }, (_, colIndex) => (
                <TableCell key={colIndex} align="center">{`L${
                  colIndex + 1
                }`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell align="center">{`M${rowIndex + 1}`}</TableCell>
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
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Button style={{ margin: "0.5rem 1rem" }} onClick={handleSolve}>
        Resolver Problema
      </Button>
      <BalanceAlert
        setBalanced={setBalanced}
        update={update}
        supply={tableData.rows.map((el) => el.supply)}
        demand={tableData.demand}
      />
      {solution ? (
        <ResultTable
          solution={tableData.rows.map((el) => el.values)}
          method={method}
          result={maxBenefit}
          isTransport={false}
          assignments={solution}
        />
      ) : null}
      <Footer buttons={FOOTER_BUTTONS} />
    </div>
  );
};

export default AssignmentMainTable;
