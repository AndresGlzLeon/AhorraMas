// screens/Login.js - ACTUALIZADO CON MVC

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  Pressable
} from "react-native";
import UsuarioController from "../controllers/UsuarioController";

export default function Login({ navigation, onLogin }) {
  // ========== ESTADO LOCAL ==========
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // ========== CONTROLADOR ==========
  // Crear una ÚNICA instancia del controlador
  const [controller] = useState(new UsuarioController());

  // ========== INICIALIZACIÓN ==========
  useEffect(() => {
    // Inicializar el controlador cuando se monta el componente
    const inicializar = async () => {
      try {
        await controller.init();
        console.log(' Controlador inicializado en Login');
      } catch (error) {
        console.error(' Error al inicializar:', error);
        Alert.alert('Error', 'No se pudo inicializar la aplicación');
      }
    };

    inicializar();
  }, []);

  // ========== MANEJO DE LOGIN ==========
  const handleLogin = async () => {
    // Validación básica en la vista
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    // Llamar al CONTROLADOR para manejar la lógica
    const resultado = await controller.login(email, password);
    
    if (resultado.exito) {
      Alert.alert("Éxito", `Bienvenido ${resultado.usuario.nombre}`);
      
      // Limpiar campos
      setEmail("");
      setPassword("");
      
      // Notificar a App.js que el login fue exitoso
      if (onLogin) {
        onLogin(resultado.usuario);
      }
    } else {
      Alert.alert("Error", resultado.mensaje);
    }
  };

  // ========== RECUPERAR CONTRASEÑA ==========
  const handleSendReset = async () => {
    if (resetEmail.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    // Llamar al controlador
    const resultado = await controller.recuperarContrasena(resetEmail);
    
    setModalVisible(false);
    
    if (resultado.exito) {
      Alert.alert("Enviado", resultado.mensaje);
      setResetEmail("");
    } else {
      Alert.alert("Error", resultado.mensaje);
    }
  };

  const handleCancelReset = () => {
    setModalVisible(false);
    setResetEmail("");
  };

  // ========== RENDER ==========
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenid@ a</Text>
      <Text style={styles.header}>Ahorra+ App</Text>
      <Text style={styles.subheader}>INICIA SESIÓN ...</Text>
      
      <Image source={require("../assets/logo.png")} style={styles.image} />
      
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="CORREO"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="#999"
      />
      
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="CONTRASEÑA"
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </Pressable>
      
      <Pressable 
        style={styles.footer} 
        onPress={() => navigation.navigate('CrearCuenta')}
      >
        <Text style={styles.footer}>
          ¿No tienes una cuenta aún?, Crear Cuenta
        </Text>
      </Pressable>

      {/* Modal de Recuperación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelReset}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar contraseña</Text>
            <Text style={{color: "#555", marginBottom: 8}}>
              Ingresa tu correo para recibir el enlace
            </Text>
            
            <TextInput
              value={resetEmail}
              onChangeText={setResetEmail}
              placeholder="Correo"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.modalInput}
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, {backgroundColor: "#7f6aff"}]} 
                onPress={handleSendReset}
              >
                <Text style={{color: "#fff", fontWeight: "600"}}>Enviar</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, {backgroundColor: "#ddd"}]} 
                onPress={handleCancelReset}
              >
                <Text style={{color: "#333", fontWeight: "600"}}>Cancelar</Text>
              </Pressable>
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
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#7b6cff",
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6e0ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#faf8ff",
  },
  link: {
    color: "#7b6cff",
    textAlign: "right",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#7f6aff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e6e0ff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#faf8ff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
});