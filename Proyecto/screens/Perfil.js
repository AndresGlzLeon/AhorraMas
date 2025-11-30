import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil({ databaseService }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  const [editNombre, setEditNombre] = useState(false);
  const [editCorreo, setEditCorreo] = useState(false);
  const [editTelefono, setEditTelefono] = useState(false);

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const usuarioAutenticado = await AsyncStorage.getItem("usuarioAutenticado");
        if (usuarioAutenticado) {
          const usuario = JSON.parse(usuarioAutenticado);
          setNombre(usuario.nombre);
          setCorreo(usuario.correo);
          setTelefono(usuario.telefono);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario autenticado:", error);
      }
    };

    cargarDatosUsuario();
  }, []);

  const toggleEdit = (field) => {
    if (field === "nombre") {
      setEditNombre((prev) => !prev);
    } else if (field === "correo") {
      setEditCorreo((prev) => !prev);
    } else if (field === "telefono") {
      setEditTelefono((prev) => !prev);
    }
  };

  const guardarCambios = async () => {
    try {
      // Validar si el correo ya existe en la base de datos
      const usuariosExistentes = await databaseService.query(
        "SELECT * FROM usuarios WHERE correo = ? AND id != ?",
        [correo, 1] // Cambiar por el ID del usuario autenticado
      );

      if (usuariosExistentes.length > 0) {
        Alert.alert("Error", "El correo ya está registrado. Por favor, usa otro correo.");
        return;
      }

      await databaseService.update("usuarios", 1, { // Cambiar por el ID del usuario autenticado
        nombre,
        correo,
        telefono,
      });

      Alert.alert("Cambios guardados", "Tu información ha sido actualizada.");
      setEditNombre(false);
      setEditCorreo(false);
      setEditTelefono(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.perfilTitle}>TU PERFIL</Text>

        <View style={styles.avatarSection}>
          <Image 
            source={require("../assets/usuarios.png")}
            style={styles.bigAvatar}
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>NOMBRE</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, !editNombre && { color: "#444" }]}
              value={nombre}
              onChangeText={setNombre}
              editable={editNombre}
            />

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => toggleEdit("nombre")}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>CORREO</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, !editCorreo && { color: "#444" }]}
              value={correo}
              onChangeText={setCorreo}
              editable={editCorreo}
            />

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => toggleEdit("correo")}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>TELÉFONO</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, !editTelefono && { color: "#444" }]}
              value={telefono}
              onChangeText={setTelefono}
              editable={editTelefono}
              keyboardType="phone-pad"
            />

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => toggleEdit("telefono")}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Text style={styles.saveText}>Guardar Cambios</Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff",
    alignItems:"center",
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
    paddingBottom: 140,
    width: "100%",
    alignItems: "center",
  },

  perfilTitle: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 50,
    marginBottom: 15,
    color: "#a270ff",
    fontWeight: "700",
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  bigAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  inputCard: {
    backgroundColor: "#f7f2ff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 18,
  },

  label: {
    color: "#9a6aff",
    fontWeight: "700",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    fontSize: 17,
    fontWeight: "600",
    width: "70%",
    paddingVertical: 5,
  },

  editButton: {
    backgroundColor: "#e0d1ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },

  editText: {
    color: "#704eff",
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#a58bff",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
    resizeMode: "contain",
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
    tintColor: "#fff",
    resizeMode: "contain",
  },
});