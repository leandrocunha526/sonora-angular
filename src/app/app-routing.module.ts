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

const routes: Routes = [
  // Rotas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rota protegida
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'product/edit/:id', component: EditProductComponent, canActivate: [AuthGuard] },


  { path: 'city', component: CityComponent, canActivate: [AuthGuard] },

  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Redirecionamento padrão
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
