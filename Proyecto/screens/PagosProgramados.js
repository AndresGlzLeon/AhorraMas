import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { Dimensions } from "react-native";


const { width } = Dimensions.get("window");

export default function PagosProgramados({ navigate }) {

  const [pagos, setPagos] = useState([
    { titulo: "Alquiler", monto: 1500, fecha: "10 octubre 2025", tipo: "Mensual", icon: require("../assets/alquiler.png") },
    { titulo: "Seguro Auto", monto: 750, fecha: "4 enero 2026", tipo: "Anual", icon: require("../assets/auto.png") },
    { titulo: "Pago de Servicios", monto: 589, fecha: "26 octubre 2025", tipo: "Mensual", icon: require("../assets/servicios.png") },
  ]);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const [nuevoPago, setNuevoPago] = useState({ titulo: "", monto: "", fecha: "", tipo: "Mensual" });
  const [editPagoIndex, setEditPagoIndex] = useState(null);

  const agregarPago = () => {
    if (!nuevoPago.titulo || !nuevoPago.monto || !nuevoPago.fecha) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setPagos(prev => [
      ...prev,
      {
        ...nuevoPago,
        monto: Number(nuevoPago.monto),
        icon: require("../assets/servicios.png")
      }
    ]);

    setNuevoPago({ titulo: "", monto: "", fecha: "", tipo: "Mensual" });
    setModalAdd(false);
  };

  const abrirEditar = (index) => {
    const gasto = pagos[index];
    setEditPagoIndex(index);
    setNuevoPago({
      titulo: gasto.titulo,
      monto: gasto.monto.toString(),
      fecha: gasto.fecha,
      tipo: gasto.tipo
    });
    setModalEdit(true);
  };

  const guardarEdicion = () => {
    setPagos(prev => {
      const copy = [...prev];
      copy[editPagoIndex] = {
        ...copy[editPagoIndex],
        titulo: nuevoPago.titulo,
        monto: Number(nuevoPago.monto),
        fecha: nuevoPago.fecha,
      };
      return copy;
    });

    setEditPagoIndex(null);
    setModalEdit(false);
  };

  const eliminarPagoDirecto = (index) => {
    console.log("Eliminar directo index:", index);
    setPagos(prev => prev.filter((_, i) => i !== index));
  };

  const confirmarEliminar = (index) => {
    Alert.alert(
      "Eliminar",
      "¿Seguro que deseas eliminar este pago?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminarPagoDirecto(index) }
      ]
    );
  };

  return (
    <View style={styles.container}>

      <Modal visible={modalAdd} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Agregar Pago</Text>

            <TextInput 
              style={styles.input} 
              placeholder="Título"
              value={nuevoPago.titulo}
              onChangeText={(t) => setNuevoPago({ ...nuevoPago, titulo: t })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Monto"
              keyboardType="numeric"
              value={nuevoPago.monto}
              onChangeText={(t) => setNuevoPago({ ...nuevoPago, monto: t })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Fecha"
              value={nuevoPago.fecha}
              onChangeText={(t) => setNuevoPago({ ...nuevoPago, fecha: t })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalAdd(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={agregarPago}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalEdit} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Pago</Text>

            <TextInput 
              style={styles.input} 
              placeholder="Título"
              value={nuevoPago.titulo}
              onChangeText={(t) => setNuevoPago({ ...nuevoPago, titulo: t })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Monto"
              keyboardType="numeric"
              value={nuevoPago.monto}
              onChangeText={(t) => setNuevoPago({ ...nuevoPago, monto: t })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Fecha"
              value={nuevoPago.fecha}
              onChangeText={(t) => setNuevoPago({ ...nuevoPago, fecha: t })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalEdit(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={guardarEdicion}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
        </View>
        <Text style={styles.title}>Ahorra+ App</Text>
        <View style={styles.avatar}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </View>
      </View>

      <ScrollView >
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Gastos{"\n"}Programados</Text>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <View style={styles.cardContainer}>
          {pagos.map((pago, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={pago.icon} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>{pago.titulo}</Text>
                  <Text style={styles.cardSub}>{pago.tipo}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.cardAmount}>-${pago.monto}.00</Text>
                <Text style={styles.cardDate}>{pago.fecha}</Text>

                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <TouchableOpacity
                    onPress={() => abrirEditar(index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                    style={{ padding: 6 }}
                  >
                    <Image source={require("../assets/edit.png")} style={styles.navIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => confirmarEliminar(index)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.7}
                    style={{ padding: 6, marginLeft: 8 }}
                  >
                    <Image source={require("../assets/elim.png")} style={styles.navIcon} />
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalAdd(true)}>
          <Image source={require("../assets/Programados.png")} style={styles.addIcon} />
          <Text style={styles.addText}>Añadir Pago</Text>
        </TouchableOpacity>

      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
  backgroundColor: "#fff",
  alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    width: "95%",
    marginTop: 50,
  },
  leftIcons: { flexDirection: "row", alignItems: "center" },
  iconHeader: { width: 33, height: 22, resizeMode: "contain" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  avatar: { backgroundColor: "#b3a5ff", borderRadius: 50, padding: 8 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff", resizeMode: "contain" },


  headerSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  mainTitle: { fontSize: 26, fontWeight: "700", lineHeight: 30,marginTop:15, color: "#7b6cff" },
 subtitle: { fontSize: 16, marginTop:50, color: "#rgb(0, 0, 0)"  },
  pigImage: { width: 80, height: 80, resizeMode: "contain" , marginTop:20 },

  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 10,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: -5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginTop: 0,
    paddingBottom: 0,
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  cardIcon: { width: 50, height: 50, marginRight:40, marginBottom:15, tintColor: "#7b6cff" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  cardSub: { fontSize: 13, color: "#777" },
  cardAmount: { fontSize: 16, fontWeight: "700", color: "#000" },
  cardDate: { fontSize: 12, color: "#777" },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f1ff",
    borderRadius: 25,
    padding: 15,
    justifyContent: "center",
  },
  addIcon: { 
  width: 25, 
  height: 25, 
  marginRight: 10,
  tintColor: "#7b6cff" },

  addText: { 
  fontSize: 16, 
  color: "#000",
  fontWeight: "500" },

navIcon: { width: 26, 
height: 26, 
resizeMode: "contain" },

buttonSpacing: {
  marginTop: 10,
},

modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
},
modalBox: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 20,
  width: "85%",
},
modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#7b6cff",
  textAlign: "center",
  marginBottom: 15,
},
modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
},
cancelBtn: {
  backgroundColor: "#ff6b6b",
  padding: 12,
  borderRadius: 12,
  width: "45%",
  alignItems: "center",
},
saveBtn: {
  backgroundColor: "#7b6cff",
  padding: 12,
  borderRadius: 12,
  width: "45%",
  alignItems: "center",
},
btnText: { color: "#fff", 
fontWeight: "bold" },

input: {
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 10,
  marginTop: 8,
  borderWidth: 1,
  borderColor: "#ddd",
},

bottomNav: {
  position: "absolute",
  bottom: 10,
  width: "95%",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#eae2ff",
  paddingVertical: 12,
  borderRadius: 30,
},
iconCircle: {
  width: 50,       
  height: 50,
  borderRadius: 15, 
  backgroundColor: "#A084E8", 
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 5, 
},

});
