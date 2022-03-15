import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  public form: FormGroup;
  public isLoading = false;
  private subscription = new Subscription();

  constructor(
      private readonly authService: AuthService,
      private readonly fb: FormBuilder,
      private readonly router: Router,
      private readonly swas: SweetAlertService,
    ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const { email, contrasena } = this.form.value;
      this.subscription.add(this.authService.login({ email, contrasena }).subscribe(data => {
        this.isLoading = false;
        console.log(data);
        this.router.navigateByUrl('/dashboard');
      }, (e: HttpErrorResponse) => {
        this.isLoading = false;
        if (e.status === 401) {
          this.swas.showAlertGeneric('Error', 'Correo o contraseña incorrectos', 'error');
        } else {
          this.swas.showAlertGeneric('Error', 'Algo salió mal, intenta más tarde', 'error');
        }
      }));
    } else {
      // do smthnnsd
      this.swas.showAlertGeneric('Error', 'Formulario inválido', 'error');
    }
  }

}
