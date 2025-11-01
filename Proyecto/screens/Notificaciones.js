import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

export default function Notificaciones({ navigate }) {

  // Notificaciones usando los mismos iconos que PagosProgramados
  const notificaciones = [
    {
      id: 1,
      icon: require("../assets/sueldo.png"),
      categoria: "INGRESO",
      mensaje: "Has recibido un ingreso reciente",
      cantidad: "+$1000.00",
      color: "#22b83a"
    },
    {
      id: 2,
      icon: require("../assets/alquiler.png"),
      categoria: "PAGO PROGRAMADO",
      mensaje: "Pago de alquiler próximo",
      cantidad: "-$1500.00",
      color: "#d62828"
    },
    {
      id: 3,
      icon: require("../assets/transporte.png"),
      categoria: "GASTOS",
      mensaje: "Has gastado más en transporte esta semana",
      color: "#d62828"
    },
    {
      id: 4,
      icon: require("../assets/Pink.png"),
      categoria: "AHORRO",
      mensaje: "¡Vas bien! Sigue ahorrando para tu meta",
      color: "#7b6cff"
    }
  ];

  return (
    <View style={styles.container}>

      {/* HEADER igual que en PagosProgramados */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          {/* BOTÓN AJUSTES - CORREGIDO */}
          <TouchableOpacity onPress={() => navigate("ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>
          {/* BOTÓN NOTIFICACIONES */}
          <TouchableOpacity onPress={() => navigate("notificaciones")}>
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <View style={styles.avatar}>
          <TouchableOpacity onPress={() => navigate("login")}>
            <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* TITULO + LOGO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.mainTitle}>Notificaciones</Text>
            <Text style={styles.subtitle}>Alertas de tu actividad</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* Tarjetas */}
        {notificaciones.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={n.icon} style={styles.cardIcon} />
              <Text style={styles.category}>{n.categoria}</Text>
            </View>
            <Text style={styles.message}>{n.mensaje}</Text>
            {n.cantidad && <Text style={[styles.amount, { color: n.color }]}>{n.cantidad}</Text>}
          </View>
        ))}
      </ScrollView>

      {/* BOTÓN SALIR */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigate("principal")}>
        <Text style={styles.exitText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },

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

  scrollContent: { padding: 20, paddingBottom: 120 },
  headerSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: "700", lineHeight: 30,marginTop:15, color: "#7b6cff" },
  subtitle: { fontSize: 16, marginTop:50, color: "#000" },
  pigImage: { width: 80, height: 80, resizeMode: "contain" },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    width: "95%",
    elevation: 6,
    shadowColor: "#b6aaff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
  },
  cardIcon: { width: 30, height: 30, marginRight: 8 },
  category: { fontSize: 14, fontWeight: "700", color: "#7b6cff" },
  message: { marginTop: 6, fontSize: 15, fontWeight: "600", color: "#333" },
  amount: { marginTop: 5, fontSize: 16, fontWeight: "700" },

  exitButton: {
    width: "60%",
    backgroundColor: "#7f6aff",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15
  },
  exitText: { fontSize: 17, color: "#fff", fontWeight: "700" }
});