import { Routes } from '@angular/router';
import { CatalogPage } from './pages/catalog-page/catalog-page';
import { CatalogDetail } from './pages/catalog-detail/catalog-detail';
import { CatalogLayout } from './layout/catalog-layout/catalog-layout';
import { PriceComponent } from './components/priceComponent/priceComponent';
import { DetailsComponent } from './components/detailsComponent/detailsComponent';

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
                component: CatalogDetail,
                children: [
                    {path: 'price', component:PriceComponent},
                    {path: 'details', component:DetailsComponent},
                    {path: '', redirectTo: 'price', pathMatch: 'full'}
                ]
            },
            {
                path: '**',
                redirectTo: 'techProducts'
            }
        ]
    },

]

export default productRoutes