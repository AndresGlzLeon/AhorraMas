import Presupuesto from '../models/Presupuesto';
import DatabaseService from '../database/DatabaseService';

export default class PresupuestoController {
  constructor() {
    this.dbService = new DatabaseService();
  }

  async init() {
    try {
      await this.dbService.init();
      console.log(' PresupuestoController inicializado');
    } catch (error) {
      console.error(' Error al inicializar:', error);
      throw error;
    }
  }

 async obtenerPresupuestoTotal(usuarioId, mes, anio) {
  try {
    const result = await this.dbService.query(
      'SELECT * FROM presupuesto_total WHERE usuarioId = ? AND mes = ? AND anio = ?',
      [usuarioId, mes, anio]
    );
    
    if (result && result.length > 0) {
      return { exito: true, presupuesto: result[0] };
    }
    return { exito: false, mensaje: 'No existe presupuesto' };
  } catch (error) {
    console.error('Error al obtener presupuesto:', error);
    return { exito: false, mensaje: 'Error al obtener presupuesto' };
  }
}
async guardarPresupuestoTotal(usuarioId, monto, mes, anio) {
  try {
    if (monto <= 0) {
      return { exito: false, mensaje: 'El monto debe ser mayor a 0' };
    }

   
    const existe = await this.dbService.query(
      'SELECT * FROM presupuesto_total WHERE usuarioId = ? AND mes = ? AND anio = ?',
      [usuarioId, mes, anio]  
    );

    if (existe && existe.length > 0) {
      // Actualizar
      await this.dbService.update('presupuesto_total', existe[0].id, {
        monto,
        mes,
        anio
      });
    } else {
      // Crear nuevo con usuarioId
      await this.dbService.insert('presupuesto_total', {
        usuarioId,  
        monto,
        mes,
        anio
      });
    }

    return { exito: true, mensaje: 'Presupuesto total guardado' };
  } catch (error) {
    console.error(' Error al guardar presupuesto total:', error);
    return { exito: false, mensaje: 'Error al guardar presupuesto' };
  }
}

 
  async crearPresupuesto(usuarioId, categoria, monto, mes, anio) {
    try {
     
      const presupuesto = new Presupuesto(
        null,
        usuarioId,
        categoria,
        monto,
        mes,
        anio
      );

     
      const validacion = presupuesto.validar();
      if (!validacion.valido) {
        return { 
          exito: false, 
          mensaje: validacion.errores.join(', ') 
        };
      }

     
      const resultado = await this.dbService.insert(
        'presupuestos',
        presupuesto.toJSON()
      );

      return { 
        exito: true, 
        mensaje: 'Presupuesto creado',
        id: resultado.id 
      };
    } catch (error) {
      console.error(' Error al crear presupuesto:', error);
      return { exito: false, mensaje: 'Error al crear presupuesto' };
    }
  }

  async actualizarPresupuesto(id, usuarioId, categoria, monto, mes, anio) {
    try {
      
      const presupuesto = new Presupuesto(
        id,
        usuarioId,
        categoria,
        monto,
        mes,
        anio
      );

     
      const validacion = presupuesto.validar();
      if (!validacion.valido) {
        return { 
          exito: false, 
          mensaje: validacion.errores.join(', ') 
        };
      }

      
      await this.dbService.update('presupuestos', id, presupuesto.toJSON());

      return { exito: true, mensaje: 'Presupuesto actualizado' };
    } catch (error) {
      console.error(' Error al actualizar presupuesto:', error);
      return { exito: false, mensaje: 'Error al actualizar presupuesto' };
    }
  }

  async eliminarPresupuesto(id) {
    try {
      await this.dbService.delete('presupuestos', id);
      return { exito: true, mensaje: 'Presupuesto eliminado' };
    } catch (error) {
      console.error(' Error al eliminar presupuesto:', error);
      return { exito: false, mensaje: 'Error al eliminar presupuesto' };
    }
  }

  async obtenerPresupuestos(usuarioId, mes, anio) {
    try {
      const resultados = await this.dbService.query(
        'SELECT * FROM presupuestos WHERE usuarioId = ? AND mes = ? AND anio = ?',
        [usuarioId, mes, anio]
      );

      return { exito: true, presupuestos: resultados };
    } catch (error) {
      console.error(' Error al obtener presupuestos:', error);
      return { exito: false, mensaje: 'Error al obtener presupuestos' };
    }
  }

  
  async calcularGastosPorCategoria(mes, anio, fechaInicio = null, fechaFin = null) {
    try {
      let query = 'SELECT * FROM transacciones WHERE tipo = ?';
      let params = ['egreso'];

      if (fechaInicio) {
        query += ' AND fecha >= ?';
        params.push(fechaInicio);
      }
      if (fechaFin) {
        query += ' AND fecha <= ?';
        params.push(fechaFin);
      }

      const transacciones = await this.dbService.query(query, params);

      // Agrupar por categoría
      const gastosPorCategoria = {};
      transacciones.forEach(t => {
        const cat = t.categoria.toLowerCase();
        if (!gastosPorCategoria[cat]) {
          gastosPorCategoria[cat] = 0;
        }
        gastosPorCategoria[cat] += t.monto;
      });

      return { exito: true, gastos: gastosPorCategoria };
    } catch (error) {
      console.error(' Error al calcular gastos:', error);
      return { exito: false, mensaje: 'Error al calcular gastos' };
    }
  }

  async validarExcesoPresupuesto(usuarioId, mes, anio) {
    try {
      // Obtener presupuesto total
      const presupuestoTotal = await this.obtenerPresupuestoTotal(mes, anio);
      
      // Obtener suma de presupuestos por categoría
      const presupuestos = await this.obtenerPresupuestos(usuarioId, mes, anio);
      
      if (!presupuestos.exito) {
        return { exito: false, mensaje: 'Error al validar' };
      }

      const sumaPresupuestos = presupuestos.presupuestos.reduce(
        (sum, p) => sum + p.monto, 
        0
      );

      const excede = presupuestoTotal.presupuesto 
        ? sumaPresupuestos > presupuestoTotal.presupuesto.monto
        : false;

      return {
        exito: true,
        excede,
        sumaPresupuestos,
        presupuestoTotal: presupuestoTotal.presupuesto?.monto || 0
      };
    } catch (error) {
      console.error(' Error al validar exceso:', error);
      return { exito: false, mensaje: 'Error al validar' };
    }
  }
}