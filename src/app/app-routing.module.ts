import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { CityComponent } from './city/city.component';
import { ProductComponent } from './product/product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import { CityManagerComponent } from './city/city-manager/city-manager.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { EditCityComponent } from './city/edit-city/edit-city.component';

const routes: Routes = [
  // Rotas públicas
  // Rota de login e registro
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotas protegidas
  // Rota do dashboard
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Rotas para produtos

  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  {
    path: 'products/edit/:id',
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },

  // Rotas para cidades

  { path: 'city', component: CityComponent, canActivate: [AuthGuard] },
  { path: 'cities', component: CityManagerComponent, canActivate: [AuthGuard] },
  { path: 'cities/edit/:id', component: EditCityComponent, canActivate: [AuthGuard] },

  // Rotas para usuários

  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },

  // Rota para o perfil do usuário

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Redirecionamento padrão
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
