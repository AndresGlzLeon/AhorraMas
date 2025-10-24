import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

export default function Login({ navigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (name.trim()=== '' || email.trim()=== '' || password.trim() === '') {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    Alert.alert("Éxito", `Bienvenido ${name}`);
    setName("");
    setEmail("");
    setPassword("");
    if (navigate) navigate("principal");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenid@ a Ahorra+ App</Text>
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

      <TouchableOpacity onPress={() => Alert.alert("Recuperar contraseña", "Función no disponible aún")}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate && navigate("crear")}>
        <Text style={styles.footer}>¿No tienes una cuenta aún? Crea una cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate && navigate("principal")}>
        <Text style={styles.footer}>Volver</Text>
      </TouchableOpacity>
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
});