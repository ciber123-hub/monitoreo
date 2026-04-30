export interface Catalog {
  id: string;
  name: string;
  description?: string;
}

export interface CargaCatalogoPaso {
  estatus: string;
  descripcionError?: string;
}

export interface CargaCatalogoResponse {
  archivoValidado: CargaCatalogoPaso;
  procesando: CargaCatalogoPaso;
  actualizando: CargaCatalogoPaso;
  finalizado: CargaCatalogoPaso;
  totales: {
    registrosAgregados: number;
    registrosActualizados: number;
  };
}
