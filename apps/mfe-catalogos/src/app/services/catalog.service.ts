import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Catalog, CargaCatalogoResponse } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1/inversiones/operaciones';

  constructor(private http: HttpClient) {}

  obtenerCatalogosTipos(): Observable<Catalog[]> {
    return this.http.get<Catalog[] | { data: Catalog[] }>(
      `${this.API_BASE_URL}/catalogos/tipos`
    ).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response.map(this._mapCatalogo);
        }
        return (response?.data ?? []).map(this._mapCatalogo);
      })
    );
  }

  cargarCatalogo(catalogId: string, file: File): Observable<CargaCatalogoResponse> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Content = (reader.result as string).split(',')[1]; // Remove data:image/...;base64, prefix

        const payload = {
          tipoCatalogo: parseInt(catalogId, 10),
          archivoContent: base64Content
        };

        this.http.post<CargaCatalogoResponse>(
          `${this.API_BASE_URL}/catalogos/carga`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).subscribe({
          next: (response) => observer.next(response),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      };
      reader.onerror = () => observer.error(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file); // This will give us base64 with data:image/...;base64, prefix
    });
  }

  private _mapCatalogo(item: any): Catalog {
    return {
      id: item.id ?? item.codigo ?? item.clave ?? item.key ?? '',
      name: item.name ?? item.nombre ?? item.descripcion ?? item.label ?? 'Catálogo sin nombre',
      description: item.description ?? item.descripcion
    };
  }
}
