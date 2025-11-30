// database/DatabaseService.js
// Servicio para manejar la base de datos SQLite y Web

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export default class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  // Inicializar la base de datos
  async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      if (Platform.OS === 'web') {
        // Para web usamos localStorage
        this.isWeb = true;
        this.isInitialized = true;
        console.log('✅ BD Web (localStorage) inicializada');
        return;
      }

      // Para móvil usamos SQLite
      this.db = await SQLite.openDatabaseAsync('lanaapp.db');
      await this.crearTablas();
      await this.updateSchema(); // Llamar al método para actualizar el esquema de la base de datos
      this.isInitialized = true;
      console.log('✅ BD SQLite inicializada');
    } catch (error) {
      console.error('❌ Error al inicializar BD:', error);
      throw error;
    }
  }

  // Crear las tablas necesarias
  async crearTablas() {
    if (this.isWeb) return;

    try {
      // Tabla de usuarios
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          contrasena TEXT NOT NULL,
          telefono TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tabla de transacciones
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER NOT NULL,
          tipo TEXT NOT NULL CHECK(tipo IN ('ingreso', 'egreso')),
          monto REAL NOT NULL,
          categoria TEXT NOT NULL,
          descripcion TEXT,
          fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );
      `);

      // Tabla de presupuestos
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER NOT NULL,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          mes INTEGER NOT NULL,
          anio INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );
      `);

      console.log('✅ Tablas creadas correctamente');
    } catch (error) {
      console.error('❌ Error al crear tablas:', error);
      throw error;
    }
  }

  // Actualizar el esquema de la base de datos
  async updateSchema() {
    try {
      // Eliminé la lógica para agregar la columna 'foto' ya que no se usará
      console.log("Esquema de la base de datos actualizado.");
    } catch (error) {
      console.error("Error al actualizar el esquema de la base de datos:", error);
    }
  }

  // ========== MÉTODOS CRUD ==========

  // Consultar (SELECT)
  async query(sql, params = []) {
    if (this.isWeb) {
      return this.queryWeb(sql, params);
    }

    try {
      const result = await this.db.getAllAsync(sql, params);
      return result;
    } catch (error) {
      console.error('❌ Error en query:', error);
      throw error;
    }
  }

  // Insertar (INSERT)
  async insert(table, data) {
    if (this.isWeb) {
      return this.insertWeb(table, data);
    }

    try {
      const keys = Object.keys(data).filter(k => data[k] !== null && k !== 'id');
      const values = keys.map(k => data[k]);
      const placeholders = keys.map(() => '?').join(', ');
      
      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
      const result = await this.db.runAsync(sql, values);
      
      console.log(`✅ Insertado en ${table} con ID: ${result.lastInsertRowId}`);
      return { id: result.lastInsertRowId, ...data };
    } catch (error) {
      console.error(`❌ Error al insertar en ${table}:`, error);
      throw error;
    }
  }

  // Actualizar (UPDATE)
  async update(table, id, data) {
    if (this.isWeb) {
      return this.updateWeb(table, id, data);
    }

    try {
      const keys = Object.keys(data).filter(k => k !== 'id');
      const values = keys.map(k => data[k]);
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      
      const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
      await this.db.runAsync(sql, [...values, id]);
      
      console.log(`✅ Actualizado en ${table} ID: ${id}`);
      return { id, ...data };
    } catch (error) {
      console.error(`❌ Error al actualizar ${table}:`, error);
      throw error;
    }
  }

  // Eliminar (DELETE)
  async delete(table, id) {
    if (this.isWeb) {
      return this.deleteWeb(table, id);
    }

    try {
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      await this.db.runAsync(sql, [id]);
      console.log(`✅ Eliminado de ${table} ID: ${id}`);
      return { id };
    } catch (error) {
      console.error(`❌ Error al eliminar de ${table}:`, error);
      throw error;
    }
  }

  // ========== MÉTODOS PARA WEB (localStorage) ==========

  queryWeb(sql, params) {
    // Implementación básica para web
    const table = this.extractTableName(sql);
    const data = this.getLocalStorage();
    return data[table] || [];
  }

  insertWeb(table, data) {
    const allData = this.getLocalStorage();
    if (!allData[table]) allData[table] = [];
    
    const newItem = { 
      id: Date.now(), 
      ...data,
      created_at: new Date().toISOString()
    };
    allData[table].push(newItem);
    
    this.setLocalStorage(allData);
    console.log(`✅ [Web] Insertado en ${table}`);
    return newItem;
  }

  updateWeb(table, id, data) {
    const allData = this.getLocalStorage();
    if (!allData[table]) return null;
    
    const index = allData[table].findIndex(item => item.id === id);
    if (index !== -1) {
      allData[table][index] = { ...allData[table][index], ...data };
      this.setLocalStorage(allData);
      console.log(`✅ [Web] Actualizado en ${table} ID: ${id}`);
      return allData[table][index];
    }
    return null;
  }

  deleteWeb(table, id) {
    const allData = this.getLocalStorage();
    if (!allData[table]) return null;
    
    allData[table] = allData[table].filter(item => item.id !== id);
    this.setLocalStorage(allData);
    console.log(`✅ [Web] Eliminado de ${table} ID: ${id}`);
    return { id };
  }

  // Helpers para localStorage
  getLocalStorage() {
    try {
      const data = localStorage.getItem('lanaapp_data');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  setLocalStorage(data) {
    localStorage.setItem('lanaapp_data', JSON.stringify(data));
  }

  extractTableName(sql) {
    const match = sql.match(/FROM\s+(\w+)/i);
    return match ? match[1] : '';
  }
}