import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, Pressable, 
  Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import PresupuestoController from '../controllers/PresupuestoController';
import DatabaseService from '../database/DatabaseService';

const CATEGORIAS = ["Comida", "Transporte", "Entretenimiento", "Servicios", "Salud", "Educación", "Otros"];

export default function Presupuesto({ usuario }) {
  const navigation = useNavigation();
  const [controller] = useState(new PresupuestoController());
  const [dbService] = useState(new DatabaseService());

  const [presupuestoTotal, setPresupuestoTotal] = useState(0); 
  const [gastos, setGastos] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [modalGastoVisible, setModalGastoVisible] = useState(false); 
  const [modalFiltros, setModalFiltros] = useState(false);

  const [nuevoGasto, setNuevoGasto] = useState({ nombre: "", monto: "" });
  const [editandoGastoId, setEditandoGastoId] = useState(null);

  // Filtros mejorados
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());

  const meses = [
    { label: "Enero", value: 1 }, { label: "Febrero", value: 2 }, { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 }, { label: "Mayo", value: 5 }, { label: "Junio", value: 6 },
    { label: "Julio", value: 7 }, { label: "Agosto", value: 8 }, { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 }, { label: "Noviembre", value: 11 }, { label: "Diciembre", value: 12 }
  ];

  useFocusEffect(
    useCallback(() => {
      if (usuario && usuario.id) {
        cargarDatos();
      }
    }, [usuario, mesFiltro, anioFiltro, categoriaFiltro])
  );

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await controller.init();
      await dbService.init();

     
      const totalIngresos = await calcularIngresosMes(usuario.id, mesFiltro, anioFiltro);
      setPresupuestoTotal(totalIngresos);

     
      let resultadoPresupuestos = await controller.obtenerPresupuestos(
        usuario.id, 
        mesFiltro, 
        anioFiltro
      );
      let metas = resultadoPresupuestos.exito ? resultadoPresupuestos.presupuestos : [];

     
      if (categoriaFiltro !== "Todas") {
        metas = metas.filter(m => m.categoria.toLowerCase() === categoriaFiltro.toLowerCase());
      }

      
      const gastosPorCategoria = await calcularGastosMes(usuario.id, mesFiltro, anioFiltro);

      const itemsProcesados = metas.map(meta => {
        const catLower = meta.categoria.toLowerCase();
        const gastadoEnCategoria = gastosPorCategoria[catLower] || 0;
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
      console.error(' Error al cargar datos:', error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const calcularIngresosMes = async (usuarioId, mes, anio) => {
    try {
      const transacciones = await dbService.query(
        `SELECT * FROM transacciones WHERE usuarioId = ? AND tipo = 'ingreso'`,
        [usuarioId]
      );

      const ingresosDelMes = transacciones.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
      });

      return ingresosDelMes.reduce((sum, t) => sum + t.monto, 0);
    } catch (error) {
      console.error('Error calculando ingresos:', error);
      return 0;
    }
  };

  const calcularGastosMes = async (usuarioId, mes, anio) => {
    try {
      const transacciones = await dbService.query(
        `SELECT * FROM transacciones WHERE usuarioId = ? AND tipo = 'egreso'`,
        [usuarioId]
      );

      const gastosDelMes = transacciones.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
      });

      const gastosPorCategoria = {};
      gastosDelMes.forEach(t => {
        const cat = t.categoria.toLowerCase();
        gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + t.monto;
      });

      return gastosPorCategoria;
    } catch (error) {
      console.error('Error calculando gastos:', error);
      return {};
    }
  };

  const aplicarFiltros = () => {
    setModalFiltros(false);
    cargarDatos();
  };

  const limpiarFiltros = () => {
    setCategoriaFiltro("Todas");
    setMesFiltro(new Date().getMonth() + 1);
    setAnioFiltro(new Date().getFullYear());
    setModalFiltros(false);
  };

  const agregarGasto = async () => {
    if (!nuevoGasto.nombre || !nuevoGasto.monto) {
      Alert.alert("Error", "Selecciona una categoría y monto");
      return;
    }

    const resultado = await controller.crearPresupuesto(
      usuario.id, nuevoGasto.nombre, parseFloat(nuevoGasto.monto), mesFiltro, anioFiltro
    );

    if (resultado.exito) {
      setNuevoGasto({ nombre: "", monto: "" });
      setModalGastoVisible(false);
      cargarDatos();
      Alert.alert("Éxito", "Presupuesto agregado");
    } else {
      Alert.alert("Error", resultado.mensaje);
    }
  };

  const editarGasto = async () => {
    const resultado = await controller.actualizarPresupuesto(
      editandoGastoId, usuario.id, nuevoGasto.nombre, 
      parseFloat(nuevoGasto.monto), mesFiltro, anioFiltro
    );
    
    if (resultado.exito) {
      setEditandoGastoId(null);
      setNuevoGasto({ nombre: "", monto: "" });
      setModalGastoVisible(false);
      cargarDatos();
      Alert.alert("Éxito", "Presupuesto actualizado");
    } else {
      Alert.alert("Error", resultado.mensaje);
    }
  };

  const eliminarGasto = (id) => {
    Alert.alert("Eliminar", "¿Borrar este presupuesto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        await controller.eliminarPresupuesto(id);
        cargarDatos();
      }}
    ]);
  };

  const abrirModalEditar = (gasto) => {
    setEditandoGastoId(gasto.id);
    setNuevoGasto({ nombre: gasto.nombre, monto: gasto.monto.toString() });
    setModalGastoVisible(true);
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
            <TouchableOpacity onPress={() => setModalFiltros(true)}>
              <Text style={styles.monthSelector}>

                 Filtrar:   {meses[mesFiltro - 1].label} {anioFiltro}
              </Text>
            </TouchableOpacity>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <View style={styles.cardMain}>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 10, alignItems: 'center'}}>
            <Text style={styles.cardLabel}>Ingresos del Mes</Text>
            <Text style={styles.infoText}>Automático</Text>
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
          <TouchableOpacity onPress={() => { 
            setEditandoGastoId(null); 
            setNuevoGasto({nombre:'', monto:''}); 
            setModalGastoVisible(true); 
          }}>
            <Text style={styles.addText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {loading ? <ActivityIndicator color="#7b6cff"/> : (
          <>
            {gastos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No hay presupuestos para {meses[mesFiltro - 1].label}
                </Text>
                
              </View>
            ) : (
              gastos.map((item) => (
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
                        <Text style={styles.warningText}> PRESUPUESTO EXCEDIDO</Text>
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
              ))
            )}
          </>
        )}

        <View style={{height: 20}} />
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

    
      <Modal visible={modalFiltros} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Período</Text>

            <Text style={styles.inputLabel}>Mes:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                 style={styles.picker}
                selectedValue={mesFiltro}
                onValueChange={(itemValue) => setMesFiltro(itemValue)}
              >
                {meses.map(mes => (
                  <Picker.Item key={mes.value} label={mes.label} value={mes.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Año:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                selectedValue={anioFiltro}
                onValueChange={(itemValue) => setAnioFiltro(itemValue)}
              >
                {[2024, 2025, 2026].map(anio => (
                  <Picker.Item key={anio} label={anio.toString()} value={anio} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Categoría:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
               style={styles.picker}
                selectedValue={categoriaFiltro}
                onValueChange={(itemValue) => setCategoriaFiltro(itemValue)}
              >
                <Picker.Item label="Todas" value="Todas" />
                {CATEGORIAS.map(cat => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  scrollContent: { padding: 20, width: '100%', paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15, marginTop: 50, width: "95%", backgroundColor: "#f4f1ff", borderRadius: 40 },
  leftIcons: { flexDirection: "row", alignItems: "center" },
  iconHeader: { width: 33, height: 22, resizeMode: "contain" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  avatar: { backgroundColor: "#b3a5ff", borderRadius: 50, padding: 8 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff", resizeMode: "contain" },
  headerSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  welcome: { fontSize: 26, paddingRight: 20, fontWeight: "700", color: "#7b6cff", lineHeight: 30 },
  monthSelector: { fontSize: 16, color: '#666', marginTop: 5, fontWeight: '600' },
  pigImage: { width: 80, height: 80, resizeMode: "contain" },
  cardMain: { backgroundColor: '#f8f9fa', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  cardLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#7b6cff', marginBottom: 10 },
  infoText: { color: '#999', fontWeight: '500', fontSize: 12, fontStyle: 'italic' },
  progressBarBg: { height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden', marginTop: 10 },
  progressBarFill: { height: '100%', backgroundColor: '#7b6cff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { width: '48%', padding: 20, borderRadius: 20, alignItems: 'center' },
  statLabel: { color: 'white', fontSize: 16, fontWeight: '600' },
  statValue: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  addText: { color: '#7b6cff', fontWeight: 'bold', fontSize: 16 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#999', fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#bbb' },
  itemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  itemCardExcedido: { borderColor: '#ff7675', borderWidth: 2, backgroundColor: '#fff5f5' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  warningText: { fontSize: 11, color: '#ff7675', marginTop: 4, fontWeight: '600' },
  itemAmount: { fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "85%", backgroundColor: "white", padding: 20, borderRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: '#333' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  picker:{height:150,weight:100, },
  pickerWrapper: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 15, backgroundColor: '#fcfcfcff' },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: { padding: 12, borderRadius: 10, width: "48%", alignItems: "center" },
  cancelButton: { backgroundColor: "#eee" },
  saveButton: { backgroundColor: "#7b6cff" },
  buttonText: { fontWeight: "bold", color: "#333" },
});