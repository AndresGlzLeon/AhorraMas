import { Text, StyleSheet, View, Button } from "react-native";
import React, { useState } from "react";
import Principal from "./Principal";
import Login from "./Login";
import CrearCuenta from "./CrearCuenta";
import PagosProgramados from "./PagosProgramados";
import Ahorros from "./Ahorros";
import Presupuesto from "./Presupuesto";
import IngresosEgresos from "./IngresosEgresos";
import Ajustes from "./Ajustes";
import Perfil from "./Perfil";

export default function MenusScreens() {
  const [screen, setScreen] = useState("menu");

  switch (screen) {
    case "principal":
      return <Principal />;
    case "login":
      return <Login />;
    case "crear":
      return <CrearCuenta />;
    case "pagosProgramados":
      return <PagosProgramados />;
    case "ahorros":
      return <Ahorros />;
    case "presupuesto":
      return <Presupuesto />;
    case "ingresosEgresos":
      return <IngresosEgresos />;
    case "ajustes":
      return <Ajustes />;
    case "perfil":
      return <Perfil />;
    case "menu":
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Menu</Text>
          <View style={styles.buttonGroup}>
            <Button onPress={() => setScreen("principal")} title="Principal" />
            <Button onPress={() => setScreen("login")} title="Login" />
            <Button onPress={() => setScreen("crear")} title="Crear Cuenta" />
            <Button onPress={() => setScreen("pagosProgramados")} title="Pagos Programados" />
            <Button onPress={() => setScreen("ahorros")} title="Ahorros" />
            <Button onPress={() => setScreen("presupuesto")} title="Presupuesto" />
            <Button onPress={() => setScreen("ingresosEgresos")} title="Ingresos y Egresos" />
            <Button onPress={() => setScreen("ajustes")} title="Ajustes" />
            <Button onPress={() => setScreen("perfil")} title="Perfil" />
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonGroup: {
    width: "100%",
    gap: 12,
  },
});