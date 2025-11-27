import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Image, ScrollView } from "react-native";

export default function Ajustes() {
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

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
      {/* <View style={styles.header}>
        <View style={styles.leftIcons}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <View style={styles.avatar}>
            <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </View>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.mainTitle}>Configuración</Text>
            <Text style={styles.subtitle}>Preferencias de tu cuenta</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <View style={styles.content}>
          
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Idioma</Text>
                <Text style={styles.cardValue}>Español (México)</Text>
              </View>
                <Text style={styles.editText}>Editar</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Notificaciones</Text>
                <Text style={styles.cardValue}>Recibir alertas y recordatorios</Text>
              </View>
              <Switch 
                value={notificacionesActivas} 
                onValueChange={setNotificacionesActivas}
                trackColor={{ false: "#ccc", true: "#7b6cff" }}
                thumbColor={notificacionesActivas ? "#fff" : "#fff"}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Se unió</Text>
                <Text style={styles.cardValue}>Febrero de 2023</Text>
              </View>
            </View>
          </View>

            <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </View>
      </ScrollView>

        <Text style={styles.exitText}>Salir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    alignItems: "center" 
  },

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
  avatar: { 
    backgroundColor: "#b3a5ff", 
    borderRadius: 50, 
    padding: 8 
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
    width: "100%", 
  },
  mainTitle: { 
    fontSize: 26, 
    fontWeight: "700", 
    lineHeight: 30,
    marginTop: 60, 
    color: "#7b6cff" 
  },
  subtitle: { 
    fontSize: 16, 
    marginTop: 50, 
    color: "#000" 
  },
  pigImage: { 
    width: 80, 
    height: 80, 
    resizeMode: "contain", 
   
  },

  content: { 
    width: "100%",
    marginTop: 20
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    width: "100%",
    elevation: 6,
    shadowColor: "#b6aaff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#7b6cff",
    marginBottom: 4 
  },
  cardValue: { 
    fontSize: 15, 
    color: "#555",
    fontWeight: "500" 
  },

  notificationsSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7b6cff",
    marginBottom: 15,
    marginLeft: 5,
  },
  notificationCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    width: "100%",
    elevation: 6,
    shadowColor: "#b6aaff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  notificationIcon: { 
    width: 30, 
    height: 30, 
    marginRight: 8 
  },
  notificationCategory: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#7b6cff" 
  },
  notificationMessage: { 
    marginTop: 6, 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#333" 
  },
  notificationAmount: { 
    marginTop: 5, 
    fontSize: 16, 
    fontWeight: "700" 
  },

  editButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editText: { 
    fontSize: 14, 
    color: "#7b6cff", 
    fontWeight: "600" 
  },

  logoutButton: {
    backgroundColor: "#d62828",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
    width: "100%",
  },
  logoutText: { 
    fontSize: 16, 
    color: "#fff", 
    fontWeight: "700" 
  },

  exitButton: {
    width: "60%",
    backgroundColor: "#7f6aff",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15
  },
  exitText: { 
    fontSize: 17, 
    color: "#fff", 
    fontWeight: "700" 
  }
});