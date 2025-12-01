import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, Pressable, 
  Modal, TextInput, TouchableOpacity, Alert, Dimensions, ActivityIndicator 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import DatabaseService from '../database/DatabaseService';

const CATEGORIAS = ["Comida", "Transporte", "Entretenimiento", "Servicios", "Salud", "Educación", "Otros"];

const { width } = Dimensions.get("window");
const dbService = new DatabaseService();

export default function Presupuesto() {
  const navigation = useNavigation();

  const [presupuestoTotal, setPresupuestoTotal] = useState(0); 
  const [gastos, setGastos] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [modalPresupuestoTotal, setModalPresupuestoTotal] = useState(false);
  const [modalGastoVisible, setModalGastoVisible] = useState(false); 
  const [modalFiltros, setModalFiltros] = useState(false);

  const [nuevoPresupuestoTotal, setNuevoPresupuestoTotal] = useState("");
  const [nuevoGasto, setNuevoGasto] = useState({ nombre: "", monto: "", categoria: "" });
  const [editandoGastoId, setEditandoGastoId] = useState(null);

  // Filtros
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await dbService.init();
      
      // Crear tabla para presupuesto total si no existe
      if (!dbService.isWeb) {
        await dbService.db.execAsync(`
          CREATE TABLE IF NOT EXISTS presupuesto_total (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            monto REAL NOT NULL,
            mes INTEGER NOT NULL,
            anio INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
      }

      const mesActual = new Date().getMonth() + 1;
      const anioActual = new Date().getFullYear();

      // Obtener presupuesto total
      const presupuestoTotalDB = await dbService.query(
        'SELECT * FROM presupuesto_total WHERE mes = ? AND anio = ?', 
        [mesActual, anioActual]
      );

      if (presupuestoTotalDB && presupuestoTotalDB.length > 0) {
        setPresupuestoTotal(presupuestoTotalDB[0].monto);
      } else {
        setPresupuestoTotal(0);
      }

      // Obtener metas por categoría
      let metas = await dbService.query(
        'SELECT * FROM presupuestos WHERE mes = ? AND anio = ?', 
        [mesActual, anioActual]
      );

      // Aplicar filtros
      if (categoriaFiltro !== "Todas") {
        metas = metas.filter(m => m.categoria.toLowerCase() === categoriaFiltro.toLowerCase());
      }

      // Obtener transacciones con filtros de fecha
      let queryTransacciones = 'SELECT * FROM transacciones WHERE tipo = ?';
      let params = ['egreso'];

      if (fechaInicio || fechaFin) {
        if (fechaInicio) {
          queryTransacciones += ' AND fecha >= ?';
          params.push(fechaInicio);
        }
        if (fechaFin) {
          queryTransacciones += ' AND fecha <= ?';
          params.push(fechaFin);
        }
      }

      const transacciones = await dbService.query(queryTransacciones, params);

      let totalMeta = 0;
      let totalGastadoReal = 0;

      const itemsProcesados = metas.map(meta => {
        const gastadoEnCategoria = transacciones
          .filter(t => t.categoria.toLowerCase() === meta.categoria.toLowerCase())
          .reduce((sum, t) => sum + t.monto, 0);

        totalMeta += meta.monto;
        totalGastadoReal += gastadoEnCategoria;

        const porcentaje = Math.min((gastadoEnCategoria / meta.monto) * 100, 100);
        const excedido = gastadoEnCategoria > meta.monto;

        return {
          id: meta.id,
          nombre: meta.categoria, 
          monto: meta.monto,
          gastado: gastadoEnCategoria,
          porcentaje: porcentaje,
          excedido: excedido
        };
      });

      setGastos(itemsProcesados);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const guardarPresupuestoTotal = async () => {
    const monto = parseFloat(nuevoPresupuestoTotal);
    if (isNaN(monto) || monto <= 0) {
      Alert.alert("Error", "Ingresa un monto válido");
      return;
    }

    try {
      const mesActual = new Date().getMonth() + 1;
      const anioActual = new Date().getFullYear();

      // Verificar si ya existe
      const existe = await dbService.query(
        'SELECT * FROM presupuesto_total WHERE mes = ? AND anio = ?',
        [mesActual, anioActual]
      );

      if (existe && existe.length > 0) {
        await dbService.update('presupuesto_total', existe[0].id, {
          monto: monto,
          mes: mesActual,
          anio: anioActual
        });
      } else {
        await dbService.insert('presupuesto_total', {
          monto: monto,
          mes: mesActual,
          anio: anioActual
        });
      }

      setPresupuestoTotal(monto);
      setModalPresupuestoTotal(false);
      setNuevoPresupuestoTotal("");
      Alert.alert("Éxito", "Presupuesto total actualizado");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el presupuesto");
    }
  };

  const agregarGasto = async () => {
    if (!nuevoGasto.nombre || !nuevoGasto.monto) {
      Alert.alert("Error", "Selecciona una categoría y monto");
      return;
    }

    const monto = parseFloat(nuevoGasto.monto);
    if (isNaN(monto) || monto <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0");
      return;
    }

    try {
      const mesActual = new Date().getMonth() + 1;
      const anioActual = new Date().getFullYear();

      // Verificar que no exceda el presupuesto total
      const sumaActual = gastos.reduce((sum, g) => sum + g.monto, 0);
      if (sumaActual + monto > presupuestoTotal) {
        Alert.alert(
          "Advertencia", 
          "La suma de presupuestos por categoría excederá tu presupuesto total. ¿Deseas continuar?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Continuar", onPress: () => guardarGasto(monto, mesActual, anioActual) }
          ]
        );
        return;
      }

      await guardarGasto(monto, mesActual, anioActual);
    } catch (error) {
      console.error(error);
    }
  };

  const guardarGasto = async (monto, mes, anio) => {
    await dbService.insert('presupuestos', {
      usuarioId: 1,
      categoria: nuevoGasto.nombre, 
      monto: monto,
      mes: mes,
      anio: anio
    });

    setNuevoGasto({ nombre: "", monto: "", categoria: "" });
    setModalGastoVisible(false);
    cargarDatos();
    Alert.alert("Éxito", "Presupuesto por categoría agregado");
  };

  const editarGasto = async () => {
    const monto = parseFloat(nuevoGasto.monto);
    if (isNaN(monto) || monto <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0");
      return;
    }

    try {
      const mesActual = new Date().getMonth() + 1;
      const anioActual = new Date().getFullYear();

      await dbService.update('presupuestos', editandoGastoId, {
        categoria: nuevoGasto.nombre,
        monto: monto,
        mes: mesActual,
        anio: anioActual
      });
      
      setEditandoGastoId(null);
      setNuevoGasto({ nombre: "", monto: "", categoria: "" });
      setModalGastoVisible(false);
      cargarDatos();
      Alert.alert("Éxito", "Presupuesto actualizado");
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

  const abrirModalEditar = (gasto) => {
    setEditandoGastoId(gasto.id);
    setNuevoGasto({ nombre: gasto.nombre, monto: gasto.monto.toString() });
    setModalGastoVisible(true);
  };

  const aplicarFiltros = () => {
    setModalFiltros(false);
    cargarDatos();
  };

  const limpiarFiltros = () => {
    setCategoriaFiltro("Todas");
    setFechaInicio("");
    setFechaFin("");
    setModalFiltros(false);
    cargarDatos();
  };

  const totalGastadoReal = gastos.reduce((acc, item) => acc + item.gastado, 0);
  const porcentajeTotal = presupuestoTotal > 0 ? (totalGastadoReal / presupuestoTotal) * 100 : 0;
  const restante = presupuestoTotal - totalGastadoReal;

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
            <Text style={styles.welcome}>Presupuesto</Text>
            <Text style={{color: '#666'}}>Planifica tus gastos</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <View style={styles.cardMain}>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 10, alignItems: 'center'}}>
            <Text style={styles.cardLabel}>Presupuesto Total</Text>
            <TouchableOpacity onPress={() => {
              setNuevoPresupuestoTotal(presupuestoTotal.toString());
              setModalPresupuestoTotal(true);
            }}>
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardValue}>${presupuestoTotal.toFixed(2)}</Text>
          
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { 
                width: `${Math.min(porcentajeTotal, 100)}%`,
                backgroundColor: porcentajeTotal > 100 ? '#ff7675' : '#7b6cff'
              }
            ]} />
          </View>
          
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 5}}>
            <Text style={{color: porcentajeTotal > 100 ? '#ff7675' : '#7b6cff', fontWeight: '600'}}>
              {porcentajeTotal.toFixed(0)}% Gastado
            </Text>
            <Text style={{color:'#666'}}>${restante.toFixed(2)} Restante</Text>
          </View>
        </View>

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

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity onPress={() => setModalFiltros(true)}>
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { 
              setEditandoGastoId(null); 
              setNuevoGasto({nombre:'', monto:''}); 
              setModalGastoVisible(true); 
            }}>
              <Text style={styles.addText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? <ActivityIndicator color="#7b6cff"/> : gastos.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.itemCard, item.excedido && styles.itemCardExcedido]}
            onLongPress={() => eliminarGasto(item.id)}
            onPress={() => abrirModalEditar(item)}
          >
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>{item.nombre}</Text>
                <Text style={styles.itemSub}>Límite: ${item.monto}</Text>
                {item.excedido && (
                  <Text style={styles.warningText}>⚠️ Presupuesto excedido</Text>
                )}
              </View>
              <Text style={[styles.itemAmount, {color: item.excedido ? '#ff7675' : '#333'}]}>
                -${item.gastado.toFixed(0)}
              </Text>
            </View>
            <View style={[styles.progressBarBg, {height: 6, marginTop: 8}]}>
               <View style={[
                 styles.progressBarFill, 
                 { 
                   width: `${Math.min(item.porcentaje, 100)}%`, 
                   backgroundColor: item.excedido ? '#ff7675' : '#55efc4' 
                 }
               ]} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{height: 20}} />
      </ScrollView>

      {/* Modal Presupuesto Total */}
      <ScrollView>
      <Modal visible={modalPresupuestoTotal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Presupuesto Total Mensual</Text>
            <Text style={styles.modalSubtitle}>
              Define cuánto dinero planeas gastar este mes
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto Total ($)"
              value={nuevoPresupuestoTotal}
              onChangeText={setNuevoPresupuestoTotal}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalPresupuestoTotal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={guardarPresupuestoTotal}
              >
                <Text style={[styles.buttonText, {color: '#fff'}]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>

      {/* Modal Categoría */}
      <ScrollView>
      <Modal visible={modalGastoVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editandoGastoId ? "Editar Presupuesto" : "Nuevo Presupuesto"}
            </Text>

            <Text style={styles.inputLabel}>Categoría:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={nuevoGasto.nombre}
                onValueChange={(itemValue) => setNuevoGasto({ ...nuevoGasto, nombre: itemValue })}
              >
                <Picker.Item label="Selecciona una categoría" value="" />
                {CATEGORIAS.map(cat => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Monto Límite:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto ($)"
              value={nuevoGasto.monto}
              onChangeText={(text) => setNuevoGasto({ ...nuevoGasto, monto: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalGastoVisible(false);
                  setEditandoGastoId(null);
                  setNuevoGasto({ nombre: "", monto: "" });
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={editandoGastoId ? editarGasto : agregarGasto}
              >
                <Text style={[styles.buttonText, {color: '#fff'}]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
      <ScrollView>
      {/* Modal Filtros */}
      <Modal visible={modalFiltros} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Presupuestos</Text>

            <Text style={styles.inputLabel}>Categoría:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={categoriaFiltro}
                onValueChange={(itemValue) => setCategoriaFiltro(itemValue)}
              >
                <Picker.Item label="Todas" value="Todas" />
                {CATEGORIAS.map(cat => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Desde:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={fechaInicio}
              onChangeText={setFechaInicio}
            />

            <Text style={styles.inputLabel}>Hasta:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={fechaFin}
              onChangeText={setFechaFin}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={limpiarFiltros}
              >
                <Text style={styles.buttonText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={aplicarFiltros}
              >
                <Text style={[styles.buttonText, {color: '#fff'}]}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    width: '100%',
    paddingBottom: 100, 
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7b6cff',
    marginBottom: 10,
  },
  editBtnText: {
    color: '#7b6cff',
    fontWeight: '600',
    fontSize: 14,
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
  filterText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  itemCardExcedido: {
    borderColor: '#ff7675',
    borderWidth: 2,
    backgroundColor: '#fff5f5',
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
    marginTop: 2,
  },
  warningText: {
    fontSize: 11,
    color: '#ff7675',
    marginTop: 4,
    fontWeight: '600',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    marginBottom: 10,
    textAlign: "center",
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 5,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#cfc8ddff',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    width: "48%",
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