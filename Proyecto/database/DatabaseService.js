// database/DatabaseService.js
// Servicio para manejar la base de datos SQLite y Web

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export default class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.isWeb = Platform.OS === 'web';
    this.schemaCache = {};
    this.webSchema = {
      usuarios: ['id', 'nombre', 'correo', 'contrasena', 'telefono', 'created_at'],
      transacciones: ['id', 'usuarioId', 'tipo', 'monto', 'categoria', 'descripcion', 'fecha'],
      presupuestos: ['id', 'usuarioId', 'categoria', 'monto', 'mes', 'anio', 'created_at'],
    };
  }

  // Inicializar la base de datos
  async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      if (this.isWeb) {
        console.log('✅ BD Web (localStorage) inicializada');
        this.isInitialized = true;
        return;
      }

      this.db = await SQLite.openDatabaseAsync('lanaapp.db');
      await this.crearTablas();
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
    const payload = await this.filterData(table, data, ['id']);

    if (!Object.keys(payload).length) {
      throw new Error(`No hay columnas válidas para insertar en ${table}`);
    }

    if (this.isWeb) {
      return this.insertWeb(table, payload);
    }

    try {
      const keys = Object.keys(payload);
      const values = keys.map((k) => payload[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
      const result = await this.db.runAsync(sql, values);

      console.log(`✅ Insertado en ${table} con ID: ${result.lastInsertRowId}`);
      return { id: result.lastInsertRowId, ...payload };
    } catch (error) {
      console.error(`❌ Error al insertar en ${table}:`, error);
      throw error;
    }
  }

  // Actualizar (UPDATE)
  async update(table, id, data) {
    const payload = await this.filterData(table, data, ['id']);

    if (!Object.keys(payload).length) {
      throw new Error(`No hay columnas válidas para actualizar en ${table}`);
    }

    if (this.isWeb) {
      return this.updateWeb(table, id, payload);
    }

    try {
      const keys = Object.keys(payload);
      const values = keys.map((k) => payload[k]);
      const setClause = keys.map((key) => `${key} = ?`).join(', ');

      const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
      await this.db.runAsync(sql, [...values, id]);

      console.log(`✅ Actualizado en ${table} ID: ${id}`);
      return { id, ...payload };
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

  queryWeb(sql, params = []) {
    const table = this.extractTableName(sql);
    if (!table) return [];

    const data = this.getLocalStorage();
    let rows = data[table] ? [...data[table]] : [];
    const fields = this.extractWhereFields(sql);

    if (fields.length && params.length) {
      rows = rows.filter((row) =>
        fields.every((field, index) => {
          if (!(field in row)) return false;
          const value = row[field];
          const param = params[index];
          return String(value) === String(param);
        })
      );
    }

    return rows;
  }

  insertWeb(table, data) {
    const allData = this.getLocalStorage();
    const rows = allData[table] ? [...allData[table]] : [];

    const nextId = rows.length
      ? Math.max(...rows.map((item) => Number(item.id) || 0)) + 1
      : 1;

    const newItem = {
      id: nextId,
      ...data,
      created_at: data.created_at ?? new Date().toISOString(),
    };

    rows.push(newItem);
    allData[table] = rows;
    this.setLocalStorage(allData);
    console.log(`✅ [Web] Insertado en ${table}`);
    return newItem;
  }

  updateWeb(table, id, data) {
    const allData = this.getLocalStorage();
    const rows = allData[table];
    if (!rows) return null;

    const index = rows.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    rows[index] = { ...rows[index], ...data };
    allData[table] = rows;
    this.setLocalStorage(allData);
    console.log(`✅ [Web] Actualizado en ${table} ID: ${id}`);
    return rows[index];
  }

  deleteWeb(table, id) {
    const allData = this.getLocalStorage();
    const rows = allData[table];
    if (!rows) return null;

    allData[table] = rows.filter((item) => String(item.id) !== String(id));
    this.setLocalStorage(allData);
    console.log(`✅ [Web] Eliminado de ${table} ID: ${id}`);
    return { id };
  }

  // ========== HELPERS INTERNOS ==========

  async filterData(table, data = {}, exclude = []) {
    const columns = await this.getTableColumns(table);
    return Object.keys(data).reduce((acc, key) => {
      if (exclude.includes(key)) return acc;
      if (!columns.includes(key)) return acc;
      const value = data[key];
      if (value === undefined || value === null) return acc;
      acc[key] = value;
      return acc;
    }, {});
  }

  async getTableColumns(table) {
    if (this.isWeb) {
      return this.webSchema[table] ? [...this.webSchema[table]] : [];
    }

    if (!this.schemaCache[table]) {
      const info = await this.db.getAllAsync(`PRAGMA table_info(${table});`);
      this.schemaCache[table] = info.map((row) => row.name);
    }

    return this.schemaCache[table];
  }

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
    const match = sql.match(/FROM\s+([\w]+)/i);
    return match ? match[1] : '';
  }

  extractWhereFields(sql) {
    const whereMatch = sql.match(/WHERE\s+(.+?)(ORDER BY|GROUP BY|LIMIT|$)/i);
    if (!whereMatch) return [];

    return whereMatch[1]
      .split(/AND/i)
      .map((fragment) => fragment.trim())
      .map((fragment) => {
        const match = fragment.match(/([\w.]+)\s*=\s*\?/);
        return match ? match[1].split('.').pop() : null;
      })
      .filter(Boolean);
  }
}