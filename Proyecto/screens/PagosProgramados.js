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
    if (t.includes("alquiler") || t.includes("casa")) return require("../assets/alquiler.png");
    if (t.includes("auto") || t.includes("carro")) return require("../assets/auto.png");
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
    await dbService.update('pagos_programados', editPagoId, {
      titulo: nuevoPago.titulo,
      monto: parseFloat(nuevoPago.monto),
      fecha: nuevoPago.fecha,
      tipo: "Mensual"
    });
    setEditPagoId(null);
    setModalEdit(false);
    cargarDatos();
  };

  const eliminarPagoDirecto = async (id) => {
    await dbService.delete('pagos_programados', id);
    cargarDatos();
  };

  const confirmarEliminar = (id) => {
    Alert.alert("Eliminar", "¿Borrar pago?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => eliminarPagoDirecto(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      
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
        
        <Text style={styles.mainTitle}>Gastos{"\n"}Programados</Text>
        <Image source={require("../assets/logo.png")} style={styles.pigImage} />

        {pagos.map((pago) => (
          <TouchableOpacity 
            key={pago.id} 
            style={styles.card} 
            onPress={() => abrirEditar(pago)}
            onLongPress={() => confirmarEliminar(pago.id)}
          >
            <Image source={obtenerIcono(pago.titulo)} style={styles.iconPago} />
            <View style={styles.infoPago}>
              <Text style={styles.tituloPago}>{pago.titulo}</Text>
              <Text style={styles.fechaPago}>{pago.fecha} • {pago.tipo}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
               <Text style={styles.montoPago}>-${pago.monto}</Text>
               <View style={styles.actionIcons}>
                  <View style={styles.circleIcon}><Ionicons name="pencil" size={12} color="white"/></View>
                  <View style={[styles.circleIcon, {marginLeft: 5}]}><Ionicons name="trash" size={12} color="white"/></View>
               </View>
            </View>
          </TouchableOpacity>
        ))}

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

      
      <Modal visible={modalAdd} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Agregar Pago</Text>
            <TextInput style={styles.input} placeholder="Título" value={nuevoPago.titulo} onChangeText={t => setNuevoPago({...nuevoPago, titulo: t})} />
            <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" value={nuevoPago.monto} onChangeText={t => setNuevoPago({...nuevoPago, monto: t})} />
            <TextInput style={styles.input} placeholder="Fecha" value={nuevoPago.fecha} onChangeText={t => setNuevoPago({...nuevoPago, fecha: t})} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalAdd(false)}><Text style={styles.btnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={agregarPago}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalEdit} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Pago</Text>
            <TextInput style={styles.input} placeholder="Título" value={nuevoPago.titulo} onChangeText={t => setNuevoPago({...nuevoPago, titulo: t})} />
            <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" value={nuevoPago.monto} onChangeText={t => setNuevoPago({...nuevoPago, monto: t})} />
            <TextInput style={styles.input} placeholder="Fecha" value={nuevoPago.fecha} onChangeText={t => setNuevoPago({...nuevoPago, fecha: t})} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalEdit(false)}><Text style={styles.btnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={guardarEdicion}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  
  scrollContent: { 
    padding: 20, 
    paddingBottom: 120 
  },
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
  
  leftIcons: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  
  iconHeader: { 
    width: 33, 
    height: 22, 
    resizeMode: "contain" 
  },
  
  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#333" 
  },
  
  avatar: { 
    backgroundColor: "#b3a5ff", 
    borderRadius: 50, 
    padding: 8 
  },
  
  avatarIcon: { 
    width: 20, 
    height: 20, 
    tintColor: "#fff", 
    resizeMode: "contain" 
  },
  heroSection: {
    marginBottom: 10,
    position: 'relative',
    height: 100, 
    justifyContent: 'center'
  },

  mainTitle: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: "#7b6cff", 
    marginTop: 10 
  },
  
  pigImage: { 
    width: 80, 
    height: 80, 
    position: 'absolute', 
    right: 0, 
    top: 0, 
    resizeMode: 'contain' 
  },
  card: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: 'space-between',
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
  
  iconPago: { 
    width: 45, 
    height: 45, 
    resizeMode: "contain", 
    marginRight: 15 
  },
  
  infoPago: { 
    flex: 1 
  },
  
  tituloPago: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333" 
  },
  
  fechaPago: { 
    fontSize: 14, 
    color: "#888", 
    marginTop: 2 
  },
  
  montoPago: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#000", 
    textAlign: 'right' 
  },
  
  actionIcons: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 8 
  },
  
  circleIcon: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: '#7b6cff', 
    justifyContent: 'center', 
    alignItems: 'center' 
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
  
  btnBigAddText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  
  modalBox: { 
    width: "85%", 
    backgroundColor: "#fff", 
    borderRadius: 20, 
    padding: 25, 
    elevation: 10 
  },
  
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center", 
    color: "#333" 
  },
  
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },
  
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  
  cancelBtn: { 
    padding: 10, 
    backgroundColor: "#ccc", 
    borderRadius: 10, 
    width: "45%", 
    alignItems: "center" 
  },
  
  saveBtn: { 
    padding: 10, 
    backgroundColor: "#7b6cff", 
    borderRadius: 10, 
    width: "45%", 
    alignItems: "center" 
  },
  
  btnText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});