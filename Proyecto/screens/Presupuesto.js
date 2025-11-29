import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  Animated, 
  Modal, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Presupuesto() {
  const navigation = useNavigation();

  const [presupuesto, setPresupuesto] = useState(10555);
  const [gastos, setGastos] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);

  const [nuevoGasto, setNuevoGasto] = useState({ nombre: "", monto: "", categoria: "" });
  const [editandoGasto, setEditandoGasto] = useState(null);

  const totalGastado = gastos.reduce((total, gasto) => total + gasto.monto, 0);
  const porcentajeGastado = (totalGastado / presupuesto) * 100;
  const restante = presupuesto - totalGastado;

  // CRUD
  const agregarGasto = () => {
    if (!nuevoGasto.nombre || !nuevoGasto.monto) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const gasto = {
      id: Date.now(),
      nombre: nuevoGasto.nombre,
      monto: Number(nuevoGasto.monto),
    };

    setGastos([...gastos, gasto]);
    setNuevoGasto({ nombre: "", monto: "" });
    setModalGastoVisible(false);
  };

  const editarGasto = () => {
    if (!nuevoGasto.nombre || !nuevoGasto.monto) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setGastos(gastos.map(gasto => 
      gasto.id === editandoGasto.id 
        ? { ...gasto, nombre: nuevoGasto.nombre, monto: Number(nuevoGasto.monto) }
        : gasto
    ));

    setEditandoGasto(null);
    setNuevoGasto({ nombre: "", monto: "" });
    setModalGastoVisible(false);
  };

  const eliminarGasto = (id) => {
    Alert.alert(
      "Eliminar gasto",
      "¿Estás seguro de que quieres eliminar este gasto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => setGastos(gastos.filter(g => g.id !== id)) }
      ]
    );
  };

  const abrirModalEditar = (gasto) => {
    setEditandoGasto(gasto);
    setNuevoGasto({ nombre: gasto.nombre, monto: gasto.monto.toString() });
    setModalGastoVisible(true);
  };

  return (
    <View style={styles.container}>

      {/* Modal editar presupuesto */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Presupuesto</Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Presupuesto mensual"
              value={presupuesto.toString()}
              onChangeText={(text) => setPresupuesto(Number(text) || 0)}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal agregar / editar gasto */}
      <Modal visible={modalGastoVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editandoGasto ? "Editar Gasto" : "Agregar Gasto"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del gasto"
              value={nuevoGasto.nombre}
              onChangeText={(text) => setNuevoGasto({ ...nuevoGasto, nombre: text })}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto"
              value={nuevoGasto.monto}
              onChangeText={(text) => setNuevoGasto({ ...nuevoGasto, monto: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalGastoVisible(false);
                  setEditandoGasto(null);
                  setNuevoGasto({ nombre: "", monto: "" });
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={editandoGasto ? editarGasto : agregarGasto}
              >
                <Text style={styles.buttonText}>{editandoGasto ? "Guardar" : "Agregar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal", { screen: "Ajustes" })}>
          <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Principal", { screen: "Notificaciones" })}>
          <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Principal", { screen: "Perfil" })}>
        <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
          </TouchableOpacity>
      </View>

      {/* SCROLL RESPONSIVO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Presupuesto{"\n"}</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* Tarjeta presupuesto */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.cardTitle}>
              Presupuesto mensual: ${presupuesto.toLocaleString()}{" "}
              <Image source={require("../assets/edit.png")} style={styles.navIcon} />
            </Text>
          </TouchableOpacity>

          <View style={styles.progressBar}>  
            <Animated.View 
              style={[
                StyleSheet.absoluteFill, 
                {
                  width: `${Math.min(porcentajeGastado, 100)}%`, 
                  backgroundColor: porcentajeGastado > 80 ? "#ff6b6b" : "#7b6cff",
                  borderRadius: 15
                }
              ]}
            />
          </View>

          <View style={styles.cardLeft}>
            <Text style={styles.cardSub}>Gastado: {porcentajeGastado.toFixed(1)}%</Text>
            <Text style={styles.cardAmount2}>Restan: {(100 - porcentajeGastado).toFixed(1)}%</Text>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Gastaste:</Text>
          <Text style={styles.title}>Te restan:</Text>
        </View>

        <View style={styles.headerSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.amount}>${totalGastado.toLocaleString()}</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.amount}>${restante.toLocaleString()}</Text>
          </View>
        </View>

        {/* Botón agregar gasto */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setEditandoGasto(null);
            setNuevoGasto({ nombre: "", monto: "" });
            setModalGastoVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Agregar Gasto</Text>
        </TouchableOpacity>

        {/* Lista de gastos */}
        <View style={styles.cardContainer}>
          {gastos.map((gasto) => (
            <View key={gasto.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View>
                  <Text style={styles.cardTitle}>{gasto.nombre}</Text>
                  <Text style={styles.cardSub}>Gasto de: ${gasto.monto.toLocaleString()}</Text>
                  <Text style={styles.cardSub}>{((gasto.monto / presupuesto) * 100).toFixed(1)}% del presupuesto</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => abrirModalEditar(gasto)}>
                  <Image source={require("../assets/edit.png")} style={styles.navIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => eliminarGasto(gasto.id)}>
                  <Image source={require("../assets/elim.png")} style={styles.navIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch"
  },

  scrollContent: {
    width: width * 0.95,
    alignSelf: "center",
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    padding: 15,
    width: width * 0.95,
    alignSelf: "center",
    marginTop: 50,
  },

  leftIcons: { flexDirection: "row", alignItems: "center" },
  iconHeader: { width: 33, height: 22, resizeMode: "contain" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },

  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 50,
    padding: 8,
  },

  avatarIcon: { 
    width: 20, 
    height: 20, 
    tintColor: "#fff" 
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
    
  },

  subtitle: { 
    fontSize: 14, 
    color: "#555",
     
  },

  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 15,
    borderRadius: 30,
    marginTop: 25,
    width: "100%",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    paddingVertical: 25,
  },

  cardLeft: { flexDirection: "row", alignItems: "center", gap: 10 },

  cardTitle: { fontSize: 16, fontWeight: "600", color: "#000" },

  cardSub: { fontSize: 13, color: "#777" },

  cardAmount2: { fontSize: 16, fontWeight: "700", color: "#000" },

  progressBar:{
    height: 25,
    width: "100%",
    backgroundColor: "#d3d3d3",
    borderRadius: 15,
    marginVertical: 10,
  },

  balanceCard: {
    backgroundColor: "#c8b6ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    width: "40%",
  },

  amount: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#7b6cff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    
  },

  navIcon: { width: 26, height: 26, resizeMode: "contain" },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "85%",
  },

  modalTitle: {
    fontSize: 20,
    color: "#7b6cff",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },

  button: {
    padding: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#ff6b6b",
  },

  saveButton: {
    backgroundColor: "#7b6cff",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

});