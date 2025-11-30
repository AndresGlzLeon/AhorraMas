import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Platform
} from "react-native";
import UsuarioController from "../controllers/UsuarioController";

export default function CrearCuenta({ navigation, onLogin }) {
  // Datos del Usuario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [telefono, setTelefono] = useState("");
  
  // DATOS PARA RECUPERACIÓN (RÚBRICA)
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  // Instancia del Controlador
  const [controller] = useState(new UsuarioController());

  useEffect(() => {
    controller.init();
  }, []);

  const handleRegister = async () => {
    // 1. Validar campos vacíos
    if (
      nombre.trim() === '' || 
      correo.trim() === '' || 
      contrasenia.trim() === '' || 
      telefono.trim() === '' ||
      pregunta.trim() === '' ||
      respuesta.trim() === ''
    ) {
      Alert.alert("Error", "Por favor completa todos los campos, son obligatorios para tu seguridad.");
      return;
    }
    
    // 2. Llamar al controlador
    try {
      const resultado = await controller.registrar(
        nombre, 
        correo, 
        contrasenia, 
        telefono,
        pregunta,   // Nuevo campo
        respuesta   // Nuevo campo
      );

      if (resultado.exito) {
        Alert.alert("¡Cuenta Creada!", `Bienvenido ${nombre}, ya puedes gestionar tus gastos.`);
        
        // Limpiar formulario
        setNombre(""); setCorreo(""); setContrasenia(""); setTelefono("");
        setPregunta(""); setRespuesta("");

        // Notificar login exitoso
        if (onLogin) onLogin(resultado.usuario);
      } else {
        Alert.alert("Error", resultado.mensaje);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema técnico");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.header}>Únete a Ahorra+ App</Text>
          <Text style={styles.subheader}>CREA TU CUENTA</Text>
          
          <Image source={require("../assets/logo.png")} style={styles.image} />
          
          <Text style={styles.sectionLabel}>Datos Personales</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre Completo"
            style={styles.input}
            placeholderTextColor="#999"
          />
          
          <TextInput
            value={correo}
            onChangeText={setCorreo}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#999"
          />
          
          <TextInput
            value={contrasenia}
            onChangeText={setContrasenia}
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />
          
          <TextInput
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.sectionLabel}>Seguridad (Para recuperar cuenta)</Text>
          <TextInput
            value={pregunta}
            onChangeText={setPregunta}
            placeholder="Pregunta Secreta (Ej: Nombre de mi mascota)"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            value={respuesta}
            onChangeText={setRespuesta}
            placeholder="Respuesta Secreta"
            style={styles.input}
            placeholderTextColor="#999"
          />
          
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </Pressable>
          
          <Pressable style={styles.footer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? Inicia sesión</Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContent: { 
    padding: 24,
    justifyContent: "center" 
  },
  header: { 
    fontSize: 24,
    fontWeight: "700", 
    textAlign: "center", 
    color: "#7b6cff", 
    marginBottom: 4, 
    marginTop: 40 
  },
  subheader: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#555", 
    marginBottom: 20 
  },
  image: { 
    width: 80, 
    height: 80, 
    alignSelf: "center", 
    marginBottom: 20, 
    resizeMode: "contain" 
  },
  sectionLabel: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#7b6cff', 
    marginBottom: 10, 
    marginTop: 5 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#e6e0ff", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12, 
    backgroundColor: "#faf8ff" 
  },
  button: { 
    backgroundColor: "#7f6aff", 
    padding: 14, 
    borderRadius: 10, 
    alignItems: "center", 
    marginBottom: 12, 
    marginTop: 10 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16 
  },
  footer: { 
    marginTop: 10, 
    alignItems: 'center', 
    paddingBottom: 20 
  },
  footerText: { 
    color: "#777" 
  },
});