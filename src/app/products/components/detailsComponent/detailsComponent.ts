import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { TechProductsResponse } from '../../interface/techProducts.interface';
import { TechProductService } from '../../services/products.service';
import { KeyValuePipe } from '@angular/common';


@Component({
  selector: 'app-details-component',
  imports: [KeyValuePipe],
  templateUrl: './detailsComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent { 
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
