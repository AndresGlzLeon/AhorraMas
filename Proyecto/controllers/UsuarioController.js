// controllers/UsuarioController.js
// Controlador que maneja la lógica de negocio de Usuarios

import Usuario from '../models/Usuario';
import DatabaseService from '../database/DatabaseService';

export default class UsuarioController {
  constructor() {
    this.dbService = new DatabaseService();
    this.observers = []; // Lista de observadores (vistas que escuchan cambios)
    this.usuarioActual = null;
  }

  // ========== SISTEMA DE OBSERVADORES ==========
  // Permite que las vistas se actualicen automáticamente

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(action, data) {
    this.observers.forEach(observer => {
      if (typeof observer === 'function') {
        observer(action, data);
      }
    });
  }

  // ========== INICIALIZACIÓN ==========

  async init() {
    try {
      await this.dbService.init();
      console.log('✅ UsuarioController inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar controlador:', error);
      throw error;
    }
  }

  // ========== REGISTRO DE USUARIO ==========

  async registrar(nombre, correo, contrasena, telefono) {
    try {
      // 1. Crear instancia del modelo
      const usuario = new Usuario(null, nombre, correo, contrasena, telefono);
      
      // 2. Validar con el modelo
      const validacion = usuario.validar();
      if (!validacion.valido) {
        return {
          exito: false,
          mensaje: validacion.errores.join(', ')
        };
      }

      // 3. Verificar si el correo ya existe
      const existente = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );

      if (existente && existente.length > 0) {
        return {
          exito: false,
          mensaje: 'El correo ya está registrado'
        };
      }

      // 4. Insertar en BD usando el servicio
      const resultado = await this.dbService.insert('usuarios', usuario.toJSON());
      
      // 5. Guardar usuario actual
      this.usuarioActual = { ...usuario, id: resultado.id };
      
      // 6. Notificar a los observadores
      this.notifyObservers('USUARIO_REGISTRADO', this.usuarioActual);
      
      return {
        exito: true,
        mensaje: 'Usuario registrado exitosamente',
        usuario: this.usuarioActual
      };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return {
        exito: false,
        mensaje: error.message || 'Error al registrar usuario'
      };
    }
  }

  // ========== LOGIN ==========

  async login(correo, contrasena) {
    try {
      // 1. Buscar usuario en BD
      const usuarios = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
        [correo, contrasena]
      );

      if (!usuarios || usuarios.length === 0) {
        return {
          exito: false,
          mensaje: 'Correo o contraseña incorrectos'
        };
      }

      // 2. Guardar usuario actual
      this.usuarioActual = usuarios[0];
      
      // 3. Notificar a observadores
      this.notifyObservers('USUARIO_LOGIN', this.usuarioActual);
      
      return {
        exito: true,
        mensaje: 'Login exitoso',
        usuario: this.usuarioActual
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        exito: false,
        mensaje: 'Error al iniciar sesión'
      };
    }
  }

  // ========== RECUPERAR CONTRASEÑA ==========

  async recuperarContrasena(correo) {
    try {
      // 1. Verificar que el correo exista
      const usuarios = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );

      if (!usuarios || usuarios.length === 0) {
        return {
          exito: false,
          mensaje: 'Correo no encontrado'
        };
      }

      // 2. Notificar (aquí normalmente enviarías un email)
      this.notifyObservers('RECUPERACION_ENVIADA', { correo });
      
      return {
        exito: true,
        mensaje: `Se ha enviado un enlace de recuperación a ${correo}`
      };
    } catch (error) {
      console.error('❌ Error en recuperación:', error);
      return {
        exito: false,
        mensaje: 'Error al recuperar contraseña'
      };
    }
  }

  // ========== ACTUALIZAR PERFIL ==========

  async actualizarPerfil(id, datos) {
    try {
      // 1. Crear modelo con nuevos datos
      const usuario = new Usuario(
        id,
        datos.nombre,
        datos.correo,
        datos.contrasena || this.usuarioActual?.contrasena || '',
        datos.telefono
      );

      // 2. Validar
      const validacion = usuario.validar();
      if (!validacion.valido) {
        return {
          exito: false,
          mensaje: validacion.errores.join(', ')
        };
      }

      // 3. Actualizar en BD
      await this.dbService.update('usuarios', id, usuario.toJSON());
      
      // 4. Actualizar usuario actual
      this.usuarioActual = { ...usuario };
      
      // 5. Notificar
      this.notifyObservers('USUARIO_ACTUALIZADO', this.usuarioActual);
      
      return {
        exito: true,
        mensaje: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      return {
        exito: false,
        mensaje: 'Error al actualizar perfil'
      };
    }
  }

  // ========== LOGOUT ==========

  logout() {
    this.usuarioActual = null;
    this.notifyObservers('USUARIO_LOGOUT', null);
  }

  // ========== OBTENER USUARIO ACTUAL ==========

  getUsuarioActual() {
    return this.usuarioActual;
  }
}