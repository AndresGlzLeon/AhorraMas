import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,KeyboardAvoidingView,Alert,Image,Pressable} from "react-native";

export default function CrearCuenta({navigation, onLogin}) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleRegister = () => {
    if (nombre.trim() === '' || correo.trim() === '' || contrasenia.trim() === '' || telefono.trim() === '') {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    
    // Aquí puedes agregar tu lógica de registro
    // Por ejemplo, guardar en un backend
    
    Alert.alert("Cuenta creada", `Bienvenido ${nombre}`);
    setNombre("");
    setCorreo("");
    setContrasenia("");
    setTelefono("");
    
    // Llamar a la función onLogin para cambiar el estado de autenticación
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.header}>Bienvenid@ a Ahorra+ App</Text>
        <Text style={styles.subheader}>CREA TU CUENTA</Text>
        
        <Image source={require("../assets/logo.png")} style={styles.image} />
        
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="NOMBRE"
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        <TextInput
          value={correo}
          onChangeText={setCorreo}
          placeholder="CORREO"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        <TextInput
          value={contrasenia}
          onChangeText={setContrasenia}
          placeholder="CONTRASEÑA"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          placeholder="TELÉFONO"
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
        
        <Pressable style={styles.footer} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footer}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </Pressable>
      </KeyboardAvoidingView>
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