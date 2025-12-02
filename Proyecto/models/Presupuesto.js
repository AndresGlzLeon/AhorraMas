
export default class Presupuesto {
  constructor(
    id = null,
    usuarioId = null,
    categoria = '',
    monto = 0,
    mes = new Date().getMonth() + 1,
    anio = new Date().getFullYear()
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.categoria = categoria;
    this.monto = parseFloat(monto) || 0;
    this.mes = mes;
    this.anio = anio;
  }

  // Validaciones del presupuesto
  validar() {
    const errores = [];

    if (this.monto <= 0) {
      errores.push('El monto del presupuesto debe ser mayor a 0');
    }

    if (!this.categoria || this.categoria.trim().length === 0) {
      errores.push('La categoría es obligatoria');
    }

    if (this.mes < 1 || this.mes > 12) {
      errores.push('El mes debe estar entre 1 y 12');
    }

    if (this.anio < 2020) {
      errores.push('El año no es válido');
    }

    return {
      valido: errores.length === 0,
      errores: errores
    };
  }

  // Convertir a objeto para BD
  toJSON() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      categoria: this.categoria,
      monto: this.monto,
      mes: this.mes,
      anio: this.anio
    };
  }
}