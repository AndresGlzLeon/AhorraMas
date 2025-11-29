import React, { createContext, useContext, useState } from "react";

const IngresosContext = createContext();

export function IngresosProvider({ children }) {
  const [ingresos, setIngresos] = useState([]);

  const addIngreso = (nuevo) => {
    setIngresos((prev) => [...prev, { id: Date.now(), ...nuevo }]);
  };

  return (
    <IngresosContext.Provider value={{ ingresos, addIngreso }}>
      {children}
    </IngresosContext.Provider>
  );
}

export function useIngresos() {
  return useContext(IngresosContext);
}
