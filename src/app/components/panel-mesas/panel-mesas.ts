import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-panel-mesas',
  standalone: true,
  imports: [],
  template: `
    <div class="panel-card">
      <h2>Mesas ocupadas</h2>

      <div class="valor">{{ mesasOcupadas() }}</div>

      <div class="info">
        <span>Libres: <strong>{{ mesasLibres() }}</strong></span>
        <span>Total: <strong>{{ totalMesas }}</strong></span>
      </div>

      <div class="controles">
        <button (click)="liberar()">−</button>
        <button (click)="reiniciar()">↺</button>
        <button (click)="ocupar()">+</button>
      </div>

      <!-- control flow moderno: @if y @for -->
      @if (hayCupo()) {
        <div class="mesas">
          @for (mesa of mesas(); track mesa.numero) {
            <span class="mesa" [class.ocupada]="mesa.ocupada">
              {{ mesa.numero }}
            </span>
          }
        </div>
      } @else {
        <p class="lleno">Local lleno — no quedan mesas</p>
      }
    </div>
  `,
  styles: [`
    .panel-card {
      max-width: 320px;
      margin: 2rem auto;
      padding: 2rem;
      border: 2px solid #fed7aa;
      border-radius: 12px;
      text-align: center;
      font-family: sans-serif;
      background: #fff7ed;
    }
    h2 { color: #7c2d12; font-size: 1.1rem; margin: 0; }
    .valor {
      font-size: 5rem;
      font-weight: bold;
      color: #c2410c;
      line-height: 1;
      margin: 1rem 0;
    }
    .info {
      display: flex;
      justify-content: space-around;
      padding: 0.8rem 0;
      color: #78350f;
      font-size: 0.9rem;
      border-top: 1px solid #fed7aa;
      border-bottom: 1px solid #fed7aa;
      margin: 0.8rem 0;
    }
    .controles button {
      font-size: 1.8rem;
      width: 56px;
      height: 56px;
      margin: 0.4rem;
      border: none;
      border-radius: 50%;
      background: #c2410c;
      color: white;
      cursor: pointer;
      transition: background 0.2s;
    }
    .controles button:hover { background: #9a3412; }
    .mesas {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 0.8rem;
    }
    .mesa {
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 8px;
      background: #ffedd5;
      color: #9a3412;
      font-size: 0.85rem;
      border: 1px solid #fed7aa;
    }
    .mesa.ocupada { background: #c2410c; color: white; border-color: #c2410c; }
    .lleno { color: #b91c1c; font-size: 0.9rem; margin-top: 0.8rem; }
  `]
})
export class PanelMesas {

  readonly totalMesas = 8;

  mesasOcupadas = signal(0);

  mesasLibres = computed(() => this.totalMesas - this.mesasOcupadas());
  hayCupo     = computed(() => this.mesasLibres() > 0);

  // Deriva las 8 mesas con su estado: [{numero:1, ocupada:true}, ...]
  mesas = computed(() =>
    Array.from({ length: this.totalMesas }, (_, i) => ({
      numero: i + 1,
      ocupada: i < this.mesasOcupadas(),
    }))
  );

  constructor() {
    effect(() => {
      const ocupadas = this.mesasOcupadas();
      console.log(`[Fogata] Mesas ocupadas: ${ocupadas} de ${this.totalMesas}`);

      if (!this.hayCupo()) {
        console.warn('[Fogata] Local lleno: no quedan mesas libres');
      }
    });
  }

  ocupar() {
    this.mesasOcupadas.update(v => Math.min(v + 1, this.totalMesas));
  }

  liberar() {
    this.mesasOcupadas.update(v => Math.max(v - 1, 0));
  }

  reiniciar() {
    this.mesasOcupadas.set(0);
  }
}
