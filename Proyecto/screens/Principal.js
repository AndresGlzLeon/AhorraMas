import React, { useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity,
  Modal, TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format, parse } from "date-fns";

// 🎯 AGREGADO: import del contexto
import { useIngresos } from "../screens/IngresosContext";

export default function Principal() {
  const navigation = useNavigation();

  // 🎯 AGREGADO: acceso a la BD temporal
  const { addIngreso } = useIngresos();

  // 1. NUEVO ESTADO: Saldo disponible 
  const [currentBalance, setCurrentBalance] = useState(1200.00);

  // ESTADOS CRUD
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Formulario
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [description, setDescription] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);

  // Filtros
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatMoney = (value) => {
    let num = Number(value);
    if (isNaN(num)) return "$0.00";

    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  };

  const parseMoney = (formattedValue) => {
    const cleanValue = formattedValue.toString().replace(/[$,]/g, "");
    return Number(cleanValue);
  };

  // ----------------------------------------------------
  //     🔥 GUARDAR INGRESO (AQUÍ VA LO IMPORTANTE)
  // ----------------------------------------------------
  const saveTransaction = () => {
    if (!amount || !category || !dateInput || !description)
      return alert("Llena todos los campos");

    let parsedDate;
    try {
      parsedDate = parse(dateInput, "yyyy-MM-dd", new Date());
    } catch (e) {
      return alert("Formato de fecha incorrecto. Usa yyyy-mm-dd");
    }

    const numericAmount = parseMoney(amount);

    if (numericAmount <= 0)
      return alert("Solo se permiten ingresos (monto positivo)");

    const newTrans = {
      id: Date.now(),
      amount: formatMoney(numericAmount),
      numericAmount,
      category,
      date: format(parsedDate, "dd/MM/yyyy"),
      description,
      type: "ingreso"
    };

    let newTransactions;
    let newBalance = currentBalance;

    if (editingIndex !== null) {
      const oldTrans = transactions[editingIndex];
      const oldAmount = oldTrans.numericAmount;

      newBalance = newBalance - oldAmount + numericAmount;

      newTransactions = [...transactions];
      newTransactions[editingIndex] = newTrans;

      setEditingIndex(null);
    } else {
      // 🎯 SE AGREGA AL ESTADO LOCAL
      newTransactions = [...transactions, newTrans];
      newBalance += numericAmount;

      // 🎯 SE AGREGA AL CONTEXTO (IngresosEgresos)
      addIngreso(newTrans);
    }

    setTransactions(newTransactions);
    setCurrentBalance(newBalance);

    // LIMPIAR
    setAmount("");
    setCategory("");
    setDateInput("");
    setDescription("");
    setModalVisible(false);
  };

  // ----------------------------------------------------
  //               EDITAR INGRESO  
  // ----------------------------------------------------
  const editTransaction = (index) => {
    const t = transactions[index];

    setAmount(t.numericAmount.toString());
    setCategory(t.category);
    setDescription(t.description);

    let parsed = parse(t.date, "dd/MM/yyyy", new Date());
    setDateInput(format(parsed, "yyyy-MM-dd"));

    setEditingIndex(index);
    setModalVisible(true);
  };

  // ----------------------------------------------------
  //               ELIMINAR INGRESO  
  // ----------------------------------------------------
  const deleteTransaction = (index) => {
    const transToDelete = transactions[index];
    const amountToRestore = transToDelete.numericAmount;

    setCurrentBalance(currentBalance - amountToRestore);

    const filtered = transactions.filter((_, i) => i !== index);
    setTransactions(filtered);
  };

  // ----------------------------------------------------
  //                  FILTROS  
  // ----------------------------------------------------
  const filteredTransactions = transactions.filter((t) => {
    const matchCategory = filterCategory
      ? t.category.toLowerCase().includes(filterCategory.toLowerCase())
      : true;

    const matchDescription = filterDescription
      ? t.description.toLowerCase().includes(filterDescription.toLowerCase())
      : true;

    const matchExactDate = filterDate ? t.date === filterDate : true;

    let matchRange = true;

    const trDate = parse(t.date, "dd/MM/yyyy", new Date());

    if (startDate) {
      const sd = parse(startDate, "yyyy-MM-dd", new Date());
      if (trDate < sd) matchRange = false;
    }

    if (endDate) {
      const ed = parse(endDate, "yyyy-MM-dd", new Date());
      if (trDate > ed) matchRange = false;
    }

    return matchCategory && matchDescription && matchExactDate && matchRange;
  });

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Notificaciones")}>
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Perfil")}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* TITULO */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Bienvenido,{"\n"}Consulta tus gastos</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* DINERO DISPONIBLE */}
        <Text style={styles.text}>Tu dinero disponible es:</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.amount}>{formatMoney(currentBalance)}</Text>
        </View>

        {/* BOTÓN AGREGAR */}
        <TouchableOpacity style={styles.addButtonTop} onPress={() => {
          setAmount("");
          setCategory("");
          setDateInput("");
          setDescription("");
          setEditingIndex(null);
          setModalVisible(true);
        }}>
          <Text style={styles.addButtonTextTop}>+ Agregar ingreso</Text>
        </TouchableOpacity>

        {/* FILTROS */}
        <Text style={styles.sectionTitle}>Filtros</Text>

        <TextInput
          placeholder="Filtrar por categoría"
          style={styles.input}
          value={filterCategory}
          onChangeText={setFilterCategory}
        />
        <TextInput
          placeholder="Filtrar por fecha exacta (dd/mm/aaaa)"
          style={styles.input}
          value={filterDate}
          onChangeText={setFilterDate}
        />

        <Text style={styles.sectionTitle}>Últimas transacciones</Text>

        {/* LISTA DE TRANSACCIONES */}
        {filteredTransactions.map((t, i) => (
          <View key={i} style={styles.transaction}>
            <Image
              source={require("../assets/despensa.png")}
              style={{ width: 25, height: 25 }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.itemTitle}>{t.category}</Text>
              <Text style={styles.date}>{t.date}</Text>
              <Text style={{ color: "#666" }}>{t.description}</Text>
            </View>

            <Text style={{
              color: "#2a9d8f",
              fontWeight: "700",
              fontSize: 16
            }}>
              {t.amount}
            </Text>

            <TouchableOpacity onPress={() => editTransaction(i)}>
              <Image source={require("../assets/editar.png")} style={{ width: 22, height: 22, marginLeft: 10 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTransaction(i)}>
              <Image source={require("../assets/delete.png")} style={{ width: 22, height: 22, marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>

      {/* ---------------- MODAL CRUD ---------------- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              {editingIndex !== null ? "Editar ingreso" : "Nuevo ingreso"}
            </Text>

            <TextInput
              placeholder="Monto en pesos (ej: 1500)"
              style={styles.modalInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <TextInput
              placeholder="Categoría (ej: Transporte)"
              style={styles.modalInput}
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              placeholder="Fecha (yyyy-mm-dd)"
              style={styles.modalInput}
              value={dateInput}
              onChangeText={setDateInput}
            />

            <TextInput
              placeholder="Descripción"
              style={styles.modalInput}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
              <Text style={styles.saveText}>
                {editingIndex !== null ? "Actualizar" : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModal} onPress={() => {
              setEditingIndex(null);
              setModalVisible(false);
            }}>
              <Text style={{ color: "#fff" }}>Cerrar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}


// ---------------- ESTILOS (NO CAMBIADOS) ----------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", padding: 15,
    backgroundColor: "#f4f1ff", borderRadius: 40,
    width: "95%", alignSelf: "center", marginTop: 50,
  },
  leftIcons: { flexDirection: "row" },
  iconHeader: { width: 23, height: 22 },
  title: { fontSize: 18, fontWeight: "600" },
  avatar: { backgroundColor: "#b3a5ff", padding: 8, borderRadius: 50 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff" },
  scrollContent: { padding: 20 },

  headerSection: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  welcome: { fontSize: 26, fontWeight: "700", color: "#7b6cff" },
  pigImage: { width: 80, height: 80 },
  text: { fontSize: 18, marginBottom: 10 },

  balanceCard: {
    backgroundColor: "#c8b6ff", paddingVertical: 25,
    borderRadius: 20, alignItems: "center",
  },
  amount: { fontSize: 40, fontWeight: "bold", color: "#fff" },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 30 },
  addButtonTop: {
    backgroundColor: "#7b6cff", padding: 12,
    borderRadius: 15, marginTop: 15, alignItems: "center"
  },
  addButtonTextTop: { color: "#fff", fontWeight: "700" },

  input: {
    backgroundColor: "#f4f1ff", padding: 10,
    borderRadius: 10, marginBottom: 10
  },

  transaction: {
    backgroundColor: "#f3efff", padding: 15,
    borderRadius: 15, flexDirection: "row",
    alignItems: "center", marginBottom: 15,
  },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  date: { fontSize: 12, color: "#777" },

  modalContainer: {
    flex: 1, justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)", padding: 20
  },
  modalContent: {
    backgroundColor: "#fff", padding: 20,
    borderRadius: 20
  },
  modalTitle: {
    textAlign: "center", fontSize: 20,
    fontWeight: "700", color: "#7b6cff", marginBottom: 10
  },
  modalInput: {
    backgroundColor: "#f4f1ff", padding: 10,
    borderRadius: 15, marginBottom: 10
  },
  saveButton: {
    backgroundColor: "#7b6cff", padding: 12,
    borderRadius: 10, alignItems: "center"
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  closeModal: {
    backgroundColor: "red", padding: 10,
    borderRadius: 10, alignItems: "center",
    marginTop: 10
  }
});
