import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';
import { AdminDashboard } from '../admin-dashboard';

@Component({
  standalone: true,
  selector: 'app-mfCatalogos-entry',
  imports: [AdminDashboard],
  template: `<app-admin-dashboard></app-admin-dashboard>`,
})
export class RemoteEntry {}


