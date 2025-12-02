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
    
    const observerCallback = (action, userData) => {
      console.log('Evento recibido:', action);
      
      if (action === 'USUARIO_ACTUALIZADO') {
        
        setData({
          nombre: userData.nombre || "",
          correo: userData.correo || "",
          telefono: userData.telefono || ""
        });
        
        
        setEditando({ nombre: false, correo: false, telefono: false });
      }
    };

    controller.subscribe(observerCallback);

    
    if (usuario) {
      setData({
        nombre: usuario.nombre || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || ""
      });
    }

    
    return () => {
      controller.unsubscribe(observerCallback);
    };
  }, [usuario]);

  

 
  

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
                  
                  editable={editando[campo]}
                />
                
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