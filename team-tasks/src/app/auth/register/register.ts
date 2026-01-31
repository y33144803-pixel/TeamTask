import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, name } = this.registerForm.value;
      this.error = null;
      this.loading = true;

      this.authService.register({email, password, name}).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/teams']);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 0) {
            this.error = 'אין תקשורת עם שרת המערכת. ודא שהשרת פועל!';
          } else if (err.error?.message) {
            this.error = err.error.message;
          } else if (err.message) {
            this.error = err.message;
          } else {
            this.error = "שגיאת הרשמה";
          }
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(ctrl => ctrl.markAsTouched());
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}