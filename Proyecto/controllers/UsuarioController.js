import Usuario from '../models/Usuario';
import DatabaseService from '../database/DatabaseService';

export default class UsuarioController {
  constructor() {
    this.dbService = new DatabaseService();
    this.observers = []; 
    this.usuarioActual = null;
  }

  // ========== SISTEMA DE OBSERVADORES ==========
  subscribe(observer) {
    this.observers.push(observer);
    console.log('✅ Observer suscrito');
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    console.log('✅ Observer desuscrito');
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

  // ========== REGISTRO ==========
  async registrar(nombre, correo, contrasena, telefono, pregunta, respuesta) {
    try {
      // Validación extra
      if (!pregunta || !respuesta) {
        return { exito: false, mensaje: 'Debes definir una pregunta de seguridad' };
      }

      const usuarioTemp = new Usuario(null, nombre, correo, contrasena, telefono);
      
      // Validar usando el modelo
      const validacion = usuarioTemp.validar();
      if (!validacion.valido) {
        return { exito: false, mensaje: validacion.errores.join(', ') };
      }

      // Añadimos los campos extra al objeto JSON
      const datosUsuario = {
        ...usuarioTemp.toJSON(),
        pregunta,
        respuesta: respuesta.toLowerCase().trim()
      };

      // Verificar duplicados
      const existente = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );
      if (existente && existente.length > 0) {
        return { exito: false, mensaje: 'El correo ya está registrado' };
      }

      // Insertar
      const resultado = await this.dbService.insert('usuarios', datosUsuario);
      
      this.usuarioActual = { ...datosUsuario, id: resultado.id };
      this.notifyObservers('USUARIO_REGISTRADO', this.usuarioActual);
      
      return { exito: true, mensaje: 'Registro exitoso', usuario: this.usuarioActual };

    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { exito: false, mensaje: 'Error en registro' };
    }
  }

  // ========== VALIDAR RESPUESTA DE SEGURIDAD ==========
  async validarPreguntaSeguridad(correo, respuestaUsuario) {
    try {
      const usuarios = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );

      if (!usuarios || usuarios.length === 0) {
        return { exito: false, mensaje: 'Correo no encontrado' };
      }

      const usuario = usuarios[0];
      
      // Verificar respuesta (ignorando mayúsculas)
      if (usuario.respuesta === respuestaUsuario.toLowerCase().trim()) {
        return { 
          exito: true, 
          mensaje: 'Identidad verificada', 
          contrasena: usuario.contrasena
        };
      } else {
        return { exito: false, mensaje: 'Respuesta incorrecta' };
      }
    } catch (error) {
      console.error('❌ Error al verificar:', error);
      return { exito: false, mensaje: 'Error al verificar' };
    }
  }

  // ========== OBTENER PREGUNTA DE SEGURIDAD ==========
  async obtenerPregunta(correo) {
    try {
      const usuarios = await this.dbService.query(
        'SELECT pregunta FROM usuarios WHERE correo = ?', 
        [correo]
      );
      
      if (usuarios && usuarios.length > 0) {
        return { exito: true, pregunta: usuarios[0].pregunta };
      }
      return { exito: false, mensaje: 'Usuario no encontrado' };
    } catch (error) {
      console.error('❌ Error al obtener pregunta:', error);
      return { exito: false, mensaje: 'Error al obtener pregunta' };
    }
  }

  // ========== LOGIN ==========
  async login(correo, contrasena) {
    try {
      const usuarios = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
        [correo, contrasena]
      );

      if (!usuarios || usuarios.length === 0) {
        return { exito: false, mensaje: 'Correo o contraseña incorrectos' };
      }

      this.usuarioActual = usuarios[0];
      this.notifyObservers('USUARIO_LOGIN', this.usuarioActual);
      
      return {
        exito: true,
        mensaje: 'Login exitoso',
        usuario: this.usuarioActual
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { exito: false, mensaje: 'Error al iniciar sesión' };
    }
  }

  // ========== ACTUALIZAR PERFIL ==========
  async actualizarPerfil(id, datos) {
    try {
      // Validar que el ID sea válido
      if (!id || id <= 0) {
        return { exito: false, mensaje: 'ID de usuario inválido' };
      }

      // Validar que exista usuarioActual
      if (!this.usuarioActual) {
        return { exito: false, mensaje: 'No hay sesión activa' };
      }

      // Validar que los datos no sean nulos
      if (!datos) {
        return { exito: false, mensaje: 'Datos de actualización inválidos' };
      }

      // Usar la contraseña nueva si viene, sino mantener la vieja
      const nuevaContrasena = (datos.contrasena && datos.contrasena.trim().length > 0)
        ? datos.contrasena 
        : this.usuarioActual.contrasena;

      // Validar que la contraseña actual exista
      if (!nuevaContrasena) {
        return { exito: false, mensaje: 'Error al recuperar contraseña actual' };
      }

      // Crear instancia del modelo Usuario
      const usuario = new Usuario(
        id,
        datos.nombre,
        datos.correo,
        nuevaContrasena,
        datos.telefono
      );

      // ✅ USAR VALIDACIÓN DEL MODELO
      const validacion = usuario.validar();
      if (!validacion.valido) {
        return { exito: false, mensaje: validacion.errores.join(', ') };
      }

      // Verificar que el correo no esté siendo usado por otro usuario
      const usuariosConCorreo = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ? AND id != ?',
        [datos.correo, id]
      );

      if (usuariosConCorreo && usuariosConCorreo.length > 0) {
        return { exito: false, mensaje: 'El correo ya está siendo usado por otra cuenta' };
      }

      // Actualizar en base de datos
      const resultado = await this.dbService.update('usuarios', id, usuario.toJSON());
      
      if (!resultado) {
        return { exito: false, mensaje: 'No se pudo actualizar en la base de datos' };
      }

      // Actualizar usuario actual en memoria
      this.usuarioActual = { 
        ...usuario.toJSON(), 
        id,
        pregunta: this.usuarioActual.pregunta, // Mantener pregunta de seguridad
        respuesta: this.usuarioActual.respuesta // Mantener respuesta de seguridad
      };
      
      // Notificar a observadores
      this.notifyObservers('USUARIO_ACTUALIZADO', this.usuarioActual);
      
      return { exito: true, mensaje: 'Perfil actualizado exitosamente', usuario: this.usuarioActual };
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      
      // Mensajes de error más específicos
      if (error.message) {
        return { exito: false, mensaje: `Error: ${error.message}` };
      }
      
      return { exito: false, mensaje: 'Error inesperado al actualizar perfil' };
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