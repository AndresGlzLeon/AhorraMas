import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, Image, ScrollView, Pressable, Alert } from "react-native";
import UsuarioController from "../controllers/UsuarioController";

export default function Ajustes({ navigation, onLogout, usuario }) {
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);
  const [controller] = useState(new UsuarioController());
  
  useEffect(() => {
    const initController = async () => {
      try {
        await controller.init();
        console.log('✅ Controlador inicializado en Ajustes');
      } catch (error) {
        console.error('❌ Error al inicializar controlador:', error);
        Alert.alert(
          "Error de Inicialización",
          "Hubo un problema al cargar la configuración. Por favor reinicia la aplicación."
        );
      }
    };

    initController();

    // Suscribirse al sistema de observadores
    const observerCallback = (action, data) => {
      console.log('📢 Evento en Ajustes:', action);
      
      if (action === 'USUARIO_LOGOUT') {
        console.log('Usuario ha cerrado sesión');
      }
    };

    controller.subscribe(observerCallback);

    // Cleanup
    return () => {
      controller.unsubscribe(observerCallback);
    };
  }, []);

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
          onPress: async () => {
            try {
              // Notificar logout
              controller.logout();
              
              // Callback a App.js
              if (onLogout) {
                onLogout();
              }

              console.log('✅ Sesión cerrada correctamente');
            } catch (error) {
              console.error('❌ Error al cerrar sesión:', error);
              Alert.alert(
                "Error",
                "Hubo un problema al cerrar sesión, pero se procederá de todos modos."
              );
              
              // Intentar cerrar sesión de todos modos
              if (onLogout) {
                onLogout();
              }
            }
          }
        }
      ]
    );
  };

  const handleNotificacionesToggle = (value) => {
    setNotificacionesActivas(value);
    
    // Aquí podrías guardar esta preferencia en la base de datos
    if (value) {
      console.log('✅ Notificaciones activadas');
    } else {
      console.log('❌ Notificaciones desactivadas');
    }
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
        
        

          <Text style={styles.sectionLabel}>GENERAL</Text>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Idioma</Text>
                <Text style={styles.cardValue}>Español (México)</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Notificaciones</Text>
                <Text style={styles.cardValue}>Alertas de presupuesto y pagos</Text>
              </View>
              <Switch
                value={notificacionesActivas}
                onValueChange={handleNotificacionesToggle}
                trackColor={{ false: "#e0e0e0", true: "#b3a5ff" }}
                thumbColor={notificacionesActivas ? "#7b6cff" : "#f4f3f4"}
              />
            </View>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
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
  logoutButton: {
    backgroundColor: "#ff7675",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  exitText: {
    fontSize: 16,
    color: "#3d0505ff",
    fontWeight: "700",
  },
});