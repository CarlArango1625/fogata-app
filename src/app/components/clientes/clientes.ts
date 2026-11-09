import { Component, computed, signal } from '@angular/core';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  template: `
    <div class="panel-clientes">
      <header class="panel-header">
        <h1>🔥 La Fogata Digital — Clientes</h1>
        <button class="btn-recargar" (click)="recargar()">Recargar</button>
      </header>

      <!-- Estado de carga: @if / @else -->
      @if (cargando()) {
        <div class="cargando">
          <span class="spinner"></span>
          <p>Cargando clientes de La Fogata...</p>
        </div>
      } @else {

        <p class="resumen-activos">
          {{ totalActivos() }} de {{ clientes().length }} clientes activos
        </p>

        <!-- Barra de filtros: @for sobre un arreglo estático -->
        <div class="filtros">
          @for (region of regiones; track region.valor) {
            <button
              class="btn-filtro"
              [class.activo]="filtroRegion() === region.valor"
              (click)="filtrar(region.valor)">
              {{ region.etiqueta }}
            </button>
          }
        </div>

        <!-- Resumen de resultados: @if con alias -->
        @if (clientesFiltrados().length; as total) {
          <p class="resumen">
            Mostrando {{ total }} cliente(s)
            @if (filtroRegion() !== 'todas') {
              en la región <strong>{{ filtroRegion() }}</strong>
            }
          </p>
        }

        <!-- Lista: @for con track y variables implícitas -->
        <ul class="lista-clientes">
          @for (cliente of clientesFiltrados(); track cliente.id;
            let i = $index, total = $count, primero = $first) {
            <li class="cliente-item" [class.primero]="primero">
              <span class="numero">{{ i + 1 }}/{{ total }}</span>

              <div class="cliente-datos">
                <h3>{{ cliente.nombre }} {{ cliente.apellido }}</h3>
                <p class="email">{{ cliente.email }}</p>
              </div>

              <!-- Insignia de región: @switch -->
              @switch (cliente.region) {
                @case ('Suramerica') {
                  <span class="insignia sur-america">🌎 Suramerica</span>
                }
                @case ('Norteamerica') {
                  <span class="insignia norte-america">🗽 Norteamerica</span>
                }
                @case ('Europa') {
                  <span class="insignia europa">🏰 Europa</span>
                }
                @case ('Asia') {
                  <span class="insignia asia">🏯 Asia</span>
                }
                @default {
                  <span class="insignia sin-region">📍 Sin región</span>
                }
              }

              <!-- Estado: @if / @else -->
              @if (cliente.activo) {
                <span class="estado activo">Activo</span>
              } @else {
                <span class="estado inactivo">Inactivo</span>
              }
            </li>

          } @empty {
            <!-- Solo aparece cuando clientesFiltrados() está vacío -->
            <li class="vacio">
              <p class="vacio-icono">🍽️</p>
              <p class="vacio-titulo">No hay clientes en esta región</p>
              <p class="vacio-sub">
                La Fogata todavía no tiene domicilios registrados aquí.
              </p>
              <button class="btn-filtro activo" (click)="filtrar('todas')">
                Ver todas las regiones
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .panel-clientes {
      max-width: 780px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: system-ui, sans-serif;
      color: #1f2937;
    }
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 2px solid #f3e0d6;
      padding-bottom: 0.6rem;
    }
    h1 { font-size: 1.4rem; margin: 0; color: #7c2d12; }
    .btn-recargar {
      padding: 0.45rem 1.1rem;
      border: none;
      border-radius: 6px;
      background: #c2410c;
      color: white;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .btn-recargar:hover { background: #9a3412; }

    .resumen-activos { color: #6b7280; font-size: 0.9rem; }

    /* Estado de carga */
    .cargando { text-align: center; padding: 3rem 1rem; color: #9a3412; }
    .spinner {
      display: inline-block;
      width: 28px; height: 28px;
      border: 3px solid #fde4d3;
      border-top-color: #c2410c;
      border-radius: 50%;
      animation: girar 0.8s linear infinite;
    }
    @keyframes girar { to { transform: rotate(360deg); } }

    /* Filtros */
    .filtros { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0 0.8rem; }
    .btn-filtro {
      padding: 0.35rem 0.95rem;
      border: 2px solid #c2410c;
      border-radius: 20px;
      background: white;
      color: #c2410c;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-filtro.activo, .btn-filtro:hover { background: #c2410c; color: white; }
    .resumen { color: #6b7280; font-size: 0.85rem; margin: 0 0 0.8rem; }

    /* Lista */
    .lista-clientes { list-style: none; padding: 0; margin: 0; }
    .cliente-item {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 0.7rem 1rem;
      margin-bottom: 0.6rem;
      background: white;
    }
    .cliente-item.primero { border-color: #c2410c; }
    .numero { font-size: 0.72rem; color: #9ca3af; min-width: 34px; }
    .cliente-datos { flex: 1; }
    .cliente-datos h3 { margin: 0; font-size: 0.98rem }
    .email { margin: 0.15rem 0 0; font-size: 0.78rem; color: #9ca3af; }
    .insignia {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      white-space: nowrap;
    }
    .insignia.sur-america   { background: #eef2ff; color: #3730a3; }
    .insignia.norte-america { background: #ecfdf5; color: #065f46; }
    .insignia.europa        { background: #fff7ed; color: #9a3412; }
    .insignia.asia          { background: #fdf4ff; color: #86198f; }
    .insignia.sin-region    { background: #f3f4f6; color: #6b7280; }

    .estado {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 6px;
      white-space: nowrap;
    }
    .estado.activo   { background: #dcfce7; color: #166534; }
    .estado.inactivo { background: #fee2e2; color: #991b1b; }
    /* Estado vacío */
    .vacio {
      text-align: center;
      padding: 2.5rem 1.5rem;
      background: #fffaf6;
      border: 2px dashed #f3d5c2;
      border-radius: 12px;
      list-style: none;
    }
    .vacio-icono  { font-size: 2.6rem; margin: 0; }
    .vacio-titulo { font-size: 1.05rem; font-weight: bold; color: #7c2d12; margin: 0.4rem 0; }
    .vacio-sub    { color: #9ca3af; font-size: 0.85rem; margin: 0 0 1rem; }
  `]
})
export class Clientes {

