import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StatusGuard } from './guards/status.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard, StatusGuard]},
  { path: 'home/:slug', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard, StatusGuard]},
  { path: 'register', loadChildren: './user/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './user/login/login.module#LoginPageModule' },
  { path: 'forget/change-password', loadChildren: './user/forget-password/forget-password.module#ForgetPasswordPageModule' },
  { path: 'starter', loadChildren: './starter/starter.module#StarterPageModule' },
  { path: 'modify-form', loadChildren: './complaint/modify-form/modify-form.module#ModifyFormPageModule' },
  { path: 'apply-form', loadChildren: './complaint/apply-form/apply-form.module#ApplyFormPageModule' },
  { path: 'waiting-status', loadChildren: './user/waiting-status/waiting-status.module#WaitingStatusPageModule' },
  { path: 'modify-profile', loadChildren: './user/modify-profile/modify-profile.module#ModifyProfilePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
