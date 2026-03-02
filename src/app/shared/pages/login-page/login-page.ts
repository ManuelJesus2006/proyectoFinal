import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../products/interface/user.interface';
import { AuthService } from '../../../products/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule,RouterLink],
  templateUrl: './login-page.html',
})
export class LoginPage {
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
  password = '';
  email = '';
  private router = inject(Router)
  iniciarSesion() {
    this.exito.set(null)
    this.isLoading.set(true)
    this.authService.login(this.email, this.password).subscribe({
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
