import { Component } from '@angular/core';
import { PanelMesas } from './components/panel-mesas/panel-mesas';
import { Clientes } from './components/clientes/clientes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PanelMesas, Clientes],
  template: `
    <h1 style="text-align:center; font-family:sans-serif; color:#7c2d12">
      La Fogata Digital
    </h1>
    <app-panel-mesas />
    <hr style="margin: 2rem auto; max-width: 480px; border: none; border-top: 1px solid #fed7aa">
    <app-clientes />
  `,
})
export class App {}
