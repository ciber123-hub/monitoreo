import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportData, FiltroRequest, FiltroResponse, EstadoConfig, ESTADO_CONFIG, TipoArchivo, ConsultaArchivosRequest, ConsultaArchivosResponse, RegistroArchivo, ESTATUS_MAP, TIPO_ARCHIVO_MAP, TIPO_ARCHIVO_MAP_INVERSO, ESTATUS_BACKEND_MAP } from '../models/report.model';
import { delay, of, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  // URL base del backend
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1/inversiones/operaciones'; // Ruta con proxy
  /**
   * Datos dummy: 30 registros realistas para el mes de febrero/marzo 2026
   */
  private readonly DUMMY_DATA: ReportData[] = [
    // 01/02/2026
    { id: 1, fechaHora: '01/01/2026 08:15', archivo: 'MO', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '01/01/2026 08:15', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 2, fechaHora: '01/01/2026 09:30', archivo: 'MD', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '01/01/2026 09:20', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '01/01/2026 09:30', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 3, fechaHora: '01/02/2026 10:45', archivo: 'ME', estado: 'errorEnviar', timeline: [
      { estado: 'generadoOk', fechaHora: '01/02/2026 10:30', descripcion: 'Archivo generado' },
      { estado: 'errorEnviar', fechaHora: '01/02/2026 10:45', descripcion: 'Error al enviar archivo' }
    ]},
    { id: 4, fechaHora: '01/01/2026 11:20', archivo: 'FL', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '01/01/2026 11:20', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 5, fechaHora: '01/02/2026 14:00', archivo: 'MO', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '01/02/2026 13:50', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '01/02/2026 14:00', descripcion: 'Archivo enviado a API' }
    ]},
    
    // 02/02/2026
    { id: 6, fechaHora: '02/03/2026 07:30', archivo: 'MD', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '02/03/2026 07:30', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 7, fechaHora: '02/03/2026 08:45', archivo: 'ME', estado: 'errorGenerar', timeline: [
      { estado: 'errorGenerar', fechaHora: '02/03/2026 08:45', descripcion: 'Error durante la generación del archivo' }
    ]},
    { id: 8, fechaHora: '02/03/2026 09:15', archivo: 'FL', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '02/03/2026 09:05', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '02/03/2026 09:15', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 9, fechaHora: '02/02/2026 10:30', archivo: 'MO', estado: 'errorEnviar', timeline: [
      { estado: 'generadoOk', fechaHora: '02/02/2026 10:20', descripcion: 'Archivo generado' },
      { estado: 'errorEnviar', fechaHora: '02/02/2026 10:30', descripcion: 'Error al enviar archivo' }
    ]},
    { id: 10, fechaHora: '02/02/2026 13:00', archivo: 'MD', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '02/02/2026 13:00', descripcion: 'Archivo generado correctamente' }
    ]},
    
    // 03/02/2026
    { id: 11, fechaHora: '03/02/2026 06:00', archivo: 'ME', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '03/02/2026 05:50', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '03/02/2026 06:00', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 12, fechaHora: '03/02/2026 07:45', archivo: 'FL', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '03/02/2026 07:45', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 13, fechaHora: '03/02/2026 09:00', archivo: 'MO', estado: 'errorEnviar', timeline: [
      { estado: 'generadoOk', fechaHora: '03/02/2026 08:50', descripcion: 'Archivo generado' },
      { estado: 'errorEnviar', fechaHora: '03/02/2026 09:00', descripcion: 'Error al enviar archivo' }
    ]},
    { id: 14, fechaHora: '03/02/2026 11:30', archivo: 'MD', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '03/02/2026 11:20', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '03/02/2026 11:30', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 15, fechaHora: '03/02/2026 15:00', archivo: 'ME', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '03/02/2026 15:00', descripcion: 'Archivo generado correctamente' }
    ]},
    
    // 04/02/2026
    { id: 16, fechaHora: '04/02/2026 08:00', archivo: 'FL', estado: 'errorGenerar', timeline: [
      { estado: 'errorGenerar', fechaHora: '04/02/2026 08:00', descripcion: 'Error durante la generación del archivo' }
    ]},
    { id: 17, fechaHora: '04/02/2026 09:30', archivo: 'MO', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '04/02/2026 09:30', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 18, fechaHora: '04/02/2026 10:15', archivo: 'MD', estado: 'errorEnviar', timeline: [
      { estado: 'generadoOk', fechaHora: '04/02/2026 10:05', descripcion: 'Archivo generado' },
      { estado: 'errorEnviar', fechaHora: '04/02/2026 10:15', descripcion: 'Error al enviar archivo' }
    ]},
    { id: 19, fechaHora: '04/02/2026 12:45', archivo: 'ME', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '04/02/2026 12:35', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '04/02/2026 12:45', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 20, fechaHora: '04/02/2026 14:30', archivo: 'FL', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '04/02/2026 14:30', descripcion: 'Archivo generado correctamente' }
    ]},
    
    // 05/02/2026
    { id: 21, fechaHora: '05/02/2026 07:15', archivo: 'MD', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '05/02/2026 07:05', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '05/02/2026 07:15', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 22, fechaHora: '05/02/2026 08:30', archivo: 'ME', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '05/02/2026 08:30', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 23, fechaHora: '05/02/2026 10:00', archivo: 'FL', estado: 'errorGenerar', timeline: [
      { estado: 'errorGenerar', fechaHora: '05/02/2026 10:00', descripcion: 'Error durante la generación del archivo' }
    ]},
    { id: 24, fechaHora: '05/02/2026 11:45', archivo: 'MO', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '05/02/2026 11:45', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 25, fechaHora: '05/02/2026 13:30', archivo: 'MD', estado: 'errorEnviar', timeline: [
      { estado: 'generadoOk', fechaHora: '05/02/2026 13:20', descripcion: 'Archivo generado' },
      { estado: 'errorEnviar', fechaHora: '05/02/2026 13:30', descripcion: 'Error al enviar archivo' }
    ]},
    
    // 06/02/2026
    { id: 26, fechaHora: '06/03/2026 06:45', archivo: 'ME', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '06/03/2026 06:35', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '06/03/2026 06:45', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 27, fechaHora: '06/03/2026 08:15', archivo: 'FL', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '06/03/2026 08:15', descripcion: 'Archivo generado correctamente' }
    ]},
    { id: 28, fechaHora: '06/02/2026 09:45', archivo: 'MO', estado: 'errorEnviar', timeline: [
      { estado: 'generadoOk', fechaHora: '06/02/2026 09:35', descripcion: 'Archivo generado' },
      { estado: 'errorEnviar', fechaHora: '06/02/2026 09:45', descripcion: 'Error al enviar archivo' }
    ]},
    { id: 29, fechaHora: '06/02/2026 12:00', archivo: 'MD', estado: 'enviado', timeline: [
      { estado: 'generadoOk', fechaHora: '06/02/2026 11:50', descripcion: 'Archivo generado' },
      { estado: 'enviado', fechaHora: '06/02/2026 12:00', descripcion: 'Archivo enviado a API' }
    ]},
    { id: 30, fechaHora: '06/02/2026 15:30', archivo: 'ME', estado: 'generadoOk', timeline: [
      { estado: 'generadoOk', fechaHora: '06/02/2026 15:30', descripcion: 'Archivo generado correctamente' }
    ]}
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los datos sin filtros (para inicialización)
   */
  obtenerTodos() {
    return of(this.DUMMY_DATA).pipe(delay(300)); // Simular latencia de API
  }

  /**
   * Busca y filtra datos según los criterios especificados
   * @param filtro - Objeto con criterios de búsqueda
   * @returns Observable con respuesta de búsqueda
   */
  buscar(filtro: FiltroRequest) {
    return of(this._aplicarFiltros(filtro)).pipe(delay(400)); // Simular latencia de API
  }

  /**
   * Método privado para aplicar filtros a los datos
   */
  private _aplicarFiltros(filtro: FiltroRequest): FiltroResponse {
    let resultado = [...this.DUMMY_DATA];

    // Filtrar por rango de fechas
    if (filtro.fechaDesde || filtro.fechaHasta) {
      resultado = resultado.filter(item => {
        const itemDate = this._parseFechaHora(item.fechaHora);
        const cumpleFechaDesde = !filtro.fechaDesde || itemDate >= new Date(filtro.fechaDesde);
        const cumpleFechaHasta = !filtro.fechaHasta || itemDate <= new Date(filtro.fechaHasta);
        return cumpleFechaDesde && cumpleFechaHasta;
      });
    }

    // Filtrar por estados seleccionados
    if (filtro.estados && filtro.estados.length > 0) {
      resultado = resultado.filter(item => filtro.estados!.includes(item.estado));
    }

    // Filtrar por archivos seleccionados
    if (filtro.archivos && filtro.archivos.length > 0) {
      resultado = resultado.filter(item => filtro.archivos!.includes(item.archivo));
    }

    return {
      total: resultado.length,
      datos: resultado,
      filtroAplicado: filtro,
      fechaBusqueda: new Date()
    };
  }

  /**
   * Convierte string de fecha/hora a objeto Date
   * @param fechaHora - Formato: 'dd/mm/yyyy HH:MM'
   */
  private _parseFechaHora(fechaHora: string): Date {
    const [fecha, hora] = fechaHora.split(' ');
    const [dia, mes, anio] = fecha.split('/').map(Number);
    const [h, m] = hora ? hora.split(':').map(Number) : [0, 0];
    return new Date(anio, mes - 1, dia, h, m);
  }

  /**
   * Obtiene la configuración de estados
   */
  obtenerEstadoConfig(): EstadoConfig[] {
    return ESTADO_CONFIG;
  }

  /**
   * Obtiene lista de archivos disponibles
   */
  obtenerArchivos(): TipoArchivo[] {
    return ['MO', 'MD', 'ME', 'FL'];
  }

  /**
   * ============================================
   * MÉTODOS PARA CONEXIÓN CON BACKEND
   * ============================================
   */

  /**
   * Consulta archivos/registros del backend
   * POST /api/v1/inversiones/operaciones/archivos/registros/consulta
   * 
   * @param filtro - Objeto con criterios de búsqueda local
   * @returns Observable con datos transformados a ReportData[]
   */
  consultarArchivosBackend(filtro: FiltroRequest) {
    // Construir request para el backend
    const request = this._construirConsultaRequest(filtro);
    
    // Realizar llamada al backend
    return this.http.post<ConsultaArchivosResponse>(
      `${this.API_BASE_URL}/archivos/registros/consulta`,
      request
    ).pipe(
      map(response => {
        // La respuesta tiene items directamente (sin envuelta success/data)
        if (response && response.items && Array.isArray(response.items)) {
          const datos = response.items.map(item => 
            this._mapearRegistroArchivo(item)
          );
          console.log('✓ Datos mapeados del backend:', datos);
          return {
            total: response.metadata?.count || response.items.length,
            datos: datos,
            filtroAplicado: filtro,
            fechaBusqueda: new Date()
          };
        }
        console.warn('Respuesta inesperada del backend:', response);
        return {
          total: 0,
          datos: [],
          filtroAplicado: filtro,
          fechaBusqueda: new Date()
        };
      }),
      catchError(error => {
        console.error('Error al consultar backend:', error);
        // Fallback a datos dummy en caso de error
        return of(this._aplicarFiltros(filtro));
      })
    );
  }

  /**
   * Construye el request para el backend a partir de los filtros locales
   * @param filtro - Criterios de búsqueda local
   */
  private _construirConsultaRequest(filtro: FiltroRequest): ConsultaArchivosRequest {
    // Mapear estados de string a números
    const statusNumbers = (filtro.estados || []).map(estado => ESTATUS_MAP[estado]).filter(n => n !== undefined);

    // Mapear tipos de archivo de string a números
    const tiposNumbers = (filtro.archivos || []).map(tipo => TIPO_ARCHIVO_MAP[tipo]).filter(n => n !== undefined);

    // Convertir fechas a formato "yyyy-MM-dd HH:mm:ss" o enviar vacío si no hay fecha
    const fechaInicial = filtro.fechaDesde 
      ? this._formatearFechaParaBackend(filtro.fechaDesde)
      : '';

    const fechaFinal = filtro.fechaHasta
      ? this._formatearFechaParaBackend(filtro.fechaHasta)
      : '';

    return {
      fechaCreacionInicial: fechaInicial,
      fechaCreacionFinal: fechaFinal,
      estatus: statusNumbers as number[],
      tipos: tiposNumbers as number[],
      offset: 0,
      limit: 10
    };
  }

  /**
   * Formatea una fecha en formato requerido por el backend "yyyy-MM-dd HH:mm:ss"
   */
  private _formatearFechaParaBackend(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Mapea un RegistroArchivo del backend a ReportData local
   * @param registro - Registro del backend
   */
  private _mapearRegistroArchivo(registro: RegistroArchivo): ReportData {
    // Convertir formato de fecha del backend a formato local
    const fechaHora = this._convertirFechaBackendALocal(registro.fechaCreacion || '');
    
    // Obtener el tipo de archivo (usa la descripción que viene en tipo.descripcion)
    const tipoArchivo = (registro.tipo?.descripcion || 'MO') as TipoArchivo;
    
    // Mapear estado: usa la descripción del estatus del backend
    const estadoMapeado = ESTATUS_BACKEND_MAP[registro.estatus?.descripcion || 'PENDIENTE'] || 'generadoOk';
    const estadoLocal = estadoMapeado as any; // Cast a EstadoReport
    
    // Construir la línea de tiempo desde la bitácora
    const timeline = registro.bitacora && registro.bitacora.length > 0
      ? registro.bitacora.map(evento => ({
          estado: estadoLocal,
          fechaHora: this._convertirFechaBackendALocal(evento.fecha),
          descripcion: evento.mensaje
        }))
      : [{
          estado: estadoLocal,
          fechaHora: fechaHora,
          descripcion: `Archivo: ${registro.nombre}`
        }];
    
    return {
      id: undefined,
      fechaHora: fechaHora,
      archivo: tipoArchivo,
      estado: estadoLocal,
      backendTypeDescription: registro.tipo?.descripcion,
      backendStatusDescription: registro.estatus?.descripcion,
      timeline: timeline as any // Cast a TimelineItem[]
    };
  }

  /**
   * Convierte fecha del backend "yyyy-MM-dd HH:mm:ss" a formato local "dd/mm/yyyy HH:MM"
   */
  private _convertirFechaBackendALocal(fechaBackend: string): string {
    try {
      // Parsear "2024-01-15 08:30:45"
      const [fecha, hora] = fechaBackend.split(' ');
      const [year, month, day] = fecha.split('-');
      const [h, m] = hora.split(':');
      
      return `${day}/${month}/${year} ${h}:${m}`;
    } catch (error) {
      console.error('Error al convertir fecha:', fechaBackend);
      return new Date().toLocaleString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '');
    }
  }
}
