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

// 1. Actualizar REGISTRO para recibir pregunta y respuesta
  async registrar(nombre, correo, contrasena, telefono, pregunta, respuesta) {
    try {
      // ... (validaciones anteriores) ...

      // Validación extra
      if (!pregunta || !respuesta) {
        return { exito: false, mensaje: 'Debes definir una pregunta de seguridad' };
      }

      const usuarioTemp = new Usuario(null, nombre, correo, contrasena, telefono);
      // Añadimos manualmente los campos extra al objeto JSON antes de insertar
      const datosUsuario = {
        ...usuarioTemp.toJSON(),
        pregunta,
        respuesta: respuesta.toLowerCase().trim() // Guardar en minúsculas para comparar fácil
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
      console.error(error);
      return { exito: false, mensaje: 'Error en registro' };
    }
  }

  // 2. Nueva función: VALIDAR RESPUESTA DE SEGURIDAD
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
          contrasena: usuario.contrasena // ALERTA: Retornamos la password (solo porque es MVP sin encriptar)
        };
      } else {
        return { exito: false, mensaje: 'Respuesta incorrecta' };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error al verificar' };
    }
  }

  // 3. Helper para obtener solo la pregunta (para mostrarla en la UI antes de pedir respuesta)
  async obtenerPregunta(correo) {
    const usuarios = await this.dbService.query('SELECT pregunta FROM usuarios WHERE correo = ?', [correo]);
    if (usuarios && usuarios.length > 0) {
      return { exito: true, pregunta: usuarios[0].pregunta };
    }
    return { exito: false, mensaje: 'Usuario no encontrado' };
  }

  // ========== LOGIN ==========
  async login(correo, contrasena) {
    try {
      // 1. Buscar usuario directamente por correo y contraseña
      // Nota: Gracias al arreglo en DatabaseService, esto funcionará bien en Web y Móvil
      const usuarios = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
        [correo, contrasena]
      );

      if (!usuarios || usuarios.length === 0) {
        return { exito: false, mensaje: 'Correo o contraseña incorrectos' };
      }

      // 2. Establecer sesión
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

  // ========== RECUPERAR CONTRASEÑA ==========
  async recuperarContrasena(correo) {
    try {
      const usuarios = await this.dbService.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );

      if (!usuarios || usuarios.length === 0) {
        return { exito: false, mensaje: 'Correo no encontrado' };
      }

      // Simulación de envío
      this.notifyObservers('RECUPERACION_ENVIADA', { correo });
      
      return {
        exito: true,
        mensaje: `Se ha enviado un enlace de recuperación a ${correo}`
      };
    } catch (error) {
      console.error('❌ Error en recuperación:', error);
      return { exito: false, mensaje: 'Error al recuperar contraseña' };
    }
  }

  // ========== ACTUALIZAR PERFIL ==========
  async actualizarPerfil(id, datos) {
    try {
      // Usar la contraseña nueva si viene, sino mantener la vieja
      const nuevaContrasena = (datos.contrasena && datos.contrasena.trim().length > 0)
        ? datos.contrasena 
        : this.usuarioActual.contrasena;

      const usuario = new Usuario(
        id,
        datos.nombre,
        datos.correo,
        nuevaContrasena,
        datos.telefono
      );

      const validacion = usuario.validar();
      if (!validacion.valido) {
        return { exito: false, mensaje: validacion.errores.join(', ') };
      }

      await this.dbService.update('usuarios', id, usuario.toJSON());
      
      this.usuarioActual = { ...usuario };
      this.notifyObservers('USUARIO_ACTUALIZADO', this.usuarioActual);
      
      return { exito: true, mensaje: 'Perfil actualizado exitosamente' };
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      return { exito: false, mensaje: 'Error al actualizar perfil' };
    }
  }

  // ========== LOGOUT ==========
  logout() {
    this.usuarioActual = null;
    this.notifyObservers('USUARIO_LOGOUT', null);
  }

  getUsuarioActual() {
    return this.usuarioActual;
  }
}