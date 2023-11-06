import React, { useEffect } from "react";
import { Alert } from "@mui/material";

// Función que verifica si la oferta y la demanda están balanceadas

// Componente React que muestra una alerta si la oferta y la demanda no están balanceadas
const BalanceAlert = ({ supply, demand, update, setBalanced }) => {
  useEffect(() => {}, [supply, demand, update]);
  const isBalanced = checkBalance(supply, demand);
  function checkBalance(supply, demand) {
    const totalSupply = supply.reduce((acc, val) => acc + val, 0);
    const totalDemand = demand.reduce((acc, val) => acc + val, 0);
    setBalanced(totalSupply === totalDemand);
    console.log(totalSupply, totalDemand);
    return totalSupply === totalDemand;
  }

  if (!isBalanced) {
    return (
      <Alert severity="error">
        La oferta y la demanda no están balanceadas.
      </Alert>
    );
  }

  return null;
};

export default BalanceAlert;
