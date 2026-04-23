import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { LoginService } from '../service/login.service';
import { LoginRequest } from '../model/loginRequest';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // 🔥 FALTABA ESTO
  imports: [
    CommonModule,           // 🔥 ngIf, ngClass
    ReactiveFormsModule,    // 🔥 formGroup
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit  {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  loginError: string = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Navegar directamente a mfMonitoreo sin validación
    this.router.navigate(['/mfMonitoreo']);
    this.loginForm.reset();
  }
}