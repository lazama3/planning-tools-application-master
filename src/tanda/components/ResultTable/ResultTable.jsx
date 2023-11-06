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
              <TableCell align="center"></TableCell>
              {solution[0].map((_, index) => (
                <TableCell align="center" key={index}>{`D${
                  index + 1
                }`}</TableCell>
              ))}
              <TableCell align="center">Oferta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solution.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell align="center">{`O${rowIndex + 1}`}</TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    align="center"
                    style={{
                      background: cell ? "dodgerblue" : "inherit",
                    }}
                    key={cellIndex}
                  >
                    {cell}
                  </TableCell>
                ))}
                <TableCell align="center">
                  {row.reduce((acc, curr) => acc + curr, 0)}
                </TableCell>
              </TableRow>
            ))}
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
          </TableBody>
        </Table>
        <Typography
          size="small"
          style={{ marginLeft: "1rem" }}
          variant="h7"
          //   component="h2"
        >
          Metodo: {method} | Beneficio maximo: {result}
        </Typography>
      </Paper>
    </>
  );
};

export default ResultTable;
