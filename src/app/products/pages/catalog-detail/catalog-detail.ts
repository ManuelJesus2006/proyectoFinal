import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { TechProductsResponse } from '../../interface/techProducts.interface';
import { TechProductService } from '../../services/products.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-catalog-detail',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './catalog-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogDetail { 
  techProductsService = inject(TechProductService)
  id = input.required<number>()
  product = signal<TechProductsResponse | null>(null)
  constructor(){
    
    effect(() => {
      console.log(this.id())
      this.techProductsService.searchProductById(this.id())
        .subscribe((data) => this.product.set(data));
        
    });
  }
}
