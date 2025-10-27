import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import Principal from "./Principal";
import Login from "./Login";
import CrearCuenta from "./CrearCuenta";



export default function PagosProgramados() {
  const [currentScreen, setCurrentScreen] = React.useState("pagosProgramados");

  // Función para navegar entre pantallas
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  // Pantalla Principal
  const renderPrincipal = () => {
    return (
      <View style={styles.container}>
        <Principal />     
      </View>
    );
  };

  // Pantalla de Pagos Programados
  const renderPagosProgramados = () => {
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

        {/* CONTENIDO */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.mainTitle}>Gastos{"\n"}Programados</Text>
              <Text style={styles.subtitle}>Administra tus pagos</Text>
            </View>
            <Image source={require("../assets/logo.png")} style={styles.pigImage} />
          </View>

          {/* Tarjetas de gastos */}
          <View style={styles.cardContainer}>
            {/* Alquiler */}
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={require("../assets/alquiler.png")} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>Alquiler</Text>
                  <Text style={styles.cardSub}>Mensual</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cardAmount}>-$1500.00</Text>
                <Text style={styles.cardDate}>10 octubre 2025</Text>
              </View>
            </View>

            {/* Seguro Auto */}
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={require("../assets/auto.png")} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>Seguro Auto</Text>
                  <Text style={styles.cardSub}>Anual</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cardAmount}>-$750.00</Text>
                <Text style={styles.cardDate}>4 enero 2026</Text>
              </View>
            </View>

            {/* Pago de Servicios */}
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={require("../assets/servicios.png")} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>Pago de Servicios   </Text>
                  <Text style={styles.cardSub}>Mensual</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cardAmount}>-$589.00</Text>
                <Text style={styles.cardDate}>26 octubre 2025</Text>
              </View>
            </View>
          </View>

          {/* Botón crear gasto */}
          <TouchableOpacity style={styles.addButton}>
            <Image source={require("../assets/mas.png")} style={styles.addIcon} />
            <Text style={styles.addText}>Crear nuevo gasto programado</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* NAV INFERIOR */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
            <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
            <Image source={require("../assets/Pink.png")} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.centerButton} onPress={() => navigateTo("")}>
            <Image source={require("../assets/Programados.png")} style={styles.centerIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
            <Image source={require("../assets/inicio.png")} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
            <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


// Renderizar la pantalla actual
switch (currentScreen) {
  case "principal":
    return renderPrincipal();

  case "login":
    return <Login navigate={navigateTo} />;

  case "crear":
    return <CrearCuenta navigate={navigateTo} />;

  case "pagosProgramados":
  default:
    return renderPagosProgramados();
}


}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },

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
  leftIcons: { flexDirection: "row", alignItems: "center" },
  iconHeader: { width: 33, height: 22, resizeMode: "contain" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  avatar: { backgroundColor: "#b3a5ff", borderRadius: 50, padding: 8 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff", resizeMode: "contain" },

  // CONTENIDO
  scrollContent: { padding: 20, paddingBottom: 120 },
  headerSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: "700", lineHeight: 30,marginTop:15, color: "#7b6cff" },
  subtitle: { fontSize: 16, marginTop:50, color: "#rgb(0, 0, 0)"  },
  pigImage: { width: 80, height: 80, resizeMode: "contain" },

  // TARJETAS
  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 10,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: -5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginTop: 0,
    paddingBottom: 0,
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  cardIcon: { width: 50, height: 50, marginRight:40, marginBottom:15, tintColor: "#7b6cff" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  cardSub: { fontSize: 13, color: "#777" },
  cardAmount: { fontSize: 16, fontWeight: "700", color: "#000" },
  cardDate: { fontSize: 12, color: "#777" },

  // BOTÓN NUEVO GASTO
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f1ff",
    borderRadius: 25,
    padding: 15,
    justifyContent: "center",
  },
  addIcon: { width: 25, height: 25, marginRight: 10, tintColor: "#7b6cff" },
  addText: { fontSize: 16, color: "#000", fontWeight: "500" },

  // NAV INFERIOR
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
  navIcon: { width: 26, height: 26, resizeMode: "contain" },
  centerButton: {
    backgroundColor: "#7f6aff",
    padding: 15,
    borderRadius: 40,
    marginBottom: 25,
  },
  centerIcon: { width: 30, height: 30, resizeMode: "contain", tintColor: "#fff" },
});