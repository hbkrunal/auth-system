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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface IAuthSignupForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  readonly signupForm = new FormGroup<IAuthSignupForm>({
    firstName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}'),
      ],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
  });

  submit() {
    if (this.signupForm.valid) {
      const { firstName, lastName, email, password } =
        this.signupForm.getRawValue();
      this.authService
        .signup({
          email,
          firstName,
          lastName,
          password,
        })
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
