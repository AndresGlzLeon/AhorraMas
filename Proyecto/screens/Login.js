import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, Alert, Image, Modal,TouchableOpacity, Pressable, ActivityIndicator} from "react-native";
import UsuarioController from "../controllers/UsuarioController";

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState(1); 
  const [preguntaSeguridad, setPreguntaSeguridad] = useState("");
  const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
  const [loading, setLoading] = useState(false);

  const [controller] = useState(new UsuarioController());

  useEffect(() => {
    controller.init();
  }, []);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    const resultado = await controller.login(email, password);
    if (resultado.exito) {
      console.log('Usuario logueado:', resultado.usuario); 

      if (onLogin) onLogin(resultado.usuario);
    }
    
    if (resultado.exito) {
      if (onLogin) onLogin(resultado.usuario);
    } else {
      Alert.alert("Acceso denegado", resultado.mensaje);
    }
  };


  const buscarUsuario = async () => {
    if (!resetEmail) return Alert.alert("Error", "Ingresa tu correo");
    
    setLoading(true);
    const resultado = await controller.obtenerPregunta(resetEmail);
    setLoading(false);

    if (resultado.exito) {
      setPreguntaSeguridad(resultado.pregunta); 
      setResetStep(2);
    } else {
      Alert.alert("Error", "Este correo no está registrado en la app.");
    }
  };

  const verificarRespuesta = async () => {
    if (!respuestaSeguridad) return Alert.alert("Error", "Ingresa una respuesta");

    setLoading(true);
    const resultado = await controller.validarPreguntaSeguridad(resetEmail, respuestaSeguridad);
    setLoading(false);

    if (resultado.exito) {
      Alert.alert(
        "¡Identidad Verificada!", 
        `Tu contraseña es: \n\n${resultado.contrasena}\n\nAnótala en un lugar seguro.`,
        [{ text: "Entendido", onPress: cerrarModal }]
      );
    } else {
      Alert.alert("Incorrecto", "La respuesta no coincide con nuestros registros.");
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setResetEmail("");
    setRespuestaSeguridad("");
    setResetStep(1);
  };

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
      
      <Pressable style={styles.footerBtn} onPress={() => navigation.navigate('CrearCuenta')}>
        <Text style={styles.footerText}>¿No tienes una cuenta aún?, Crear Cuenta</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalTitle}>Recuperar Contraseña</Text>

            {resetStep === 1 && (
              <>
                <Text style={styles.modalText}>Ingresa tu correo para buscar tu pregunta de seguridad:</Text>
                <TextInput
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  placeholder="ejemplo@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.modalInput}
                />
                <Pressable style={styles.modalButtonPrimary} onPress={buscarUsuario}>
                  {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Continuar</Text>}
                </Pressable>
              </>
            )}

            {resetStep === 2 && (
              <>
                <Text style={styles.modalLabel}>Pregunta de Seguridad:</Text>
                <Text style={styles.securityQuestionText}>{preguntaSeguridad}</Text>
                
                <TextInput
                  value={respuestaSeguridad}
                  onChangeText={setRespuestaSeguridad}
                  placeholder="Tu respuesta secreta"
                  style={styles.modalInput}
                />
                <Pressable style={styles.modalButtonPrimary} onPress={verificarRespuesta}>
                  {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Verificar y Recuperar</Text>}
                </Pressable>
              </>
            )}

            <Pressable style={styles.modalButtonSecondary} onPress={cerrarModal}>
              <Text style={{color: "#555"}}>Cancelar</Text>
            </Pressable>
          
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
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#7b6cff",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    letterSpacing: 1.5,
  },
  image: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 30,
    resizeMode: "contain",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6e0ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#faf8ff",
    fontSize: 16,
  },
  link: {
    color: "#7b6cff",
    textAlign: "right",
    marginBottom: 25,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#7f6aff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#7f6aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  footerBtn: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    color: "#777",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", 
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    color: "#555",
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  modalLabel: {
    color: "#7b6cff",
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 5,
  },
  securityQuestionText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#f4f1ff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e0ff',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  
  modalButtonPrimary: {
    backgroundColor: "#7b6cff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  modalButtonSecondary: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});