import { Routes } from '@angular/router';
import { HomePage } from './shared/pages/home-page/home-page';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'catalog',
        loadChildren: ()=> import('./products/products.routes')
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
