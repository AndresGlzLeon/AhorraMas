import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Animated, TextInput, FlatList } from "react-native";
import Principal from "./Principal";
import Login from "./Login";
import CrearCuenta from "./CrearCuenta";
import PagosProgramados from "./PagosProgramados";
import Notificaciones from "./Notificaciones";
import Ajustes from "./Ajustes";

export default function Ahorros() {

  const [currentScreen, setCurrentScreen] = useState("ahorros");

  // STATES CRUD
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const navigateTo = (screen) => setCurrentScreen(screen);

  // CRUD FUNCTIONS
  const handleSave = () => {
    if (!goal || !amount) return;

    const newGoal = { goal, amount };

    if (editingIndex !== null) {
      const updated = [...goals];
      updated[editingIndex] = newGoal;
      setGoals(updated);
      setEditingIndex(null);
    } else {
      setGoals([...goals, newGoal]);
    }
    setGoal("");
    setAmount("");
  };

  const handleEdit = (i) => {
    setGoal(goals[i].goal);
    setAmount(goals[i].amount);
    setEditingIndex(i);
  };

  const handleDelete = (i) => {
    setGoals(goals.filter((_, index) => index !== i));
  };

  
  const renderCRUD = () => (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateTo("ahorros")}>
          <Image source={require("../assets/Pink.png")} style={styles.iconHeader} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Metas</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.subtitle}>CRUD de Ahorros</Text>

      <TextInput style={styles.input} placeholder="Nombre de la meta " value={goal} onChangeText={setGoal} />
      <TextInput style={styles.input} placeholder="Cantidad " value={amount} onChangeText={setAmount} keyboardType="numeric" />

      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addText}>{editingIndex !== null ? "Actualizar meta" : "Agregar meta"}</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.goal}</Text>
            <Text style={styles.cardAmount}>${item.amount}</Text>

            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <Image source={require("../assets/editar.png")} style={styles.actionIcon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Image source={require("../assets/delete.png")} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );


  const renderAhorros = () => (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigateTo("ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("notificaciones")}>
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <View style={styles.avatar}>
          <TouchableOpacity onPress={() => navigateTo("login")}>
            <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Ahorros</Text>
            <Text style={styles.subtitle}>Tu progreso hacia tus{"\n"} metas financieras</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/*  BOTÓN PARA IR AL CRUD */}
        <TouchableOpacity style={[styles.addButton, { marginBottom: 20 }]} onPress={() => navigateTo("crud")}>
          <Text style={styles.addText}>Gestionar Metas (CRUD)</Text>
        </TouchableOpacity>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Fondo de Ahorros</Text>

          <View style={styles.progressBar}>
            <Animated.View style={[StyleSheet.absoluteFill, { width: '19%', backgroundColor: '#7b6cff', borderRadius: 15 }]} />
          </View>

          <View style={styles.cardLeft}>
            <Text style={styles.cardSub}>Meta de: 296,495</Text>
            <Text style={styles.cardAmount2}>Ahorrado: 57,500</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );


  switch (currentScreen) {
    case "principal": return <Principal navigate={navigateTo} />;
    case "login": return <Login navigate={navigateTo} />;
    case "crear": return <CrearCuenta navigate={navigateTo} />;
    case "pagosProgramados": return <PagosProgramados navigate={navigateTo} />;
    case "notificaciones": return <Notificaciones navigate={navigateTo} />;
    case "ajustes": return <Ajustes navigate={navigateTo} />;
    case "crud": return renderCRUD();
    default: return renderAhorros();
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:15, backgroundColor:"#7b6cff", borderRadius:40, width:"95%", marginTop:50 },
  leftIcons:{ flexDirection:"row", alignItems:"center" },
  iconHeader:{ width:33, height:22, resizeMode:"contain" },
  title:{ fontSize:18, fontWeight:"600", color:"#333" },
  avatar:{ backgroundColor:"#b3a5ff", borderRadius:50, padding:8 },
  avatarIcon:{ width:20, height:20, tintColor:"#000000ff" },
  scrollContent:{ padding:20, paddingBottom:120 },
  headerSection:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:20 },
  welcome:{ fontSize:26, paddingRight:100, fontWeight:"700", color:"#7b6cff", lineHeight:30 },
  subtitle:{ fontSize:16, marginTop:50, color:"#000" },
  pigImage:{ width:80, height:80 },
  cardContainer:{ backgroundColor:"#f4f1ff", padding:10, borderRadius:30, marginBottom:30, width:"100%" },
  progressBar:{ height:25, width:"100%", backgroundColor:"#ddd", borderRadius:15, marginVertical:10 },
  cardLeft:{ flexDirection:"row", justifyContent:"space-between", width:"100%" },
  cardSub:{ fontSize:14, color:"#777" },
  cardAmount2:{ fontSize:14, fontWeight:"700", color:"#000" },
  addButton:{ backgroundColor:"#7b6cff", padding:15, borderRadius:20, width:"100%", alignItems:"center" },
  addText:{ color:"#fff", fontWeight:"bold" },

  // CRUD
  input:{ backgroundColor:"#f4f1ff", padding:15, borderRadius:15, width:"100%", marginBottom:10 },
  card:{ backgroundColor:"#f4f1ff", padding:15, borderRadius:20, flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:10, width:"100%" },
  cardTitle:{ fontWeight:"bold", fontSize:16, color:"#000" },
  cardAmount:{ fontSize:14, fontWeight:"600" },
  actionIcon:{ width:25, height:25, tintColor:"#7b6cff" }
});
