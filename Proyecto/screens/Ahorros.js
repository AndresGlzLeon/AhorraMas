import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Ahorros() {
  const navigation = useNavigation();
  const [metas, setMetas] = useState([
    { id: 1, nombre: "Viaje a los Cabos", metaTotal: 10896, ahorrado: 7500, categoria: "viaje" },
    { id: 2, nombre: "Auto Nuevo", metaTotal: 285599, ahorrado: 50000, categoria: "auto" }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState({ nombre: "", metaTotal: "", ahorrado: "0" });
  const [editandoMeta, setEditandoMeta] = useState(null);

  // Lógica CRUD simplificada para demo
  const guardarMeta = () => {
    if (!nuevaMeta.nombre || !nuevaMeta.metaTotal) return Alert.alert("Error", "Completa los campos");
    
    if (editandoMeta) {
      setMetas(metas.map(m => m.id === editandoMeta.id ? { ...m, ...nuevaMeta, metaTotal: Number(nuevaMeta.metaTotal), ahorrado: Number(nuevaMeta.ahorrado) } : m));
    } else {
      setMetas([...metas, { id: Date.now(), ...nuevaMeta, metaTotal: Number(nuevaMeta.metaTotal), ahorrado: Number(nuevaMeta.ahorrado) }]);
    }
    cerrarModal();
  };

  const eliminarMeta = (id) => {
    Alert.alert("Eliminar", "¿Borrar meta?", [{ text: "Cancelar" }, { text: "Eliminar", onPress: () => setMetas(metas.filter(m => m.id !== id)), style: "destructive" }]);
  };

  const abrirModal = (meta = null) => {
    setEditandoMeta(meta);
    setNuevaMeta(meta ? { ...meta, metaTotal: meta.metaTotal.toString(), ahorrado: meta.ahorrado.toString() } : { nombre: "", metaTotal: "", ahorrado: "0" });
    setModalVisible(true);
  };

  const cerrarModal = () => { setModalVisible(false); setEditandoMeta(null); };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
           <TouchableOpacity onPress={() => navigation.navigate("Ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Mis Metas</Text>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Perfil")}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>Ahorros</Text>
          <Text style={styles.subtitle}>Cumple tus sueños</Text>
        </View>

        {metas.map((meta) => {
          const progreso = Math.min((meta.ahorrado / meta.metaTotal) * 100, 100);
          return (
            <TouchableOpacity key={meta.id} style={styles.card} onLongPress={() => eliminarMeta(meta.id)} onPress={() => abrirModal(meta)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{meta.nombre}</Text>
                <Text style={styles.cardAmount}>${meta.ahorrado} / ${meta.metaTotal}</Text>
              </View>
              
              {/* BARRA DE PROGRESO */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progreso}%` }]} />
              </View>
              <Text style={styles.percentageText}>{progreso.toFixed(1)}% completado</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addButton} onPress={() => abrirModal()}>
          <Text style={styles.addButtonText}>+ Nueva Meta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editandoMeta ? "Editar Meta" : "Nueva Meta"}</Text>
            <TextInput style={styles.input} placeholder="Nombre (ej: Auto Nuevo)" value={nuevaMeta.nombre} onChangeText={t => setNuevaMeta({...nuevaMeta, nombre: t})} />
            <TextInput style={styles.input} placeholder="Meta Total ($)" keyboardType="numeric" value={nuevaMeta.metaTotal} onChangeText={t => setNuevaMeta({...nuevaMeta, metaTotal: t})} />
            <TextInput style={styles.input} placeholder="Ahorrado Actual ($)" keyboardType="numeric" value={nuevaMeta.ahorrado} onChangeText={t => setNuevaMeta({...nuevaMeta, ahorrado: t})} />
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.btnCancel} onPress={cerrarModal}><Text style={styles.btnCancelText}>Cancelar</Text></Pressable>
              <Pressable style={styles.btnSave} onPress={guardarMeta}><Text style={styles.btnSaveText}>Guardar</Text></Pressable>
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
    padding: 15,
    marginTop: 50,
    marginHorizontal: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 30,
  },
  iconHeader: {
    width: 24,
    height: 24,
    tintColor: "#7b6cff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  avatar: {
    backgroundColor: "#b3a5ff",
    padding: 8,
    borderRadius: 20,
  },
  avatarIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },

  // =========================
  // 📝 TÍTULOS Y SECCIONES
  // =========================
  introSection: {
    marginBottom: 25,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7b6cff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },

  // =========================
  // 💳 TARJETAS DE AHORRO
  // =========================
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    // Borde sutil
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  cardAmount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },

  // =========================
  // 📊 BARRA DE PROGRESO
  // =========================
  progressBarBg: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#55efc4",
    borderRadius: 5,
  },
  percentageText: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },

  // =========================
  // ➕ BOTÓN "NUEVA META"
  // =========================
  addButton: {
    backgroundColor: "#7b6cff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // =========================
  // 🛑 MODAL (POP-UP)
  // =========================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  
  // Botones del Modal
  btnCancel: {
    padding: 15,
    width: "45%",
    alignItems: "center",
  },
  btnCancelText: {
    color: "#888",
    fontWeight: "600",
  },
  btnSave: {
    backgroundColor: "#7b6cff",
    padding: 15,
    width: "45%",
    alignItems: "center",
    borderRadius: 12,
  },
  btnSaveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});