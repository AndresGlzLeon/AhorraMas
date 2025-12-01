import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, StyleSheet, Image, TextInput, 
  TouchableOpacity, Modal, Alert, Pressable, Dimensions 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import DatabaseService from '../database/DatabaseService';

const { width } = Dimensions.get("window");
const dbService = new DatabaseService();

export default function PagosProgramados({ navigation }) {
  const [pagos, setPagos] = useState([]);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  
  const [nuevoPago, setNuevoPago] = useState({ titulo: "", monto: "", fecha: "", tipo: "Mensual" });
  const [editPagoId, setEditPagoId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      await dbService.init();
      if (!dbService.isWeb) {
        await dbService.db.execAsync(`
          CREATE TABLE IF NOT EXISTS pagos_programados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            monto REAL,
            fecha TEXT,
            tipo TEXT
          );
        `);
      }
      const resultados = await dbService.query("SELECT * FROM pagos_programados");
      setPagos(resultados);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerIcono = (titulo) => {
    const t = titulo ? titulo.toLowerCase() : "";
    if (t.includes("alquiler") || t.includes("casa") || t.includes("renta")) return require("../assets/alquiler.png");
    if (t.includes("auto") || t.includes("carro") || t.includes("transporte")) return require("../assets/auto.png");
    if (t.includes("servicio") || t.includes("luz") || t.includes("agua")) return require("../assets/servicios.png");
    return require("../assets/servicios.png");
  };

  const agregarPago = async () => {
    if (!nuevoPago.titulo || !nuevoPago.monto) {
      Alert.alert("Error", "Faltan datos");
      return;
    }
    await dbService.insert('pagos_programados', {
      titulo: nuevoPago.titulo,
      monto: parseFloat(nuevoPago.monto),
      fecha: nuevoPago.fecha,
      tipo: "Mensual"
    });
    setNuevoPago({ titulo: "", monto: "", fecha: "", tipo: "Mensual" });
    setModalAdd(false);
    cargarDatos();
  };

  const abrirEditar = (item) => {
    setEditPagoId(item.id);
    setNuevoPago({ titulo: item.titulo, monto: item.monto.toString(), fecha: item.fecha, tipo: item.tipo });
    setModalEdit(true);
  };

  const guardarEdicion = async () => {
    if (!nuevoPago.titulo || !nuevoPago.monto) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    
    await dbService.update('pagos_programados', editPagoId, {
      titulo: nuevoPago.titulo,
      monto: parseFloat(nuevoPago.monto),
      fecha: nuevoPago.fecha,
      tipo: "Mensual"
    });
    setEditPagoId(null);
    setNuevoPago({ titulo: "", monto: "", fecha: "", tipo: "Mensual" });
    setModalEdit(false);
    cargarDatos();
  };

  const eliminarPagoDirecto = async (id) => {
    try {
      await dbService.delete('pagos_programados', id);
      Alert.alert("Eliminado", "El pago ha sido eliminado correctamente");
      cargarDatos();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el pago");
      console.error(error);
    }
  };

  const confirmarEliminar = (id, titulo) => {
    Alert.alert(
      "Eliminar Pago", 
      `¿Estás seguro de eliminar "${titulo}"?`, 
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => eliminarPagoDirecto(id) 
        }
      ]
    );
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
                  <Text style={styles.welcome}>Gastos{"\n"}Programados</Text>
                  <Text style={{color: '#666'}}>Planifica tus gastos</Text>
                </View>
                <Image source={require("../assets/logo.png")} style={styles.pigImage} />
              </View>
        

        {pagos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tienes pagos programados</Text>
            <Text style={styles.emptySubtext}>Añade tus gastos recurrentes para no olvidarlos</Text>
          </View>
        ) : (
          pagos.map((pago) => (
            <View key={pago.id} style={styles.card}>
              <TouchableOpacity 
                style={styles.cardContent}
                onPress={() => abrirEditar(pago)}
              >
                <Image source={obtenerIcono(pago.titulo)} style={styles.iconPago} />
                <View style={styles.infoPago}>
                  <Text style={styles.tituloPago}>{pago.titulo}</Text>
                  <Text style={styles.fechaPago}>{pago.fecha} • {pago.tipo}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.montoPago}>-${pago.monto}</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.btnEdit}
                  onPress={() => abrirEditar(pago)}
                >
                  <Ionicons name="pencil" size={16} color="white"/>
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.btnDelete}
                  onPress={() => confirmarEliminar(pago.id, pago.titulo)}
                >
                  <Ionicons name="trash" size={16} color="white"/>
                  <Text style={styles.btnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity 
          style={styles.btnBigAdd} 
          onPress={() => {
            setNuevoPago({ titulo: "", monto: "", fecha: "", tipo: "Mensual" });
            setModalAdd(true);
          }}
        >
          <Ionicons name="calendar" size={24} color="#7b6cff" style={{marginRight: 10}} />
          <Text style={styles.btnBigAddText}>Añadir Pago</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Agregar */}
      <Modal visible={modalAdd} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Agregar Pago Programado</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Título (ej: Alquiler)" 
              value={nuevoPago.titulo} 
              onChangeText={t => setNuevoPago({...nuevoPago, titulo: t})} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Monto ($)" 
              keyboardType="numeric" 
              value={nuevoPago.monto} 
              onChangeText={t => setNuevoPago({...nuevoPago, monto: t})} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Fecha (ej: Día 5 de cada mes)" 
              value={nuevoPago.fecha} 
              onChangeText={t => setNuevoPago({...nuevoPago, fecha: t})} 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalAdd(false)}
              >
                <Text style={styles.btnTextModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={agregarPago}
              >
                <Text style={styles.btnTextModal}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar */}
      <Modal visible={modalEdit} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Pago Programado</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Título" 
              value={nuevoPago.titulo} 
              onChangeText={t => setNuevoPago({...nuevoPago, titulo: t})} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Monto ($)" 
              keyboardType="numeric" 
              value={nuevoPago.monto} 
              onChangeText={t => setNuevoPago({...nuevoPago, monto: t})} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Fecha" 
              value={nuevoPago.fecha} 
              onChangeText={t => setNuevoPago({...nuevoPago, fecha: t})} 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => {
                  setModalEdit(false);
                  setEditPagoId(null);
                }}
              >
                <Text style={styles.btnTextModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={guardarEdicion}
              >
                <Text style={styles.btnTextModal}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    padding: 15, 
    backgroundColor: "#f4f1ff", 
    borderRadius: 40,
    width: "95%", 
    alignSelf: "center", 
    marginTop: 50,
  },
  leftIcons: { flexDirection: "row", alignItems: "center" },
  iconHeader: { width: 33, height: 22, resizeMode: "contain" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  avatar: { backgroundColor: "#b3a5ff", borderRadius: 50, padding: 8 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff", resizeMode: "contain" },
  mainTitle: { fontSize: 26, fontWeight: "800", color: "#7b6cff", marginTop: 10 },
  pigImage: { width: 80, height: 80, position: 'absolute', right: 0, top: 0, resizeMode: 'contain' },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  card: {
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 15,
    shadowColor: "#b3a5ff", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 5,
    borderWidth: 1, 
    borderColor: '#f4f1ff'
  },
  cardContent: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  iconPago: { width: 45, height: 45, resizeMode: "contain", marginRight: 15 },
  infoPago: { flex: 1 },
  tituloPago: { fontSize: 18, fontWeight: "bold", color: "#333" },
  fechaPago: { fontSize: 14, color: "#888", marginTop: 2 },
  montoPago: { fontSize: 18, fontWeight: "bold", color: "#000", textAlign: 'right' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  btnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b6cff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 0.48,
    justifyContent: 'center',
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding:10,
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
  btnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7675',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 0.48,
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  btnBigAdd: {
    backgroundColor: '#f4f1ff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  btnBigAddText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 25, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: { padding: 10, backgroundColor: "#ccc", borderRadius: 10, width: "45%", alignItems: "center" },
  saveBtn: { padding: 10, backgroundColor: "#7b6cff", borderRadius: 10, width: "45%", alignItems: "center" },
  btnTextModal: { color: "#fff", fontWeight: "bold" },
});