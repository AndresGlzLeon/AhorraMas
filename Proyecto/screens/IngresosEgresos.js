import React, { useState, useCallback } from "react";
import {
  View, Text, ScrollView, StyleSheet, Image, Pressable,
  Modal, TextInput, Alert, TouchableOpacity, ActivityIndicator, Dimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';
import DatabaseService from '../database/DatabaseService';

const CATEGORIAS = ["Todas", "Sueldo", "Comida", "Transporte", "Entretenimiento", "Servicios", "Salud", "Educación", "Otros"];

const dbService = new DatabaseService();
const screenWidth = Dimensions.get("window").width;

export default function IngresosEgresos() {
  const navigation = useNavigation();

  const [transacciones, setTransacciones] = useState([]);
  const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0 });

  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [dataPastel, setDataPastel] = useState([]);
  const [dataPastelIngresos, setDataPastelIngresos] = useState([]); // <-- agregado: pastel de ingresos
  const [dataBarras, setDataBarras] = useState({
    labels: ["Ingresos", "Egresos"],
    datasets: [{ data: [0, 0] }]
  });

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
      setTransaccionesFiltradas(resultados);
      procesarDatos(resultados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...transacciones];

    // Filtro por categoría
    if (categoriaFiltro !== "Todas") {
      filtradas = filtradas.filter(t =>
        t.categoria.toLowerCase().includes(categoriaFiltro.toLowerCase())
      );
    }

    // Filtro por fecha
    if (fechaInicio) {
      filtradas = filtradas.filter(t => {
        const fechaTransaccion = new Date(t.fecha);
        const fechaInicioObj = new Date(fechaInicio);
        return fechaTransaccion >= fechaInicioObj;
      });
    }

    if (fechaFin) {
      filtradas = filtradas.filter(t => {
        const fechaTransaccion = new Date(t.fecha);
        const fechaFinObj = new Date(fechaFin);
        return fechaTransaccion <= fechaFinObj;
      });
    }

    setTransaccionesFiltradas(filtradas);
    procesarDatos(filtradas);
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setCategoriaFiltro("Todas");
    setFechaInicio("");
    setFechaFin("");
    setTransaccionesFiltradas(transacciones);
    procesarDatos(transacciones);
    setMostrarFiltros(false);
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
        const cat = t.categoria || "Otros";
        categoriasGasto[cat] = (categoriasGasto[cat] || 0) + t.monto;
      }
    });

    setResumen({ ingresos: totalIng, egresos: totalEgr });

    setDataBarras({
      labels: ["Ingresos", "Egresos"],
      datasets: [{ data: [totalIng, totalEgr] }]
    });

    const colores = ["#ff7675", "#74b9ff", "#55efc4", "#a29bfe", "#ffeaa7", "#fab1a0"];
    const pastel = Object.keys(categoriasGasto).map((key, index) => ({
      name: key,
      monto: categoriasGasto[key],
      color: colores[index % colores.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));

    if (pastel.length === 0) {
      pastel.push({ name: "Sin gastos", monto: 1, color: "#e0e0e0", legendFontColor: "#aaa", legendFontSize: 12 });
    }

    setDataPastel(pastel);

    // ---------------------------
    // Nuevo: Datos para pastel de INGRESOS por categoría
    // ---------------------------
    const categoriasIngreso = {};
    data.forEach(t => {
      if (t.tipo === 'ingreso') {
        const cat = t.categoria || "Otros";
        categoriasIngreso[cat] = (categoriasIngreso[cat] || 0) + t.monto;
      }
    });

    const coloresIng = ["#7bed9f", "#70a1ff", "#2ed573", "#1e90ff", "#7efff5", "#55efc4"];
    const pastelIngresos = Object.keys(categoriasIngreso).map((key, index) => ({
      name: key,
      monto: categoriasIngreso[key],
      color: coloresIng[index % coloresIng.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));

    if (pastelIngresos.length === 0) {
      pastelIngresos.push({ name: "Sin ingresos", monto: 1, color: "#e0e0e0", legendFontColor: "#aaa", legendFontSize: 12 });
    }

    setDataPastelIngresos(pastelIngresos);
  };

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

      cerrarModal();
      cargarDatos();
    } catch (error) { console.error(error); }
  };

  const eliminar = (id) => {
    Alert.alert("Eliminar", "¿Borrar movimiento?", [
      { text: "Cancelar" },
      {
        text: "Borrar", style: "destructive", onPress: async () => {
          await dbService.delete('transacciones', id);
          cargarDatos();
        }
      }
    ]);
  };

  const abrirModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setForm({
        monto: item.monto.toString(),
        categoria: item.categoria,
        descripcion: item.descripcion,
        tipo: item.tipo
      });
    } else {
      setEditId(null);
      setForm({ monto: "", categoria: "", descripcion: "", tipo: "egreso" });
    }
    setModalVisible(true);
  };

  const cerrarModal = () => { setModalVisible(false); setEditId(null); };

  const getIcono = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes("sueldo") || c.includes("ingreso")) return require("../assets/sueldo.png");
    if (c.includes("transporte") || c.includes("auto")) return require("../assets/transporte.png");
    return require("../assets/sueldoBajo.png");
  };

  const formatearFecha = (fechaISO) => {
    const d = new Date(fechaISO);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <Pressable onPress={() => navigation.navigate('Ajustes')}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </Pressable>
        </View>
        <Text style={styles.title}>Ahorra+ App</Text>
        <View style={styles.avatar}>
          <Pressable onPress={() => navigation.navigate('Perfil')}>
            <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>INGRESOS  & {"\n"} Egresos</Text>
            <Text style={{ color: '#666' }}>Planifica tus gastos</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>




        <View style={styles.filterRow}>
          <Text style={styles.sectionTitle}>Resumen Visual</Text>
          <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)}>
            <Text style={styles.filterButton}> Filtros</Text>
          </TouchableOpacity>
        </View>

        {mostrarFiltros && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Categoría:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={categoriaFiltro}
                onValueChange={(itemValue) => setCategoriaFiltro(itemValue)}

              >
                {CATEGORIAS.map(cat => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <Text style={styles.filterLabel}>Desde:</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={fechaInicio}
              onChangeText={setFechaInicio}
            />

            <Text style={styles.filterLabel}>Hasta:</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={fechaFin}
              onChangeText={setFechaFin}
            />

            <View style={styles.filterButtons}>
              <TouchableOpacity style={styles.btnLimpiar} onPress={limpiarFiltros}>
                <Text style={styles.btnLimpiarText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAplicar} onPress={aplicarFiltros}>
                <Text style={styles.btnAplicarText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.chartScroll}
        >
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
          </View>

          {/* ---------------------------
              NUEVA TARJETA: INGRESOS POR CATEGORÍA
              --------------------------- */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Ingresos por Categoría</Text>
            <PieChart
              data={dataPastelIngresos}
              width={screenWidth - 80}
              height={200}
              chartConfig={chartConfig}
              accessor={"monto"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>

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
          </View>
        </ScrollView>

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

        {loading ? <ActivityIndicator color="#7b6cff" /> : transaccionesFiltradas.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => abrirModal(item)} onLongPress={() => eliminar(item.id)}>
            <View style={styles.iconBox}><Image source={getIcono(item.categoria)} style={styles.cardIcon} /></View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.categoria}</Text>
              <Text style={styles.cardSub}>{item.descripcion || "Sin descripción"}</Text>
              <Text style={styles.cardDate}>{formatearFecha(item.fecha)}</Text>
            </View>
            <Text style={[styles.cardAmount, { color: item.tipo === 'ingreso' ? '#2ecc71' : '#ff7675' }]}>
              {item.tipo === 'ingreso' ? '+' : '-'}${item.monto}
            </Text>
          </Pressable>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => abrirModal()}><Text style={styles.fabText}>+</Text></TouchableOpacity>

      <ScrollView>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editId ? "Editar" : "Nuevo"}</Text>
              <View style={styles.switchContainer}>
                <Pressable style={[styles.switchBtn, form.tipo === 'ingreso' && styles.switchActiveIngreso]} onPress={() => setForm({ ...form, tipo: 'ingreso' })}><Text style={styles.switchText}>Ingreso</Text></Pressable>
                <Pressable style={[styles.switchBtn, form.tipo === 'egreso' && styles.switchActiveEgreso]} onPress={() => setForm({ ...form, tipo: 'egreso' })}><Text style={styles.switchText}>Gasto</Text></Pressable>
              </View>
              <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" value={form.monto} onChangeText={t => setForm({ ...form, monto: t })} />

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.categoria}
                  onValueChange={(itemValue) => setForm({ ...form, categoria: itemValue })}

                >
                  <Picker.Item label="Selecciona Categoría" value="" />
                  {CATEGORIAS.filter(c => c !== "Todas").map(cat => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>

              <TextInput style={styles.input} placeholder="Descripción (opcional)" value={form.descripcion} onChangeText={t => setForm({ ...form, descripcion: t })} />

              <View style={styles.modalButtons}>
                <Pressable style={styles.btnCancel} onPress={cerrarModal}><Text>Cancelar</Text></Pressable>
                <Pressable style={styles.btnSave} onPress={guardar}><Text style={{ color: 'white' }}>Guardar</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(123, 108, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },

  scrollContent: { padding: 20, width: '100%', paddingBottom: 100 },


  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 50,
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
    resizeMode: "contain",
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,

  },
  welcome: {
    fontSize: 26,
    paddingRight: 20,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
  },
  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 50,
    width: "95%",
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
  },
  iconHeader: {
    width: 33,
    height: 22,
    resizeMode: "contain", resizeMode: "contain", tintColor: '#000'
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  avatarIcon: { width: 32, height: 32, resizeMode: "contain" },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#7b6cff", paddingLeft: 5 },
  filterButton: {
    fontSize: 16,
    color: "#7b6cff",
    fontWeight: "600",
  },
  filterContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  pickerWrapper: {
    backgroundColor: "#cfc8ddff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnLimpiar: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  btnLimpiarText: { color: "#666", fontWeight: "600" },
  btnAplicar: {
    flex: 1,
    backgroundColor: "#7b6cff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnAplicarText: { color: "#fff", fontWeight: "600" },
  chartScroll: { marginBottom: 25 },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    width: screenWidth - 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginRight: 20,
  },
  chartTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
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
  summaryIcon: { width: 35, height: 35, marginRight: 10, resizeMode: 'contain' },
  summaryLabel: { fontSize: 12, color: '#555', fontWeight: '600' },
  summaryValue: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
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
  iconBox: { backgroundColor: "#f9f9f9", padding: 12, borderRadius: 15, marginRight: 15 },
  cardIcon: { width: 26, height: 26, resizeMode: "contain" },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  cardSub: { fontSize: 12, color: "#888", marginTop: 3 },
  cardDate: { fontSize: 11, color: "#aaa", marginTop: 2 },
  cardAmount: { fontSize: 16, fontWeight: "bold" },
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
  fabText: { color: "#fff", fontSize: 32, lineHeight: 34, fontWeight: "300" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 25 },
  modalContent: { backgroundColor: "#fff", borderRadius: 25, padding: 25, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  switchBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  switchActiveIngreso: { backgroundColor: '#2ecc71' },
  switchActiveEgreso: { backgroundColor: '#ff7675' },
  switchText: { fontWeight: 'bold', color: '#555', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btnCancel: {
    padding: 15,
    width: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
  },
  btnSave: { backgroundColor: "#7b6cff", padding: 15, width: "45%", alignItems: "center", borderRadius: 12 },
});
