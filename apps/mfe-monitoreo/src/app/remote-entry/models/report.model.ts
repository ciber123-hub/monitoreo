/**
 * Modelo de datos para reportes de monitoreo
 */

export type EstadoReport = 'generadoOk' | 'enviado' | 'errorEnviar' | 'errorGenerar';
export type TipoArchivo = 'MO' | 'MD' | 'ME' | 'FL';

/**
 * Interfaz para un evento en la línea de tiempo
 */
export interface TimelineItem {
  estado: EstadoReport;
  fechaHora: string; // Formato: 'dd/mm/yyyy HH:MM'
  descripcion?: string;
}

/**
 * Interfaz para un registro individual de reporte
 */
export interface ReportData {
  id?: number;
  fechaHora: string; // Formato: 'dd/mm/yyyy HH:MM'
  archivo: TipoArchivo;
  estado: EstadoReport;
  backendTypeDescription?: string; // Descripción del tipo de archivo desde el backend
  backendStatusDescription?: string; // Descripción del estado desde el backend
  timeline?: TimelineItem[]; // Línea de tiempo del reporte
}

/**
 * Interfaz para configuración de estado (label, severity)
 */
export interface EstadoConfig {
  key: EstadoReport;
  label: string;
  severity: 'success' | 'info' | 'danger' | 'warning' | 'secondary';
}

/**
 * Interfaz para filtros de búsqueda
 */
export interface FiltroRequest {
  fechaDesde?: Date | null;
  fechaHasta?: Date | null;
  estados?: EstadoReport[];
  archivos?: TipoArchivo[];
}

/**
 * Interfaz para respuesta de búsqueda
 */
export interface FiltroResponse {
  total: number;
  datos: ReportData[];
  filtroAplicado: FiltroRequest;
  fechaBusqueda: Date;
}

/**
 * Configuración de tipos de archivo disponibles
 */
export const ARCHIVO_CONFIG: Record<TipoArchivo, { label: string; codigo: string }> = {
  MO: { label: 'Módulo Operativo', codigo: 'MO' },
  MD: { label: 'Módulo Datos', codigo: 'MD' },
  ME: { label: 'Módulo Exportación', codigo: 'ME' },
  FL: { label: 'Flujo Logístico', codigo: 'FL' }
};

/**
 * Configuración de estados disponibles
 */
export const ESTADO_CONFIG: EstadoConfig[] = [
  { key: 'generadoOk', label: 'Generado OK', severity: 'success' },
  { key: 'enviado', label: 'Enviado', severity: 'info' },
  { key: 'errorEnviar', label: 'Error al enviar', severity: 'danger' },
  { key: 'errorGenerar', label: 'Error al generar', severity: 'danger' }
];

/**
 * ============================================
 * INTERFACES PARA CONEXIÓN CON BACKEND
 * ============================================
 */

/**
 * Request para consultar archivos/registros del backend
 * Mapea al endpoint: POST /api/v1/inversiones/operaciones/archivos/registros/consulta
 */
export interface ConsultaArchivosRequest {
  fechaCreacionInicial: string; // Formato: "" (vacío)
  fechaCreacionFinal: string;   // Formato: "" (vacío)
  estatus: number[];             // Estados como números para filtrar
  tipos: number[];               // Tipos de archivo como números para filtrar
  offset: number;                // Para paginación
  limit: number;                 // Cantidad de registros
}

/**
 * Mapeo de estados (string) a números para el backend
 */
export const ESTATUS_MAP: Record<string, number> = {
  'generadoOk': 1,
  'enviado': 2,
  'errorEnviar': 3,
  'errorGenerar': 4
};

/**
 * Mapeo inverso de números a estados (string)
 */
export const ESTATUS_MAP_INVERSO: Record<number, string> = {
  1: 'generadoOk',
  2: 'enviado',
  3: 'errorEnviar',
  4: 'errorGenerar'
};

/**
 * Mapeo de tipos de archivo (string) a números para el backend
 */
export const TIPO_ARCHIVO_MAP: Record<string, number> = {
  'MO': 1,
  'MD': 2,
  'ME': 3,
  'FL': 4
};

/**
 * Mapeo inverso de números a tipos de archivo (string)
 */
export const TIPO_ARCHIVO_MAP_INVERSO: Record<number, string> = {
  1: 'MO',
  2: 'MD',
  3: 'ME',
  4: 'FL'
};

/**
 * Mapeo de descripciones de estatus del backend a estados locales
 */
export const ESTATUS_BACKEND_MAP: Record<string, string> = {
  'PENDIENTE': 'generadoOk',
  'ENVIADO': 'enviado',
  'PROCESADO': 'enviado', // Assuming PROCESADO maps to enviado
  'ERROR_ENVIO': 'errorEnviar',
  'ERROR_GENERACION': 'errorGenerar'
};

/**
 * Respuesta del backend con registros de archivos
 */
export interface ConsultaArchivosResponse {
  items: RegistroArchivo[];
  metadata: {
    count: number;
    offset: number;
    limit: number;
  };
}

/**
 * Registro individual del backend
 * Mapea los datos devueltos por el servicio del backend
 */
export interface RegistroArchivo {
  fechaCreacion: string;        // "2024-03-01 09:00:00"
  nombre: string;               // nombre del archivo
  tipo: {
    id: number;                 // 1, 2, 3, 4
    descripcion: string;        // "MD", "MF", etc
  };
  estatus: {
    id: number;                 // 1 = PENDIENTE, etc
    descripcion: string;        // "PENDIENTE", "ENVIADO", etc
  };
  bitacora: Array<{
    code: number;               // Código de evento
    fecha: string;              // "2024-03-01 09:00:00"
    mensaje: string;            // Descripción del evento
  }>;
}
