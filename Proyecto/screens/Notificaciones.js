import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Notificaciones() {
  const navigation = useNavigation();

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
  ];

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Notificaciones</Text>
            <Text style={styles.subtitle}>Actividad reciente</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {notificaciones.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                 <Image source={n.icon} style={styles.cardIcon} />
              </View>
              <Text style={styles.category}>{n.categoria}</Text>
            </View>
            
            <Text style={styles.message}>{n.mensaje}</Text>
            
            {n.cantidad && (
              <Text style={[styles.amount, { color: n.color }]}>
                {n.cantidad}
              </Text>
            )}
          </View>
        ))}

        {notificaciones.length === 0 && (
          <Text style={styles.emptyText}>No tienes notificaciones nuevas.</Text>
        )}

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
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#f4f1ff",
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  cardIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  category: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7b6cff",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    lineHeight: 22,
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "800",
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 50,
    fontSize: 16,
  },
});