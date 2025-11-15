import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  Animated, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert 
} from "react-native";

export default function Ahorros() {
  // Estados para las metas de ahorro
  const [metas, setMetas] = useState([
    { 
      id: 1, 
      nombre: "Viaje a los cabos", 
      metaTotal: 10896, 
      ahorrado: 7500,
      categoria: "viaje",
      fechaLimite: "2024-12-31"
    },
    { 
      id: 2, 
      nombre: "Auto Nuevo", 
      metaTotal: 285599, 
      ahorrado: 50000,
      categoria: "auto",
      fechaLimite: "2025-06-30"
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState({ 
    nombre: "", 
    metaTotal: "", 
    ahorrado: "0", 
    categoria: "otros",
    fechaLimite: "" 
  });
  const [editandoMeta, setEditandoMeta] = useState(null);

  // Cálculos para el fondo de ahorros general
  const totalMetaGeneral = 296495;
  const totalAhorradoGeneral = metas.reduce((total, meta) => total + meta.ahorrado, 0);
  const porcentajeAhorradoGeneral = (totalAhorradoGeneral / totalMetaGeneral) * 100;

  // Funciones CRUD
  const agregarMeta = () => {
    if (!nuevaMeta.nombre || !nuevaMeta.metaTotal) {
      Alert.alert("Error", "Por favor completa el nombre y el monto de la meta");
      return;
    }

    const meta = {
      id: Date.now(),
      nombre: nuevaMeta.nombre,
      metaTotal: Number(nuevaMeta.metaTotal),
      ahorrado: Number(nuevaMeta.ahorrado) || 0,
      categoria: nuevaMeta.categoria,
      fechaLimite: nuevaMeta.fechaLimite || "Sin fecha límite"
    };

    setMetas([...metas, meta]);
    setNuevaMeta({ 
      nombre: "", 
      metaTotal: "", 
      ahorrado: "0", 
      categoria: "otros",
      fechaLimite: "" 
    });
    setModalVisible(false);
  };

  const editarMeta = () => {
    if (!nuevaMeta.nombre || !nuevaMeta.metaTotal) {
      Alert.alert("Error", "Por favor completa el nombre y el monto de la meta");
      return;
    }

    setMetas(metas.map(meta => 
      meta.id === editandoMeta.id 
        ? { 
            ...meta, 
            nombre: nuevaMeta.nombre, 
            metaTotal: Number(nuevaMeta.metaTotal),
            ahorrado: Number(nuevaMeta.ahorrado),
            categoria: nuevaMeta.categoria,
            fechaLimite: nuevaMeta.fechaLimite
          }
        : meta
    ));
    
    setEditandoMeta(null);
    setNuevaMeta({ 
      nombre: "", 
      metaTotal: "", 
      ahorrado: "0", 
      categoria: "otros",
      fechaLimite: "" 
    });
    setModalVisible(false);
  };

  const eliminarMeta = (id) => {
    Alert.alert(
      "Eliminar meta",
      "¿Estás seguro de que quieres eliminar esta meta de ahorro?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => setMetas(metas.filter(meta => meta.id !== id))
        }
      ]
    );
  };

  const abrirModalEditar = (meta) => {
    setEditandoMeta(meta);
    setNuevaMeta({ 
      nombre: meta.nombre, 
      metaTotal: meta.metaTotal.toString(), 
      ahorrado: meta.ahorrado.toString(),
      categoria: meta.categoria,
      fechaLimite: meta.fechaLimite
    });
    setModalVisible(true);
  };

  const abrirModalAgregar = () => {
    setEditandoMeta(null);
    setNuevaMeta({ 
      nombre: "", 
      metaTotal: "", 
      ahorrado: "0", 
      categoria: "otros",
      fechaLimite: "" 
    });
    setModalVisible(true);
  };

  // Función para obtener el ícono según la categoría
  const obtenerIcono = (categoria) => {
    const iconos = {
      viaje: require("../assets/plane.png"),
      auto: require("../assets/auto.png"),
      
    };
    return iconos[categoria] || iconos.otros;
  };

  // Función para calcular el porcentaje de progreso
  const calcularProgreso = (ahorrado, metaTotal) => {
    return (ahorrado / metaTotal) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Modal para agregar/editar metas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editandoMeta ? "Editar Meta" : "Nueva Meta de Ahorro"}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre de la meta"
              value={nuevaMeta.nombre}
              onChangeText={(text) => setNuevaMeta({...nuevaMeta, nombre: text})}
            />
            
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto total de la meta"
              value={nuevaMeta.metaTotal}
              onChangeText={(text) => setNuevaMeta({...nuevaMeta, metaTotal: text})}
            />
            
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto ya ahorrado"
              value={nuevaMeta.ahorrado}
              onChangeText={(text) => setNuevaMeta({...nuevaMeta, ahorrado: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Fecha límite (opcional)"
              value={nuevaMeta.fechaLimite}
              onChangeText={(text) => setNuevaMeta({...nuevaMeta, fechaLimite: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={editandoMeta ? editarMeta : agregarMeta}
              >
                <Text style={styles.buttonText}>
                  {editandoMeta ? "Guardar" : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección de bienvenida */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Ahorros</Text>
            <Text style={styles.subtitle}>Tu progreso hacia tus{"\n"} metas financieras</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* Tarjeta de fondo de ahorros general */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Fondo de Ahorros</Text> 
        
          <View style={styles.progressBar}>  
            <Animated.View 
              style={[
                StyleSheet.absoluteFill, 
                {
                  width: `${porcentajeAhorradoGeneral}%`, 
                  backgroundColor: '#7b6cff', 
                  borderRadius: 15,
                }
              ]} 
            />
          </View>

          <View style={styles.cardLeft}>
            <Text style={styles.cardSub}>Meta de: ${totalMetaGeneral.toLocaleString()}</Text>
            <Text style={styles.cardAmount2}>Ahorrado: ${totalAhorradoGeneral.toLocaleString()}</Text>
          </View>
        </View>

        {/* Lista de metas */}
        <View style={styles.cardContainer}>
          {metas.map((meta) => {
            const progreso = calcularProgreso(meta.ahorrado, meta.metaTotal);
            
            return (
              <View key={meta.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <Image source={obtenerIcono(meta.categoria)} style={styles.cardIcon} />
                  <View style={styles.metaInfo}>
                    <Text style={styles.cardTitle}>{meta.nombre}</Text>
                    <Text style={styles.cardSub}>Meta: ${meta.metaTotal.toLocaleString()}</Text>
                    <Text style={styles.cardSub}>Ahorrado: ${meta.ahorrado.toLocaleString()}</Text>
                    <Text style={styles.progressText}>
                      Progreso: {progreso.toFixed(1)}% • Restante: ${(meta.metaTotal - meta.ahorrado).toLocaleString()}
                    </Text>
                    {meta.fechaLimite && (
                      <Text style={styles.dateText}>Fecha límite: {meta.fechaLimite}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => abrirModalEditar(meta)}
                  >
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => eliminarMeta(meta.id)}
                  >
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Botón para agregar nueva meta */}
        <TouchableOpacity style={styles.addButton} onPress={abrirModalAgregar}>
          <Image source={require("../assets/mas.png")} style={styles.addIcon} />
          <Text style={styles.addText}>Crear nueva meta de ahorro</Text>
        </TouchableOpacity>

        {/* Ejemplo de meta (puedes eliminar esta sección si quieres) */}
        {metas.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tienes metas de ahorro</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primera meta y comienza a ahorrar para tus sueños
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.iconCircle}>
          <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />
        </View>

        <View style={styles.iconCircle}>
          <Image source={require("../assets/Pink.png")} style={styles.navIcon} />
        </View>

        <View style={styles.centerButton}>
          <Image source={require("../assets/Programados.png")} style={styles.centerIcon} />
        </View>

        <View style={styles.iconCircle}>
          <Image source={require("../assets/inicio.png")} style={styles.navIcon} />
        </View>

        <View style={styles.iconCircle}>
          <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
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
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20, 
    tintColor: "#fff",
    resizeMode: "contain" 
  },
  scrollContent: { 
    padding: 20,
    paddingBottom: 120 
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 26,
    paddingRight: 100,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
  },
  subtitle: { 
    fontSize: 16,
    marginTop: 50, 
    color: "#000"  
  },
  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginBottom: 10,
  },
  cardLeft: { 
    flexDirection: "row", 
    alignItems: "flex-start",
    flex: 1 
  },
  cardIcon: { 
    width: 50, 
    height: 50, 
    marginRight: 15, 
    tintColor: "#7b6cff" 
  },
  metaInfo: {
    flex: 1,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#000",
    marginBottom: 4 
  },
  cardSub: { 
    fontSize: 13, 
    color: "#777",
    marginBottom: 2 
  },
  progressText: {
    fontSize: 12,
    color: "#7b6cff",
    fontWeight: "500",
    marginTop: 4
  },
  dateText: {
    fontSize: 11,
    color: "#999",
    marginTop: 2
  },
  cardActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: "#7b6cff",
    fontWeight: "600",
    fontSize: 12
  },
  deleteText: {
    color: "red",
    fontWeight: "600",
    fontSize: 12
  },
  progressBar: {
    height: 25,
    width: '100%',
    backgroundColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    overflow: 'hidden'
  },
  cardAmount2: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#000" 
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
    borderRadius: 25, 
    backgroundColor: "#A084E8", 
    justifyContent: "center",
    alignItems: "center",
  },
  navIcon: { 
    width: 26, 
    height: 26, 
    resizeMode: "contain" 
  },
  centerButton: {
    backgroundColor: "#7f6aff",
    padding: 15,
    borderRadius: 40,
    marginBottom: 25,
  },
  centerIcon: {
    width: 30, 
    height: 30, 
    resizeMode: "contain", 
    tintColor: "#fff" 
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f1ff",
    borderRadius: 25,
    padding: 15,
    justifyContent: "center",
    marginVertical: 10,
  },
  addIcon: { 
    width: 25, 
    height: 25, 
    marginRight: 10, 
    tintColor: "#7b6cff" 
  },
  addText: { 
    fontSize: 16, 
    color: "#000", 
    fontWeight: "500" 
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#7b6cff",
    textAlign: "center"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
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
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7b6cff",
    marginBottom: 10
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center"
  }
});