  // Estado: los clientes de La Fogata (por ahora, en memoria)
  clientes = signal<Cliente[]>([
    { id: 1, nombre: 'Ana',     apellido: 'Restrepo',  email: 'ana.restrepo@correo.com',    region: 'Suramerica',   activo: true  },
    { id: 2, nombre: 'Carlos',  apellido: 'Mejía',     email: 'carlos.mejia@correo.com',    region: 'Europa',       activo: true  },
    { id: 3, nombre: 'Lucía',   apellido: 'Ordóñez',   email: 'lucia.ordonez@correo.com',   region: 'Norteamerica', activo: false },
    { id: 4, nombre: 'Miguel',  apellido: 'Tovar',     email: 'miguel.tovar@correo.com',    region: 'Asia',         activo: true  },
    { id: 5, nombre: 'Daniela', apellido: 'Ossa',      email: 'daniela.ossa@correo.com',    region: 'Suramerica',   activo: true  },
    { id: 6, nombre: 'Julián',  apellido: 'Vera',      email: 'julian.vera@correo.com',     region: 'Norteamerica', activo: true  },
    { id: 7, nombre: 'Paula',   apellido: 'Cifuentes', email: 'paula.cifuentes@correo.com', region: 'Europa',       activo: false },
    { id: 8, nombre: 'Andrés',  apellido: 'Quiceno',   email: 'andres.quiceno@correo.com',  region: 'Asia',         activo: true  },
  ]);

  // Estado de carga (simulado)
  cargando = signal(false);

  // Filtro activo
  filtroRegion = signal<string>('todas');

  // Constante: no necesita ser signal
  regiones = [
    { valor: 'todas',        etiqueta: 'Todas'        },
    { valor: 'Suramerica',   etiqueta: 'Suramerica'   },
    { valor: 'Norteamerica', etiqueta: 'Norteamerica' },
    { valor: 'Europa',       etiqueta: 'Europa'       },
    { valor: 'Asia',         etiqueta: 'Asia'         },
    { valor: 'Africa',       etiqueta: 'Africa'       },
  ];

  // Estado derivado
  totalActivos  = computed(() =>
    this.clientes().filter(c => c.activo).length
  );

  clientesFiltrados = computed(() => {
    const region = this.filtroRegion();
    return region === 'todas'
      ? this.clientes()
      : this.clientes().filter(c => c.region === region);
  });

  filtrar(region: string): void {
    this.filtroRegion.set(region);
  }

  recargar(): void {
    this.cargando.set(true);
    // Simula la latencia de una petición. En el codelab 4 será HTTP real.
    setTimeout(() => this.cargando.set(false), 1200);
  }
}
