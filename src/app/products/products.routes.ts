import { Routes } from '@angular/router';
import { CatalogPage } from './pages/catalog-page/catalog-page';
import { CatalogDetail } from './pages/catalog-detail/catalog-detail';
import { CatalogLayout } from './layout/catalog-layout/catalog-layout';

export const productRoutes: Routes = [
    {
        path: '',
        component: CatalogLayout,
        children: [
            {
                path: 'techProducts',
                component: CatalogPage
            },
            {
                path: 'techProducts/:id',
                component: CatalogDetail
            },
            {
                path: '**',
                redirectTo: 'techProducts'
            }
        ]
    },

]

export default productRoutes