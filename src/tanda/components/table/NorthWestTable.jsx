import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function renderCell(cellValue, isCriticalPath) {
  return (
    <TableCell>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, borderRight: "1px solid #000" }}>
          {isCriticalPath ? 0 : cellValue}
        </div>
        <div style={{ flex: 1 }}>
          {/* Aquí puedes mostrar el valor original u otro dato */}
        </div>
      </div>
    </TableCell>
  );
}

function NorthWestTable({ data }) {
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
  const calculateSupply = (data) => {
    return data.map((row) => row.reduce((sum, value) => sum + value, 0));
  };

  const calculateDemand = (data) => {
    return data[0].map((_, colIndex) =>
      data.reduce((sum, row) => sum + row[colIndex], 0)
    );
  };

  const rowNames = Array.from({ length: data.length }, (_, i) => `S${i + 1}`);
  const colNames = Array.from(
    { length: data[0].length },
    (_, i) => `D${i + 1}`
  );

  const supply = calculateSupply(data);
  const demand = calculateDemand(data);

  const solution = solveEsquinaNoroeste(data, supply, demand); // Asumiendo que tienes una función que resuelve el problema.

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          {colNames.map((colName, index) => (
            <TableCell key={index}>{colName}</TableCell>
          ))}
          <TableCell>Supply</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {solution.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>{rowNames[rowIndex]}</TableCell>
            {row.map((cell, cellIndex) =>
              renderCell(cell, isCriticalPath(rowIndex, cellIndex))
            )}
            <TableCell>{supply[rowIndex]}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>Demand</TableCell>
          {demand.map((value, index) => (
            <TableCell key={index}>{value}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default NorthWestTable;
