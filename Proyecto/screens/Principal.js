import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import  PagosProgramados  from "./PagosProgramados";
import Login from "./Login";
import CrearCuenta from "./CrearCuenta";
import IngresosEgresos from "./IngresosEgresos";
import Ahorros from "./Ahorros";
import Ajustes from "./Ajustes";
import Notificaciones from "./Notificaciones";
import Perfil from "./Perfil";
import Presupuesto from "./Presupuesto";


export default function Principal() {
  const [currentScreen, setCurrentScreen] = React.useState("principal");

  // Función para navegar entre pantallas
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  // Pantalla de Pagos Programados
  const renderPagosProgramados = () => {
    return (
      <View style={styles.container}>
        
        {/* Header original de PagosProgramados */}
        <PagosProgramados />
        
      </View>
    );
  };

  const renderPrincipal = () => {
    return (
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.leftIcons}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
          </View>

          <Text style={styles.title}>Ahorra+ App</Text>

          <View style={styles.avatar}>
            <TouchableOpacity onPress={() => navigateTo("login")}>
              <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENIDO SCROLLABLE */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Bienvenida + puerquito */}
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.welcome}>Bienvenido,{"\n"}Consulta tus gastos</Text>
            </View>
            <Image source={require("../assets/logo.png")} style={styles.pigImage} />
          </View>

          {/* Dinero disponible */}
          <Text style={styles.text}>Tu dinero disponible es:</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.amount}>$1,200</Text>
          </View>

          {/* Últimas transacciones */}
          <Text style={styles.sectionTitle}>Últimas transacciones</Text>

          {/* TRANSPORTE */}
          <View style={styles.transaction}>
            <Image source={require("../assets/transporte.png")} style={styles.iconTrans} />
            <View style={styles.details}>
              <Text style={styles.itemTitle}>Transporte</Text>
              <Text style={styles.date}>26 sep, 3:18 PM</Text>
            </View>
            <Text style={[styles.amountText, { color: "#e63946" }]}>- $300.0</Text>
          </View>

          {/* SUELDO */}
          <View style={styles.transaction}>
            <Image source={require("../assets/sueldo.png")} style={styles.iconTrans} />
            <View style={styles.details}>
              <Text style={styles.itemTitle}>Sueldo</Text>
              <Text style={styles.date}>20 sep, 9:38 PM</Text>
            </View>
            <Text style={[styles.amountText, { color: "#2a9d8f" }]}>+ $500.0</Text>
          </View>

          {/* DESPENSA */}
          <View style={styles.transaction}>
            <Image source={require("../assets/despensa.png")} style={styles.iconTrans} />
            <View style={styles.details}>
              <Text style={styles.itemTitle}>Despensa</Text>
              <Text style={styles.date}>26 jul, 3:18 PM</Text>
            </View>
            <Text style={[styles.amountText, { color: "#e63946" }]}>- $700.0</Text>
          </View>
        </ScrollView>

        {/* NAV INFERIOR */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("ingresosEgresos")}>
            <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("ahorros")}>
            <Image source={require("../assets/Pink.png")} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.centerButton}>
            <Image source={require("../assets/inicio.png")} style={styles.centerIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("pagosProgramados")}>
            <Image source={require("../assets/Programados.png")} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("presupuesto")}>
            <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Renderizar la pantalla actual
  switch (currentScreen) {
    case "pagosProgramados":
      return renderPagosProgramados();
    case "login":
      return <Login navigate={setCurrentScreen || setScreen} />;
    case "crear":
      return <CrearCuenta navigate={setCurrentScreen || setScreen} />;
    case "ingresosEgresos":
      return <IngresosEgresos navigate={setCurrentScreen || setScreen} />;
    case "ahorros":
      return <Ahorros navigate={setCurrentScreen || setScreen} />;
    case "ajustes":
      return <Ajustes navigate={setCurrentScreen || setScreen} />;
    case "notificaciones":
      return <Notificaciones navigate={setCurrentScreen || setScreen} />;
    case "perfil":
      return <Perfil navigate={setCurrentScreen || setScreen} />;
    case "presupuesto":
      return <Presupuesto navigate={setCurrentScreen || setScreen} />;
    case "principal":
    default:
      return renderPrincipal();
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    width: "95%",
    marginTop: 50,
  },
  leftIcons: {
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconHeader: { 
    width: 33,
    height: 22, 
    resizeMode: "contain" 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#333" 
  },
  backButton: {
    fontSize: 16,
    color: "#7b6cff",
    fontWeight: "500",
  },
  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 50,
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20, 
    tintColor: "#fff",
    resizeMode: "contain" 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 120 
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
  },
  pigImage: { 
    width: 80, 
    height: 80, 
    resizeMode: "contain" 
  },
  text: { 
    fontSize: 18, 
    fontWeight: "500", 
    marginBottom: 10 
    
  },
  balanceCard: {
    backgroundColor: "#c8b6ff",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 120,
    shadowColor: "#aaa",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  amount: {
    fontSize: 40, 
    color: "#fff", 
    fontWeight: "bold" 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 30, 
    marginBottom: 10 
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3efff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    shadowColor: "#aaa",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  iconTrans: { 
    width: 25, 
    height: 25, 
    resizeMode: "contain" 
  },
  details: { 
    flex: 1, 
    marginLeft: 10 
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#222" 
  },
  date: { 
    fontSize: 12, 
    color: "#777" 
  },
  amountText: { 
    fontSize: 16, 
    fontWeight: "600" 
  },
  bottomNav: {
    position: "absolute",
    bottom: 10,
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#eae2ff",
    paddingVertical: 12,
    borderRadius: 30,
  },
  iconCircle: {
    width: 50,       
    height: 50,
    borderRadius: 25, 
    backgroundColor: "#A084E8", 
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5, 
  },
  navIcon: { 
    width: 26, 
    height: 26, 
    resizeMode: "contain" 
  },
  centerButton: {
    backgroundColor: "#7f6aff",
    padding: 15,
    borderRadius: 40,
    marginBottom: 25,
  },
  centerIcon: {
    width: 30, 
    height: 30, 
    resizeMode: "contain", 
    tintColor: "#fff" 
  },
});