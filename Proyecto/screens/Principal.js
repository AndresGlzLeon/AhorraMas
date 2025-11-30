import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, 
  Dimensions, ActivityIndicator 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DatabaseService from '../database/DatabaseService';

const { width } = Dimensions.get("window");
const dbService = new DatabaseService();

export default function Principal() {
  const navigation = useNavigation();

  // Estados para datos reales
  const [saldo, setSaldo] = useState(0);
  const [movimientosRecientes, setMovimientosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos cada vez que la pantalla se enfoca (vuelves de agregar un gasto)
  useFocusEffect(
    useCallback(() => {
      cargarDatosDashboard();
    }, [])
  );

  const cargarDatosDashboard = async () => {
    try {
      await dbService.init();

      // 1. Calcular Saldo Total (Todos los registros)
      const todasTransacciones = await dbService.query("SELECT * FROM transacciones");
      
      let total = 0;
      todasTransacciones.forEach(t => {
        if (t.tipo === 'ingreso') {
          total += t.monto;
        } else {
          total -= t.monto;
        }
      });
      setSaldo(total);

      // 2. Obtener solo las últimas 3 para la vista previa
      // Ordenamos por ID descendente para ver las nuevas primero
      const recientes = await dbService.query("SELECT * FROM transacciones ORDER BY id DESC LIMIT 3");
      setMovimientosRecientes(recientes);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper para seleccionar icono según categoría (Texto guardado en BD)
  const getIcono = (categoria) => {
    const c = categoria ? categoria.toLowerCase() : "";
    if (c.includes("transporte") || c.includes("auto") || c.includes("gasolina")) return require("../assets/transporte.png");
    if (c.includes("sueldo") || c.includes("nomina") || c.includes("ingreso")) return require("../assets/sueldo.png");
    if (c.includes("despensa") || c.includes("comida") || c.includes("super")) return require("../assets/despensa.png");
    // Default
    return require("../assets/sueldoBajo.png"); 
  };

  // Helper para formatear fecha (Ej: "2024-10-25" -> "25/10/2024")
  const formatearFecha = (fechaISO) => {
    const d = new Date(fechaISO);
    return d.toLocaleDateString(); 
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Notificaciones")}>
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 15 }]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Ahorra+ App</Text>

        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Perfil")}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* WELCOME SECTION */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.subWelcomeText}>Consulta tus gastos</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* BALANCE CARD (CON DATOS REALES) */}
        <Text style={styles.sectionLabel}>Tu dinero disponible:</Text>
        <View style={styles.balanceCard}>
          <View style={styles.balanceInner}>
            <Text style={styles.currencySymbol}>$</Text>
            {/* Formateamos el saldo con comas y 2 decimales */}
            <Text style={styles.balanceAmount}>
              {saldo.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </View>
          <Text style={styles.balanceFooter}>Saldo Actual</Text>
        </View>

        {/* TRANSACTIONS (LISTA DINÁMICA) */}
        <Text style={styles.sectionTitle}>Últimas transacciones</Text>

        <View style={styles.transactionCard}>
          {loading ? (
            <ActivityIndicator size="small" color="#7b6cff" style={{padding: 20}} />
          ) : (
            <>
              {movimientosRecientes.length === 0 ? (
                <Text style={{textAlign: 'center', color: '#999', padding: 20}}>
                  No hay movimientos recientes
                </Text>
              ) : (
                movimientosRecientes.map((item, index) => (
                  <View key={item.id}>
                    <View style={styles.transRow}>
                      <View style={styles.iconContainer}>
                        {/* Icono dinámico basado en la categoría */}
                        <Image source={getIcono(item.categoria)} style={styles.transIcon} />
                      </View>
                      <View style={styles.transDetails}>
                        <Text style={styles.transTitle}>{item.categoria}</Text>
                        <Text style={styles.transDate}>
                           {formatearFecha(item.fecha)}
                           {/* Puedes agregar item.descripcion si quieres más detalle */}
                        </Text>
                      </View>
                      <Text style={[
                        styles.transAmount, 
                        { color: item.tipo === 'ingreso' ? "#55efc4" : "#ff7675" } // Verde o Rojo
                      ]}>
                        {item.tipo === 'ingreso' ? '+' : '-'} ${item.monto}
                      </Text>
                    </View>

                    {/* Divisor solo si no es el último elemento */}
                    {index < movimientosRecientes.length - 1 && <View style={styles.divider} />}
                  </View>
                ))
              )}
            </>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // =========================
  // 🟢 LAYOUT PRINCIPAL
  // =========================
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espacio para que no choque con el menú de abajo
  },

  // =========================
  // 🟣 HEADER (BARRA SUPERIOR)
  // =========================
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 50,
    backgroundColor: "#f4f1ff",
    marginHorizontal: 15,
    borderRadius: 30,
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconHeader: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: "#7b6cff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 20,
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },

  // =========================
  // 👋 SECCIÓN BIENVENIDA
  // =========================
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7b6cff",
  },
  subWelcomeText: {
    fontSize: 18,
    color: "#666",
    marginTop: -5,
  },
  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  // =========================
  // 💰 TARJETA DE SALDO
  // =========================
  sectionLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
    fontWeight: "600",
    paddingLeft: 5,
  },
  balanceCard: {
    backgroundColor: "#7b6cff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginBottom: 30,
    // Sombra suave morada
    shadowColor: "#7b6cff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  balanceInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    marginRight: 5,
    fontWeight: "bold",
  },
  balanceAmount: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  balanceFooter: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1,
  },

  // =========================
  // 📋 LISTA DE TRANSACCIONES
  // =========================
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    paddingLeft: 5,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    // Sombra sutil gris
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  transRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: "#f4f1ff",
    padding: 10,
    borderRadius: 15,
    marginRight: 15,
  },
  transIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  transDetails: {
    flex: 1,
  },
  transTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textTransform: 'capitalize', // Primera letra mayúscula
  },
  transDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  transAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    marginLeft: 50, // Deja espacio para no cortar el icono
  },
});