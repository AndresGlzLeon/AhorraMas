import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Image, Modal, TouchableOpacity, Pressable } from "react-native";

export default function Login({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = () => {
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setName("");
    setEmail("");
    setPassword("");

    navigation.replace("HomeTabs");
  };

  const handleSendReset = () => {
    if (resetEmail.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }
    setModalVisible(false);
    Alert.alert("Enviado", `Se ha enviado un enlace de recuperación a ${resetEmail}`);
    setResetEmail("");
  };

  const handleCancelReset = () => {
    setModalVisible(false);
    setResetEmail("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenid@ a</Text>
      <Text style={styles.header}>Ahorra+ App</Text>
      <Text style={styles.subheader}>INICIA SESIÓN ...</Text>

      <Image source={require("../assets/logo.png")} style={styles.image} />

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="NOMBRE"
        style={styles.input}
        placeholderTextColor="#999"
      />
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

      <Text style={styles.footer}>¿No tienes una cuenta aún? Crea una cuenta</Text>
      <Text style={styles.footer}>Volver</Text>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelReset}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar contraseña</Text>
            <Text style={{ color: "#555", marginBottom: 8 }}>
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
                style={[styles.modalButton, { backgroundColor: "#7f6aff" }]}
                onPress={handleSendReset}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Enviar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#ddd" }]}
                onPress={handleCancelReset}
              >
                <Text style={{ color: "#333", fontWeight: "600" }}>Cancelar</Text>
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
    color: "#000000ff",
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
