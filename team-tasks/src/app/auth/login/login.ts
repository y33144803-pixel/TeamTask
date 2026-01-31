import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading: boolean = false; // <--- משתנה לטיפול ב"טוען..."

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.error = null;
      this.loading = true;  // הפעל טוען

      this.authService.login({email, password}).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/teams']);
        },
        error: (err) => {
          this.loading = false; // כבה טוען בכל מקרה
          if (err.status === 401) {
            this.error = 'אימייל או סיסמה אינם נכונים';
          } else if (err.status === 0) {
            this.error = 'אין תקשורת עם שרת המערכת. ודא שהשרת פועל!';
          } else if (err.error?.message) {
            this.error = err.error.message;
          } else if (err.message) {
            this.error = err.message;
          } else {
            this.error = 'שגיאת התחברות. נסה שנית.';
          }
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(ctrl => ctrl.markAsTouched());
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}