import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, Pressable, 
  Modal, TextInput, TouchableOpacity, Alert, Dimensions, ActivityIndicator 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DatabaseService from '../database/DatabaseService';

const { width } = Dimensions.get("window");
const dbService = new DatabaseService();

export default function Presupuesto() {
  const navigation = useNavigation();

  // Estados visuales (idénticos a tu código)
  const [presupuestoTotal, setPresupuestoTotal] = useState(0); // Ahora se calcula solo
  const [gastos, setGastos] = useState([]); // Esto ahora son tus "Presupuestos por Categoría"
  const [loading, setLoading] = useState(true);

  // Estados de Modales (Intactos)
  const [modalVisible, setModalVisible] = useState(false); // Para el total (informativo o ajuste)
  const [modalGastoVisible, setModalGastoVisible] = useState(false); // Para agregar/editar items

  // Formulario
  const [nuevoGasto, setNuevoGasto] = useState({ nombre: "", monto: "", categoria: "" });
  const [editandoGastoId, setEditandoGastoId] = useState(null);

  // --- LOGICA BD ---
  
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await dbService.init();
      
      // 1. Cargar las metas/presupuestos de la BD
      // Usamos el mes actual como filtro (Requisito Rúbrica)
      const mesActual = new Date().getMonth() + 1;
      const metas = await dbService.query('SELECT * FROM presupuestos WHERE mes = ?', [mesActual]);
      
      // 2. Cargar lo gastado real (Transacciones)
      const transacciones = await dbService.query('SELECT * FROM transacciones WHERE tipo = ?', ['egreso']);

      // 3. Procesar datos para que encajen en tu diseño
      let totalMeta = 0;
      let totalGastadoReal = 0;

      const itemsProcesados = metas.map(meta => {
        // Calcular cuánto se ha gastado en esta categoría
        const gastadoEnCategoria = transacciones
          .filter(t => t.categoria.toLowerCase() === meta.categoria.toLowerCase())
          .reduce((sum, t) => sum + t.monto, 0);

        totalMeta += meta.monto;
        totalGastadoReal += gastadoEnCategoria;

        return {
          id: meta.id,
          nombre: meta.categoria, // Mapeamos 'categoria' a 'nombre' para tu UI
          monto: meta.monto,
          gastado: gastadoEnCategoria,
          porcentaje: Math.min((gastadoEnCategoria / meta.monto) * 100, 100)
        };
      });

      setGastos(itemsProcesados);
      setPresupuestoTotal(totalMeta); // El presupuesto total es la suma de las categorías

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD (CONECTADO A BD) ---

  const agregarGasto = async () => {
    if (!nuevoGasto.nombre || !nuevoGasto.monto) {
      Alert.alert("Error", "Completa los campos");
      return;
    }

    try {
      // Guardar en BD
      await dbService.insert('presupuestos', {
        usuarioId: 1,
        categoria: nuevoGasto.nombre, // Usamos el nombre como categoría
        monto: parseFloat(nuevoGasto.monto),
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear()
      });

      setNuevoGasto({ nombre: "", monto: "", categoria: "" });
      setModalGastoVisible(false);
      cargarDatos(); // Recargar visual
    } catch (error) {
      console.error(error);
    }
  };

  const editarGasto = async () => {
    try {
      await dbService.update('presupuestos', editandoGastoId, {
        categoria: nuevoGasto.nombre,
        monto: parseFloat(nuevoGasto.monto),
        mes: new Date().getMonth() + 1
      });
      
      setEditandoGastoId(null);
      setNuevoGasto({ nombre: "", monto: "", categoria: "" });
      setModalGastoVisible(false);
      cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarGasto = (id) => {
    Alert.alert("Eliminar", "¿Borrar este presupuesto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
          await dbService.delete('presupuestos', id);
          cargarDatos();
      }}
    ]);
  };

  // --- UI HELPERS ---

  const abrirModalEditar = (gasto) => {
    setEditandoGastoId(gasto.id);
    setNuevoGasto({ nombre: gasto.nombre, monto: gasto.monto.toString() });
    setModalGastoVisible(true);
  };

  // Cálculos visuales para la tarjeta principal
  // Total asignado (Presupuesto) vs Total Gastado Real
  const totalGastadoReal = gastos.reduce((acc, item) => acc + item.gastado, 0);
  const porcentajeTotal = presupuestoTotal > 0 ? (totalGastadoReal / presupuestoTotal) * 100 : 0;
  const restante = presupuestoTotal - totalGastadoReal;

  return (
    <View style={styles.container}>

      {/* --- HEADER ORIGINAL --- */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <Pressable onPress={() => navigation.navigate('Ajustes')}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Notificaciones')}>
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
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

        {/* --- HERO SECTION (CERDITO) --- */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Presupuesto</Text>
            <Text style={{color: '#666'}}>Planifica tus gastos</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* --- TARJETA PRINCIPAL (PRESUPUESTO INICIAL) --- */}
        <View style={styles.cardMain}>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 10}}>
            <Text style={styles.cardLabel}>Presupuesto Total</Text>
            <Text style={styles.cardValue}>${presupuestoTotal.toFixed(2)}</Text>
          </View>
          
          {/* Barra Progreso Global */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(porcentajeTotal, 100)}%` }]} />
          </View>
          
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 5}}>
            <Text style={{color:'#7b6cff'}}>{porcentajeTotal.toFixed(0)}% Gastado</Text>
            <Text style={{color:'#666'}}>${restante.toFixed(2)} Restante</Text>
          </View>
        </View>

        {/* --- BOTONES RESUMEN (Gastaste vs Restan) --- */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, {backgroundColor: '#a29bfe'}]}>
            <Text style={styles.statLabel}>Gastaste:</Text>
            <Text style={styles.statValue}>${totalGastadoReal.toFixed(0)}</Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: '#b3a5ff'}]}>
            <Text style={styles.statLabel}>Restan:</Text>
            <Text style={styles.statValue}>${restante.toFixed(0)}</Text>
          </View>
        </View>

        {/* --- LISTA DE PRESUPUESTOS (CATEGORÍAS) --- */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity onPress={() => { setEditandoGastoId(null); setNuevoGasto({nombre:'', monto:''}); setModalGastoVisible(true); }}>
            <Text style={styles.addText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {loading ? <ActivityIndicator color="#7b6cff"/> : gastos.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemCard}
            onLongPress={() => eliminarGasto(item.id)}
            onPress={() => abrirModalEditar(item)}
          >
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>{item.nombre}</Text>
                <Text style={styles.itemSub}>Límite: ${item.monto}</Text>
              </View>
              <Text style={[styles.itemAmount, {color: item.gastado > item.monto ? 'red' : '#333'}]}>
                -${item.gastado.toFixed(0)}
              </Text>
            </View>
            {/* Barra pequeña por item */}
            <View style={[styles.progressBarBg, {height: 6, marginTop: 8}]}>
               <View style={[styles.progressBarFill, { width: `${item.porcentaje}%`, backgroundColor: item.porcentaje > 100 ? '#ff7675' : '#55efc4' }]} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{height: 20}} />
      </ScrollView>

      {/* --- MODAL AGREGAR/EDITAR --- */}
      <Modal visible={modalGastoVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editandoGastoId ? "Editar Meta" : "Nueva Meta"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Categoría (Ej: Comida)"
              value={nuevoGasto.nombre}
              onChangeText={(text) => setNuevoGasto({ ...nuevoGasto, nombre: text })}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto Límite ($)"
              value={nuevoGasto.monto}
              onChangeText={(text) => setNuevoGasto({ ...nuevoGasto, monto: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalGastoVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={editandoGastoId ? editarGasto : agregarGasto}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    width: '100%',
    paddingBottom: 100, // Espacio para el menú inferior
  },

  // =========================
  // 🟣 HEADER SUPERIOR
  // =========================
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
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconHeader: {
    width: 33,
    height: 22,
    resizeMode: "contain",
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

  // =========================
  // 🐷 HERO SECTION (CERDITO)
  // =========================
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

  // =========================
  // 💳 TARJETA PRINCIPAL (TOTAL)
  // =========================
  cardMain: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7b6cff',
  },

  // =========================
  // 📊 RESUMEN (GASTASTE / RESTAN)
  // =========================
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },

  // =========================
  // 📝 LISTA DE CATEGORÍAS
  // =========================
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addText: {
    color: '#7b6cff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  itemSub: {
    fontSize: 12,
    color: '#888',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // =========================
  // 🛑 MODALES (POP-UP)
  // =========================
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#7b6cff",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#333",
  },
});