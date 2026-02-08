import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { SearchInput } from "../../components/search-input/search-input";
import { TechProductsResponse } from '../../interface/techProducts.interface';
import { TechProductService } from '../../services/products.service';

@Component({
  selector: 'app-catalog-page',
  imports: [SearchInput, RouterLink],
  templateUrl: './catalog-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage {
  isLoading = signal(true)
  techProductsService = inject(TechProductService)
  constructor() {
    this.techProductsService.showAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false)

        console.log(this.products());
      }
    })
  }
  buscarResultados(queryUser: string) {
    console.log(queryUser)
    this.isLoading.set(true)
    this.query.set(queryUser)

    this.techProductsService.searchProductByName(this.query()).subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false)
      },
      error: (err) => {
        this.isLoading.set(false)
        this.products.set(null)
      }
    })



  }
  query = signal('')
  products = signal<TechProductsResponse[] | null>([])
}
