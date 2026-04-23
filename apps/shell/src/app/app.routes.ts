import { Route } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Layout } from './layout/layout';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'mfDashboard',
        loadChildren: () =>
          import('mfDashboard/Routes').then((m) => m.remoteRoutes),
      },
      {
        path: 'mfUsuarios',
        loadChildren: () =>
          import('mfUsuarios/Routes').then((m) => m.remoteRoutes),
      },
      {
        path: 'mfCatalogos',
        loadChildren: () =>
          import('mfCatalogos/Routes').then((m) => m.remoteRoutes),
      },
      {
        path: 'mfMonitoreo',
        loadChildren: () =>
          import('mfMonitoreo/Routes').then((m) => m.remoteRoutes),
      },
    ],
  },

  // 🔥 fallback obligatorio
  {
    path: '**',
    redirectTo: 'login',
  },
];