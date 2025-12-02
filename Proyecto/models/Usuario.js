export default class Usuario {
  constructor(id = null, nombre = '', correo = '', contrasena = '', telefono = '') {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.contrasena = contrasena;
    this.telefono = telefono;
  }

  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length < 3) {
      errores.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!this.correo || !this.validarEmail(this.correo)) {
      errores.push('El correo electrónico no es válido');
    }

    if (!this.contrasena || this.contrasena.length < 6) {
      errores.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (!this.telefono || this.telefono.length < 10) {
      errores.push('El teléfono debe tener al menos 10 dígitos');
    }

    return {
      valido: errores.length === 0,
      errores: errores
    };
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      telefono: this.telefono
    };
  }
}