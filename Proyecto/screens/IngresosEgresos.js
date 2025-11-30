import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, Pressable, 
  Modal, TextInput, Alert, TouchableOpacity, ActivityIndicator, Dimensions 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PieChart, BarChart } from "react-native-chart-kit"; // 📊 Importamos gráficas
import DatabaseService from '../database/DatabaseService';

const dbService = new DatabaseService();
const screenWidth = Dimensions.get("window").width;

export default function IngresosEgresos() {
  const navigation = useNavigation();

  // Estados de datos
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0 });
  
  // Estados para Gráficas
  const [dataPastel, setDataPastel] = useState([]);
  const [dataBarras, setDataBarras] = useState({
    labels: ["Ingresos", "Egresos"],
    datasets: [{ data: [0, 0] }]
  });

  // Modal y Form
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ monto: "", categoria: "", descripcion: "", tipo: "egreso" });

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await dbService.init();
      const sql = 'SELECT * FROM transacciones ORDER BY id DESC'; 
      const resultados = await dbService.query(sql);
      setTransacciones(resultados);

      procesarDatos(resultados);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const procesarDatos = (data) => {
    let totalIng = 0;
    let totalEgr = 0;
    const categoriasGasto = {};

    data.forEach(t => {
      if (t.tipo === 'ingreso') {
        totalIng += t.monto;
      } else {
        totalEgr += t.monto;
        // Agrupar por categoría para el pastel
        const cat = t.categoria || "Otros";
        categoriasGasto[cat] = (categoriasGasto[cat] || 0) + t.monto;
      }
    });

    setResumen({ ingresos: totalIng, egresos: totalEgr });

    // 1. Configurar Gráfica de Barras (Balance)
    setDataBarras({
      labels: ["Ingresos", "Egresos"],
      datasets: [{ data: [totalIng, totalEgr] }]
    });

    // 2. Configurar Gráfica de Pastel (Categorías)
    const colores = ["#ff7675", "#74b9ff", "#55efc4", "#a29bfe", "#ffeaa7", "#fab1a0"];
    const pastel = Object.keys(categoriasGasto).map((key, index) => ({
      name: key,
      monto: categoriasGasto[key],
      color: colores[index % colores.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));
    
    // Si no hay gastos, poner uno dummy para que no se vea vacío
    if (pastel.length === 0) {
      pastel.push({ name: "Sin gastos", monto: 1, color: "#e0e0e0", legendFontColor: "#aaa", legendFontSize: 12 });
    }
    
    setDataPastel(pastel);
  };

  // --- CRUD ---
  const guardar = async () => {
    if (!form.monto || !form.categoria) return Alert.alert("Faltan datos", "Ingresa monto y categoría");
    try {
      const datos = {
        monto: parseFloat(form.monto),
        categoria: form.categoria,
        descripcion: form.descripcion || "Sin descripción",
        tipo: form.tipo,
        usuarioId: 1,
        fecha: new Date().toISOString()
      };
      if (editId) await dbService.update('transacciones', editId, datos);
      else await dbService.insert('transacciones', datos);
      
      cerrarModal(); cargarDatos();
    } catch (error) { console.error(error); }
  };

  const eliminar = (id) => {
    Alert.alert("Eliminar", "¿Borrar movimiento?", [{ text: "Cancelar" }, { text: "Borrar", style: "destructive", onPress: async () => { await dbService.delete('transacciones', id); cargarDatos(); }}]);
  };

  // --- UI ---
  const abrirModal = (item = null) => {
    if (item) { setEditId(item.id); setForm({ monto: item.monto.toString(), categoria: item.categoria, descripcion: item.descripcion, tipo: item.tipo }); }
    else { setEditId(null); setForm({ monto: "", categoria: "", descripcion: "", tipo: "egreso" }); }
    setModalVisible(true);
  };
  const cerrarModal = () => { setModalVisible(false); setEditId(null); };
  const getIcono = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes("sueldo") || c.includes("ingreso")) return require("../assets/sueldo.png");
    if (c.includes("transporte") || c.includes("auto")) return require("../assets/transporte.png");
    return require("../assets/sueldoBajo.png");
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Ajustes')}>
          <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
        </Pressable>
        <Text style={styles.headerTitle}>Movimientos</Text>
        <Pressable onPress={() => navigation.navigate('Perfil')}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === CARRUSEL DE GRÁFICAS (Deslizable) === */}
        <Text style={styles.sectionTitle}>Resumen Visual</Text>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false} 
          style={styles.chartScroll}
        >
          {/* SLIDE 1: GRÁFICA DE PASTEL */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos por Categoría</Text>
            <PieChart
              data={dataPastel}
              width={screenWidth - 80}
              height={200}
              chartConfig={chartConfig}
              accessor={"monto"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
            <Text style={styles.swipeHint}>Desliza para ver Balance 👉</Text>
          </View>

          {/* SLIDE 2: GRÁFICA DE BARRAS */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Balance Mensual</Text>
            <BarChart
              data={dataBarras}
              width={screenWidth - 80}
              height={220}
              yAxisLabel="$"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
              showValuesOnTopOfBars
            />
            <Text style={styles.swipeHint}>👈 Desliza para ver Categorías</Text>
          </View>
        </ScrollView>

        {/* RESUMEN TARJETAS */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: '#e8f5e9' }]}>
            <Image source={require("../assets/sueldo.png")} style={styles.summaryIcon} />
            <View>
              <Text style={styles.summaryLabel}>Ingresos</Text>
              <Text style={[styles.summaryValue, { color: '#2ecc71' }]}>+${resumen.ingresos}</Text>
            </View>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#ffebee' }]}>
            <Image source={require("../assets/sueldoBajo.png")} style={styles.summaryIcon} />
            <View>
              <Text style={styles.summaryLabel}>Gastos</Text>
              <Text style={[styles.summaryValue, { color: '#e63946' }]}>-${resumen.egresos}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Historial</Text>

        {loading ? <ActivityIndicator color="#7b6cff" /> : transacciones.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => abrirModal(item)} onLongPress={() => eliminar(item.id)}>
            <View style={styles.iconBox}><Image source={getIcono(item.categoria)} style={styles.cardIcon} /></View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.categoria}</Text>
              <Text style={styles.cardSub}>{item.descripcion || "Sin descripción"}</Text>
            </View>
            <Text style={[styles.cardAmount, { color: item.tipo === 'ingreso' ? '#2ecc71' : '#ff7675' }]}>
              {item.tipo === 'ingreso' ? '+' : '-'}${item.monto}
            </Text>
          </Pressable>
        ))}
        <View style={{height: 20}} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => abrirModal()}><Text style={styles.fabText}>+</Text></TouchableOpacity>

      {/* MODAL (Simplificado visualmente) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? "Editar" : "Nuevo"}</Text>
            <View style={styles.switchContainer}>
              <Pressable style={[styles.switchBtn, form.tipo === 'ingreso' && styles.switchActiveIngreso]} onPress={() => setForm({...form, tipo: 'ingreso'})}><Text style={styles.switchText}>Ingreso</Text></Pressable>
              <Pressable style={[styles.switchBtn, form.tipo === 'egreso' && styles.switchActiveEgreso]} onPress={() => setForm({...form, tipo: 'egreso'})}><Text style={styles.switchText}>Gasto</Text></Pressable>
            </View>
            <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" value={form.monto} onChangeText={t => setForm({...form, monto: t})} />
            <TextInput style={styles.input} placeholder="Categoría" value={form.categoria} onChangeText={t => setForm({...form, categoria: t})} />
            <View style={styles.modalButtons}>
              <Pressable style={styles.btnCancel} onPress={cerrarModal}><Text>Cancelar</Text></Pressable>
              <Pressable style={styles.btnSave} onPress={guardar}><Text style={{color:'white'}}>Guardar</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(123, 108, 255, ${opacity})`, // Morado base
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
};

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
    paddingBottom: 100, // Espacio para el menú inferior
  },

  // =========================
  // 🟣 HEADER SUPERIOR
  // =========================
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 50,
    backgroundColor: "#f4f1ff",
    marginHorizontal: 15,
    borderRadius: 30,
  },
  iconHeader: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: '#7b6cff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  avatarIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  // =========================
  // 📊 CARRUSEL DE GRÁFICAS
  // =========================
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#7b6cff",
    marginBottom: 15,
    paddingLeft: 5,
  },
  chartScroll: {
    marginBottom: 25,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    width: screenWidth - 40, // Ocupa casi todo el ancho
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginRight: 20, // Espacio si hubiera margen en el scroll
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  swipeHint: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 15,
    fontStyle: 'italic',
  },

  // =========================
  // 💳 TARJETAS DE RESUMEN
  // =========================
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  summaryCard: {
    width: '48%',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  summaryIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
    resizeMode: 'contain',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // =========================
  // 📝 LISTA DE MOVIMIENTOS
  // =========================
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 15,
    marginRight: 15,
  },
  cardIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  cardSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // =========================
  // ➕ BOTÓN FLOTANTE (FAB)
  // =========================
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#7b6cff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#7b6cff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "300",
  },

  // =========================
  // 🛑 MODAL (POP-UP)
  // =========================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 25,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  
  // Switch Ingreso/Gasto
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  switchActiveIngreso: {
    backgroundColor: '#2ecc71', // Verde
  },
  switchActiveEgreso: {
    backgroundColor: '#ff7675', // Rojo
  },
  switchText: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 14,
  },

  // Inputs y Botones
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnCancel: {
    padding: 15,
    width: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
  },
  btnSave: {
    backgroundColor: "#7b6cff",
    padding: 15,
    width: "45%",
    alignItems: "center",
    borderRadius: 12,
  },
});