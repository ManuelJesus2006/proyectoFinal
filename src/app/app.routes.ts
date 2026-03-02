import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomePage } from './shared/pages/home-page/home-page';
import { LoginPage } from './shared/pages/login-page/login-page';
import { RegisterPage } from './shared/pages/register-page/register-page';
import { authGuard } from './products/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'register',
        component: RegisterPage
    },
    {
        path: 'catalog',
        canActivate: [authGuard], 
        loadChildren: () => import('./products/products.routes')
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];