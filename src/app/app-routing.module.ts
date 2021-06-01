import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { TabsComponent } from './pages/tabs/tabs.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';
import { UserComponent } from './pages/user/user.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './utils/auth-guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {path: 'overview', component: OverviewComponent},
      {path: 'equipment', component: EquipmentComponent},
      {path: 'user', component: UserComponent}
    ],
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canDeactivate: [AuthGuard],
  },
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'tabs/overview', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
