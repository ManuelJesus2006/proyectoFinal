import { ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SearchInput } from "../../components/search-input/search-input";
import { TechProductsResponse } from '../../interface/techProducts.interface';
import { TechProductService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog-page',
  imports: [SearchInput, RouterLink, FormsModule],
  templateUrl: './catalog-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage {
  private router = inject(Router);

  isMenuOpen = signal(false);
  
  userName = signal<string>(this.getUserFromStorage());

  private getUserFromStorage(): string {
    const session = localStorage.getItem('session_active');
    const user = JSON.parse(session!); 
    return user.name;
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  cerrarSesion() {
    localStorage.removeItem('session_active');
    this.router.navigate(['/login']);
  }
  isLoading = signal(true)
  isGridView = signal(true)
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
