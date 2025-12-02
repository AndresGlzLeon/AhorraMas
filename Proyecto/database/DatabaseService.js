import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export default class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.isWeb = Platform.OS === 'web';
    this.schemaCache = {};
    this.webSchema = {
      usuarios: ['id', 'nombre', 'correo', 'contrasena', 'telefono', 'pregunta', 'respuesta', 'created_at'],
      transacciones: ['id', 'usuarioId', 'tipo', 'monto', 'categoria', 'descripcion', 'fecha'],
      presupuestos: ['id', 'usuarioId', 'categoria', 'monto', 'mes', 'anio', 'created_at'],
      presupuesto_total: ['id', 'usuarioId', 'monto', 'mes', 'anio', 'created_at'],
      pagos_programados: ['id', 'usuarioId', 'titulo', 'monto', 'fecha', 'tipo']
    };
  }

  async init() {
    if (this.isInitialized) return;

    try {
      if (this.isWeb) {
        console.log('✅ BD Web (localStorage) inicializada');
        this.isInitialized = true;
        return;
      }

      // ✅ COMPATIBLE CON VERSIÓN ANTIGUA Y NUEVA
      if (SQLite.openDatabaseAsync) {
        // Nueva API (Expo SDK 51+)
        this.db = await SQLite.openDatabaseAsync('lanaapp.db');
      } else {
        // API antigua (Expo SDK 50 y anteriores)
        this.db = SQLite.openDatabase('lanaapp.db');
      }
      
      await this.crearTablas();
      this.isInitialized = true;
      console.log('✅ BD SQLite inicializada');
    } catch (error) {
      console.error('❌ Error al inicializar BD:', error);
      throw error;
    }
  }

  async crearTablas() {
    if (this.isWeb) return;

    try {
      const queries = [
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          contrasena TEXT NOT NULL,
          telefono TEXT,
          pregunta TEXT,
          respuesta TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER NOT NULL,
          tipo TEXT NOT NULL CHECK(tipo IN ('ingreso', 'egreso')),
          monto REAL NOT NULL,
          categoria TEXT NOT NULL,
          descripcion TEXT,
          fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );`,
        `CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER NOT NULL,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          mes INTEGER NOT NULL,
          anio INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );`,
        `CREATE TABLE IF NOT EXISTS presupuesto_total (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER NOT NULL,
          monto REAL NOT NULL,
          mes INTEGER NOT NULL,
          anio INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );`,
        `CREATE TABLE IF NOT EXISTS pagos_programados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER NOT NULL,
          titulo TEXT,
          monto REAL,
          fecha TEXT,
          tipo TEXT,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );`
      ];

      // ✅ EJECUTAR QUERIES SEGÚN LA API DISPONIBLE
      if (this.db.execAsync) {
        // Nueva API
        for (const query of queries) {
          await this.db.execAsync(query);
        }
      } else {
        // API antigua
        for (const query of queries) {
          await this.executeSqlAsync(query);
        }
      }

      console.log('✅ Tablas creadas correctamente');
    } catch (error) {
      console.error('❌ Error al crear tablas:', error);
      throw error;
    }
  }

  // ✅ WRAPPER PARA API ANTIGUA
  executeSqlAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  }

  async query(sql, params = []) {
    if (this.isWeb) {
      return this.queryWeb(sql, params);
    }

    try {
      // ✅ COMPATIBLE CON AMBAS APIS
      if (this.db.getAllAsync) {
        // Nueva API
        const result = await this.db.getAllAsync(sql, params);
        return result;
      } else {
        // API antigua
        const result = await this.executeSqlAsync(sql, params);
        return result.rows._array || [];
      }
    } catch (error) {
      console.error('❌ Error en query:', error);
      throw error;
    }
  }

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
      
      // ✅ COMPATIBLE CON AMBAS APIS
      if (this.db.runAsync) {
        // Nueva API
        const result = await this.db.runAsync(sql, values);
        return { id: result.lastInsertRowId, ...payload };
      } else {
        // API antigua
        const result = await this.executeSqlAsync(sql, values);
        return { id: result.insertId, ...payload };
      }
    } catch (error) {
      console.error(`❌ Error al insertar en ${table}:`, error);
      throw error;
    }
  }

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
      
      // ✅ COMPATIBLE CON AMBAS APIS
      if (this.db.runAsync) {
        await this.db.runAsync(sql, [...values, id]);
      } else {
        await this.executeSqlAsync(sql, [...values, id]);
      }

      return { id, ...payload };
    } catch (error) {
      console.error(`❌ Error al actualizar ${table}:`, error);
      throw error;
    }
  }

  async delete(table, id) {
    if (this.isWeb) {
      return this.deleteWeb(table, id);
    }

    try {
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      
      // ✅ COMPATIBLE CON AMBAS APIS
      if (this.db.runAsync) {
        await this.db.runAsync(sql, [id]);
      } else {
        await this.executeSqlAsync(sql, [id]);
      }
      
      return { id };
    } catch (error) {
      console.error(`❌ Error al eliminar de ${table}:`, error);
      throw error;
    }
  }

  // MÉTODOS WEB (sin cambios)
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
    return rows[index];
  }

  deleteWeb(table, id) {
    const allData = this.getLocalStorage();
    const rows = allData[table];
    if (!rows) return null;

    allData[table] = rows.filter((item) => String(item.id) !== String(id));
    this.setLocalStorage(allData);
    return { id };
  }

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
      // ✅ COMPATIBLE CON AMBAS APIS
      if (this.db.getAllAsync) {
        const info = await this.db.getAllAsync(`PRAGMA table_info(${table});`);
        this.schemaCache[table] = info.map((row) => row.name);
      } else {
        const result = await this.executeSqlAsync(`PRAGMA table_info(${table});`);
        const info = result.rows._array || [];
        this.schemaCache[table] = info.map((row) => row.name);
      }
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