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
const ResultTable = ({ solution, method, result }) => {
  return (
    <>
      <Paper className="TableContainer">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {solution[0].map((_, index) => (
                <TableCell key={index}>{`D${index + 1}`}</TableCell>
              ))}
              <TableCell>Oferta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solution.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{`O${rowIndex + 1}`}</TableCell>
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
              <TableCell>Demanda</TableCell>
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
        <Typography style={{ marginLeft: "1rem" }} variant="h6" component="h2">
          Metodo: {method} | Beneficio maximo: {result}
        </Typography>
      </Paper>
    </>
  );
};

export default ResultTable;
