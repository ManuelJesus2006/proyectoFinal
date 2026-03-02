import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
    const router = inject(Router);
    const isAuthenticated = !!localStorage.getItem('session_active');

    return isAuthenticated ? true : router.parseUrl('/login');
};