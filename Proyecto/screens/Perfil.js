import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UsuarioController from "../controllers/UsuarioController";

export default function Perfil({ usuario }) {
  const navigation = useNavigation();
  const [controller] = useState(new UsuarioController());
  
  const [data, setData] = useState({ 
    nombre: "", 
    correo: "", 
    telefono: "" 
  });
  
  const [editando, setEditando] = useState({ 
    nombre: false, 
    correo: false, 
    telefono: false 
  });

  useEffect(() => {
    controller.init();
    if (usuario) {
      setData({
        nombre: usuario.nombre || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || ""
      });
    }
  }, [usuario]);

  const toggleEdit = (campo) => {
    setEditando({ ...editando, [campo]: !editando[campo] });
  };

  const handleChange = (campo, valor) => {
    setData({ ...data, [campo]: valor });
  };

  const guardar = async () => {
    if (!usuario?.id) {
      Alert.alert("Error", "No se pudo identificar el usuario");
      return;
    }

    const resultado = await controller.actualizarPerfil(usuario.id, {
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      contrasena: "" // Mantener contraseña actual
    });

    if (resultado.exito) {
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setEditando({ nombre: false, correo: false, telefono: false });
    } else {
      Alert.alert("Error", resultado.mensaje);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image source={require("../assets/usuarios.png")} style={styles.avatarImage} />
            
          </View>
          <Text style={styles.userName}>{data.nombre || "Usuario"}</Text>
          <Text style={styles.userEmail}>{data.correo || "correo@ejemplo.com"}</Text>
        </View>

        <View style={styles.formContainer}>
          {["nombre", "correo", "telefono"].map((campo) => (
            <View key={campo} style={styles.inputGroup}>
              <Text style={styles.label}>{campo.toUpperCase()}</Text>
              <View style={[styles.inputWrapper, editando[campo] && styles.inputActive]}>
                <TextInput
                  style={styles.input}
                  value={data[campo]}
                  onChangeText={(t) => handleChange(campo, t)}
                  editable={editando[campo]}
                />
                <TouchableOpacity onPress={() => toggleEdit(campo)}>
                  <Text style={styles.editLink}>{editando[campo] ? "OK" : "Editar"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={guardar}>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#b3a5ff",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7b6cff",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b3a5ff",
    marginBottom: 8,
    paddingLeft: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputActive: {
    borderColor: "#7b6cff",
    backgroundColor: "#f4f1ff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  editLink: {
    color: "#7b6cff",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#7b6cff",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#7b6cff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});