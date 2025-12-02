import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, 
  Dimensions, ActivityIndicator 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DatabaseService from '../database/DatabaseService';

const { width } = Dimensions.get("window");
const dbService = new DatabaseService();

export default function Principal({ usuario }) {
  const navigation = useNavigation();

  const [saldo, setSaldo] = useState(0);
  const [movimientosRecientes, setMovimientosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // ✅ VALIDACIÓN CRÍTICA
      if (!usuario || !usuario.id) {
        console.error('❌ Error: Usuario no definido en Principal');
        setLoading(false);
        return;
      }
      
      cargarDatosDashboard();
    }, [usuario])
  );

  const cargarDatosDashboard = async () => {
    if (!usuario || !usuario.id) {
      console.error('❌ No se puede cargar datos sin usuario');
      setLoading(false);
      return;
    }

    try {
      await dbService.init();

      const todasTransacciones = await dbService.query(
        "SELECT * FROM transacciones WHERE usuarioId = ?",
        [usuario.id]
      );
      
      let total = 0;
      todasTransacciones.forEach(t => {
        if (t.tipo === 'ingreso') {
          total += t.monto;
        } else {
          total -= t.monto;
        }
      });
      setSaldo(total);

      const recientes = await dbService.query(
        "SELECT * FROM transacciones WHERE usuarioId = ? ORDER BY id DESC LIMIT 3",
        [usuario.id]
      );
      setMovimientosRecientes(recientes);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcono = (categoria) => {
    const c = categoria ? categoria.toLowerCase() : "";
    if (c.includes("transporte") || c.includes("auto") || c.includes("gasolina")) 
      return require("../assets/transporte.png");
    if (c.includes("sueldo") || c.includes("nomina") || c.includes("ingreso")) 
      return require("../assets/sueldo.png");
    if (c.includes("despensa") || c.includes("comida") || c.includes("super")) 
      return require("../assets/despensa.png");
    return require("../assets/sueldoBajo.png"); 
  };

  const formatearFecha = (fechaISO) => {
    const d = new Date(fechaISO);
    return d.toLocaleDateString(); 
  };

  // ✅ VALIDACIÓN: Si no hay usuario, mostrar mensaje
  if (!usuario || !usuario.id) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: Usuario no identificado</Text>
          <Text style={styles.errorSubtext}>Por favor inicia sesión nuevamente</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Ahorra+ App</Text>

        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Perfil")}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.userName}>{usuario.nombre || "Usuario"}</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <Text style={styles.sectionLabel}>Tu dinero disponible:</Text>
        
        <View style={styles.balanceCard}>
          <View style={styles.balanceInner}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.balanceAmount}>
              {saldo.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </View>
          <Text style={styles.balanceFooter}>Saldo Actual</Text>
        </View>

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
                        <Image source={getIcono(item.categoria)} style={styles.transIcon} />
                      </View>
                      <View style={styles.transDetails}>
                        <Text style={styles.transTitle}>{item.categoria}</Text>
                        <Text style={styles.transDate}>
                           {formatearFecha(item.fecha)}
                        </Text>
                      </View>
                      <Text style={[
                        styles.transAmount, 
                        { color: item.tipo === 'ingreso' ? "#55efc4" : "#ff7675" } 
                      ]}>
                        {item.tipo === 'ingreso' ? '+' : '-'} ${item.monto}
                      </Text>
                    </View>

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
  container: { flex: 1, backgroundColor: "#fff" },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff7675',
    marginBottom: 10
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999'
  },
  scrollContent: { padding: 20, paddingBottom: 100 },
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
  leftIcons: { flexDirection: "row", alignItems: "center" },
  iconHeader: { width: 24, height: 24, resizeMode: "contain", tintColor: "#7b6cff" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  avatar: { backgroundColor: "#b3a5ff", borderRadius: 20, padding: 8 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff" },
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  welcomeText: { fontSize: 28, fontWeight: "800", color: "#7b6cff" },
  userName: { fontSize: 18, color: "#666", marginTop: -5, fontWeight: "600" },
  pigImage: { width: 80, height: 80, resizeMode: "contain" },
  sectionLabel: { fontSize: 16, color: "#888", marginBottom: 10, fontWeight: "600", paddingLeft: 5 },
  balanceCard: {
    backgroundColor: "#7b6cff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#7b6cff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  balanceInner: { flexDirection: 'row', alignItems: 'flex-start' },
  currencySymbol: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    marginRight: 5,
    fontWeight: "bold",
  },
  balanceAmount: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  balanceFooter: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 15, paddingLeft: 5 },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  transRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  iconContainer: { backgroundColor: "#f4f1ff", padding: 10, borderRadius: 15, marginRight: 15 },
  transIcon: { width: 24, height: 24, resizeMode: "contain" },
  transDetails: { flex: 1 },
  transTitle: { fontSize: 16, fontWeight: "700", color: "#333", textTransform: 'capitalize' },
  transDate: { fontSize: 12, color: "#999", marginTop: 2 },
  transAmount: { fontSize: 16, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 5, marginLeft: 50 },
});