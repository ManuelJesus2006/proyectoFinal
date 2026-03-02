import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../products/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule,RouterLink],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  constructor(){
    // Comprobamos si existe la sesión en el storage
    const session = localStorage.getItem('session_active');
    
    if (session) {
      // Si ya hay sesión, lo mandamos directo al catálogo
      this.router.navigate(['/catalog']);
    }
  }
  authService = inject(AuthService)
  exito = signal<boolean | null>(null);
  isLoading = signal(false);
  name = '';
  password = '';
  email = '';
  private router = inject(Router)
  registrarUsuario() {
    this.exito.set(null)
    this.isLoading.set(true)
    this.authService.register(this.name,this.email, this.password).subscribe({
      next: (userLogued) => {
        localStorage.setItem('session_active', JSON.stringify(userLogued));
        this.authService.isLoggedIn.set(true);
        this.exito.set(true);
        this.isLoading.set(false)
        this.router.navigate(['/catalog']);
      },
      error: (e) => {
        this.exito.set(false);
        this.isLoading.set(false);
      }
    })
  }
}
