import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function IngresosEgresos() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          {/* 🔧 Aquí pones tu ícono de configuración */}
          <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />

          {/* 🔔 Aquí pones tu ícono de notificación */}
          <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        {/* 👤 Aquí va tu imagen/avatar */}
        <View style={styles.avatar}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </View>
      </View>

      {/* CONTENIDO SCROLLABLE */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bienvenida + puerquito */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Gastos,{"\n"}Programados</Text>
          </View>
          {/* 🐷 Imagen del puerquito */}
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* Últimas transacciones */}
        <Text style={styles.sectionTitle}>Administra tus pagos</Text>

      </ScrollView>

      {/* NAV INFERIOR */}
      {/* NAV INFERIOR */}
        <View style={styles.bottomNav}>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />
        </View>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/Pink.png")} style={styles.navIcon} />
        </View>

        <View style={styles.centerButton}>
        <Image source={require("../assets/Programados.png")} style={styles.centerIcon} />
        </View>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/inicio.png")} style={styles.navIcon} />
        </View>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
        </View>

    </View>

</View>
);
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
   backgroundColor: "#fff",
   alignItems:"center",

},

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    width: " 95%",
    marginTop: 50,
    
    
  },
  leftIcons: {
    flexDirection: "row", 
    alignItems: "center" },

  iconHeader: { 
    width: 33,
    height: 22, 
    resizeMode: "contain" },

  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#333" },

  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 50,
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20, 
    tintColor: "#fff",
    resizeMode: "contain" },

  // CUERPO
  scrollContent: { 
    padding: 20,
    paddingBottom: 120 },
    
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 26,
    paddingRight: 100,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
  },
    pigImage: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },




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
  
  navIcon: { 
    width: 26, 
    height: 26, 
    resizeMode: "contain" },

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
    tintColor: "#fff" },
});
