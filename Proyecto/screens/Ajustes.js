import React, { useState } from "react";
<<<<<<< HEAD
import { View, Text, StyleSheet, Switch, Image, ScrollView, Pressable, Alert } from "react-native";

export default function Ajustes({navigation, onLogout}) {
=======
import { View, Text, StyleSheet, Switch, Image, ScrollView } from "react-native";

export default function Ajustes() {
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
=======
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

>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
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

          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.exitText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
<<<<<<< HEAD
=======

        <Text style={styles.exitText}>Salir</Text>
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
<<<<<<< HEAD
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 30,
    marginTop: 15,
    color: "#7b6cff"
=======
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
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
  },
  subtitle: {
    fontSize: 16,
    marginTop: 50,
    color: "#000"
  },
<<<<<<< HEAD
  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain"
=======
  pigImage: { 
    width: 80, 
    height: 80, 
    resizeMode: "contain", 
   
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
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
  exitText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "700"
  }
});