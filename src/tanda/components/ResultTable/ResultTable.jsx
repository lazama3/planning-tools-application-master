import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import "./index.css";
import { useState } from "react";
const ResultTable = ({
  solution,
  method,
  result,
  isTransport = true,
  assignments = [],
}) => {
  const hungerResult = [];
  let resultHunger = 0;
  return (
    <>
      <Paper className="TableContainer">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              {solution[0].map((_, index) => (
                <TableCell align="center" key={index}>{`${
                  isTransport ? "D" : "L"
                }${index + 1}`}</TableCell>
              ))}
              {isTransport && <TableCell align="center">Oferta</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {solution.map((row, rowIndex) => {
              // let res = 0;
              // console.log("rowIndex");
              // console.log(rowIndex);
              return (
                <TableRow key={rowIndex}>
                  <TableCell align="center">{`${isTransport ? "O" : "M"}${
                    rowIndex + 1
                  }`}</TableCell>
                  {row.map((cell, cellIndex) => {
                    // resultHunger = 0;
                    const columnIndex = assignments[cellIndex];
                    // console.log("cellIndex");
                    // console.log(cellIndex);
                    // console.log("assignments");
                    // console.log(columnIndex === cellIndex);
                    if (columnIndex === rowIndex) {
                      resultHunger += cell;
                      // hungerResult.append(cell);
                    }
                    console.log(resultHunger);
                    return (
                      <TableCell
                        align="center"
                        style={{
                          background: isTransport
                            ? cell
                              ? "dodgerblue"
                              : "inherit"
                            : columnIndex === rowIndex
                            ? "dodgerblue"
                            : "inherit",
                        }}
                        key={cellIndex}
                      >
                        {cell}
                      </TableCell>
                    );
                  })}
                  {isTransport && (
                    <TableCell align="center">
                      {row.reduce((acc, curr) => acc + curr, 0)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {isTransport && (
              <TableRow>
                <TableCell align="center">Demanda</TableCell>
                {solution[0].map((_, columnIndex) => (
                  <TableCell align="center" key={columnIndex}>
                    {solution.reduce(
                      (acc, currRow) => acc + currRow[columnIndex],
                      0
                    )}
                  </TableCell>
                ))}
                <TableCell align="center"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Typography
          size="small"
          style={{ marginLeft: "1rem" }}
          variant="h7"
          //   component="h2"
        >
          Metodo: {isTransport ? `Hungaro` : method} | Beneficio maximo:{" "}
          {isTransport ? hungerResult : resultHunger}
        </Typography>
      </Paper>
    </>
  );
};

export default ResultTable;
