import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Image, ScrollView, Pressable, Alert } from "react-native";

export default function Ajustes({navigation, onLogout}) {
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
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 30,
    marginTop: 15,
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
    resizeMode: "contain"
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