import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Image, ScrollView, Pressable, Alert, TouchableOpacity } from "react-native";

export default function Ajustes({ navigation, onLogout }) {
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => {
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Preferencias</Text>
            <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <View style={styles.content}>
          
          <Text style={styles.sectionLabel}>CUENTA</Text>
          
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Idioma</Text>
                <Text style={styles.cardValue}>Español (México)</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Miembro desde</Text>
                <Text style={styles.cardValue}>Febrero de 2023</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>GENERAL</Text>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Notificaciones</Text>
                <Text style={styles.cardValue}>Alertas de presupuesto y pagos</Text>
              </View>
              <Switch
                value={notificacionesActivas}
                onValueChange={setNotificacionesActivas}
                trackColor={{ false: "#e0e0e0", true: "#b3a5ff" }}
                thumbColor={notificacionesActivas ? "#7b6cff" : "#f4f3f4"}
              />
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backArrow: {
    fontSize: 28,
    color: "#7b6cff",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7b6cff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  pigImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  content: {
    width: "100%",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#aaa",
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 5,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  editText: {
    fontSize: 14,
    color: "#7b6cff",
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#ff7675",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000ff", 
  },
  exitText: {
    fontSize: 16,
    color: "#000000ff",
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    color: "#ddd",
    marginTop: 20,
    fontSize: 12,
  },
});