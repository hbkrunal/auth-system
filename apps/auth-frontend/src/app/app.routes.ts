import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard],
    data: { isNoAuth: true },
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../pages/register/signup.component').then(
        (m) => m.SignupComponent
      ),
    canActivate: [AuthGuard],
    data: { isNoAuth: true },
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../pages/home/home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
