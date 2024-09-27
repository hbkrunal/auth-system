import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../store/auth.service';
import { IAuthLoginPayload } from '../../store/auth.inerface';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface IAuthLoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'aa-login',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  readonly loginForm = new FormGroup<IAuthLoginForm>({
    email: new FormControl('test@gmail.com', {
      validators: [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}'),
      ],
      nonNullable: true,
    }),
    password: new FormControl('12345678', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
  });

  submit() {
    const { email, password } = this.loginForm.value;
    if (email && password) {
      const payload: IAuthLoginPayload = { email, password };
      this.authService
        .login(payload)
        .pipe(take(1))
        .subscribe({
          next: (user) => {
            if (user) {
              this.router.navigate(['/home']);
            }
          },
          error: (error: HttpErrorResponse) => {
            const message = error?.error?.message || 'something went wrong';
            this._snackBar.open(message);
          },
        });
    }
  }
}
