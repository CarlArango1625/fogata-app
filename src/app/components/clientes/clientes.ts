import { Component, computed, signal } from '@angular/core';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  template: `
    <div class="clientes-container">
      <h2>Clientes de La Fogata</h2>

      <p class="resumen">
        {{ totalClientes() }} clientes · <strong>{{ totalActivos() }} activos</strong>
      </p>

      <ul class="lista">
        @for (cliente of clientes(); track cliente.id) {
          <li class="cliente-row">
            <span class="cliente-nombre">
              {{ cliente.nombre }} {{ cliente.apellido }}
            </span>
            <span class="cliente-region">{{ cliente.region }}</span>
            <span class="cliente-estado" [class.inactivo]="!cliente.activo">
              {{ cliente.activo ? 'activo' : 'inactivo' }}
            </span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .clientes-container {
      max-width: 480px;
      margin: 2rem auto;
      font-family: sans-serif;
    }
    h2 { text-align: center; color: #7c2d12; }
    .resumen {
      text-align: center;
      color: #78350f;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .lista { list-style: none; padding: 0; margin: 0; }
    .cliente-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 0.6rem;
      border-bottom: 1px solid #fed7aa;
    }
    .cliente-nombre { flex: 1; color: #1f2937; }
    .cliente-region {
      color: #9a3412;
      font-size: 0.85rem;
      background: #ffedd5;
      padding: 2px 10px;
      border-radius: 20px;
    }
    .cliente-estado {
      min-width: 70px;
      text-align: right;
      font-size: 0.85rem;
      color: #15803d;
      font-weight: 500;
    }
    .cliente-estado.inactivo { color: #9ca3af; font-weight: 400; }
  `]
})
export class Clientes {

  // Estado: los clientes de La Fogata (por ahora, en memoria)
  clientes = signal<Cliente[]>([
    { id: 1, nombre: 'Ana',      apellido: 'Restrepo',  email: 'ana@fogata.co',      region: 'Suramerica',   activo: true  },
    { id: 2, nombre: 'Bruno',    apellido: 'Cifuentes', email: 'bruno@fogata.co',    region: 'Norteamerica', activo: false },
    { id: 3, nombre: 'Carolina', apellido: 'Mena',      email: 'carolina@fogata.co', region: 'Europa',       activo: true  },
    { id: 4, nombre: 'Daniel',   apellido: 'Ossa',      email: 'daniel@fogata.co',   region: 'Suramerica',   activo: false },
    { id: 5, nombre: 'Elena',    apellido: 'Vargas',    email: 'elena@fogata.co',    region: 'Asia',         activo: true  },
  ]);

  // Estado derivado
  totalClientes = computed(() => this.clientes().length);
  totalActivos  = computed(() =>
    this.clientes().filter(c => c.activo).length
  );
}
