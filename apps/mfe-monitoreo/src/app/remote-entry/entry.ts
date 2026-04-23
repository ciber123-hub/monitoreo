import { Component } from '@angular/core';
import { AdminDashboard } from './admin-dashboard';



@Component({
  standalone: true,
  selector: 'app-mfMonitoreo-entry',
  imports: [AdminDashboard],
  template: `<app-admin-dashboard></app-admin-dashboard>`,
})
export class RemoteEntry {}
