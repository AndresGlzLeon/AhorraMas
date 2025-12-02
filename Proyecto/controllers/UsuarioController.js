import Usuario from '../models/Usuario';
import DatabaseService from '../database/DatabaseService';

export default class UsuarioController {
  constructor() {
    this.dbService = new DatabaseService();
    this.observers = []; 
    this.usuarioActual = null;
  }

  
  subscribe(observer) {
    this.observers.push(observer);
    console.log(' Observer suscrito');
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    console.log('Observer desuscrito');
  }

  notifyObservers(action, data) {
    this.observers.forEach(observer => {
      if (typeof observer === 'function') {
        observer(action, data);
      }
    });
  }

 
  async init() {
    try {
      await this.dbService.init();
      console.log(' UsuarioController inicializado');
    } catch (error) {
      console.error(' Error al inicializar controlador:', error);
      throw error;
    }
  }

  
  async registrar(nombre, correo, contrasena, telefono, pregunta, respuesta) {
    try {
    
      if (!pregunta || !respuesta) {
        return { exito: false, mensaje: 'Debes definir una pregunta de seguridad' };
      }

      const usuarioTemp = new Usuario(null, nombre, correo, contrasena, telefono);
      
      
      const validacion = usuarioTemp.validar();
      if (!validacion.valido) {
        return { exito: false, mensaje: validacion.errores.join(', ') };
      }

      
      const datosUsuario = {
        ...usuarioTemp.toJSON(),
        pregunta,
        respuesta: respuesta.toLowerCase().trim()
      };

      
      const existente = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );
      if (existente && existente.length > 0) {
        return { exito: false, mensaje: 'El correo ya está registrado' };
      }

      
      const resultado = await this.dbService.insert('usuarios', datosUsuario);
      
      this.usuarioActual = { ...datosUsuario, id: resultado.id };
      this.notifyObservers('USUARIO_REGISTRADO', this.usuarioActual);
      
      return { exito: true, mensaje: 'Registro exitoso', usuario: this.usuarioActual };

    } catch (error) {
      console.error('Error en registro:', error);
      return { exito: false, mensaje: 'Error en registro' };
    }
  }

 
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
      console.error(' Error al verificar:', error);
      return { exito: false, mensaje: 'Error al verificar' };
    }
  }

 
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
      console.error(' Error al obtener pregunta:', error);
      return { exito: false, mensaje: 'Error al obtener pregunta' };
    }
  }

  
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
      console.error(' Error en login:', error);
      return { exito: false, mensaje: 'Error al iniciar sesión' };
    }
  }

  logout() {
    this.usuarioActual = null;
    this.notifyObservers('USUARIO_LOGOUT', null);
  }

  
  getUsuarioActual() {
    return this.usuarioActual;
  }
}