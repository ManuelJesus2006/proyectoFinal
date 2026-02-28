import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { TechProductsResponse } from '../../interface/techProducts.interface';
import { TechProductService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-price-component',
  imports: [CurrencyPipe],
  templateUrl: './priceComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceComponent {
  techProductsService = inject(TechProductService)
  id = input.required<number>()
  product = signal<TechProductsResponse | null>(null)
  constructor(){
    
    effect(() => {
      this.product.set(null);
      console.log(this.id())
      this.techProductsService.searchProductById(this.id())
        .subscribe((data) => this.product.set(data));
        
    });
  }
}
