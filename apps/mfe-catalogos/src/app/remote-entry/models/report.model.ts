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
