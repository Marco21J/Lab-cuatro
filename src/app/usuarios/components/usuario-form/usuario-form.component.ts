import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { IRolRead } from 'src/app/roles/models/interface';
import { StatusEnum } from '../../../common/enums/status.enum';
import { RolService } from '../../../roles/services/rol.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getErrorMessage } from '../../../common/security/validation-message/validation-message';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuarioCreate } from '../../models/interface';
import { IFullUsuarioRead } from '../../models/interface';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  public status = [
    { value: StatusEnum.ACTIVO, text: 'Activo' },
    { value: StatusEnum.INACTIVO, text: 'Inactivo' }
  ];
  public roles: IRolRead[] = [];
  public form!:FormGroup;
  public isLoading = false;
  private subscription = new Subscription();

  constructor(
    private rolService: RolService,
    private fb: FormBuilder,
    private swas: SweetAlertService,
    private userService: UsuarioService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.subscription.add(this.rolService.getRoles().subscribe(data => {
       this.roles = data;
    }));
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.createOne();
    } else {
      this.swas.showAlertGeneric('Error', 'El formulario no es válido', 'error');
    }
  }

  private createOne(): void {
    this.isLoading = true;
      this.swas.showLoading('Espere', 'Registrando...');
      const body = this.getRequestObject();
      this.subscription.add(this.userService.createOne(body).subscribe(data => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Ok', 'El usuario e registró correctamente', 'success');
        this.isLoading = false;
        this.resetForm();
      }, (e) => {
        this.swas.hideLoading();
        this.isLoading = false;
        this.swas.showAlertGeneric('Error', 'Algo salió mal, intenta más tarde', 'error');
      }));
  }

  //#region Form Region

  public get isNombreValid(): boolean {
    const field = this.form.get('nombre');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isApellidoPaternoValid(): boolean {
    const field = this.form.get('apellidoPaterno');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isApellidoMaternoValid(): boolean {
    const field = this.form.get('apellidoMaterno');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isEmailValid(): boolean {
    const field = this.form.get('email');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isContrasenaValid(): boolean {
    const field = this.form.get('contrasena');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isStatusValid(): boolean {
    const field = this.form.get('status');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isRolValid(): boolean {
    const field = this.form.get('rol');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control && control.errors) {
      const error = Object.keys(control.errors);
      return getErrorMessage(error[0], control.errors);
    }
    return '';
  }

  private createForm(): void {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
      ]],
      apellidoPaterno: ['', [
        Validators.required,
      ]],
      apellidoMaterno: ['', [
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      status: ['', [
        Validators.required
      ]],
      rol: ['', [
        Validators.required
      ]]
    });
  }

  private resetForm(): void {
    this.form.reset();
  }

  //#endregion

  private getRequestObject(): IUsuarioCreate {
    const user: IUsuarioCreate = {
      nombre: this.form.value.nombre,
      apellidoPaterno: this.form.value.apellidoPaterno,
      apellidoMaterno: this.form.value.apellidoMaterno,
      email: this.form.value.email,
      contrasena: this.form.value.contrasena,
      rol: {
        id: this.form.value.rol,
      },
      status: this.form.value.rol,
    };
    user.rol.id = parseInt(user.rol.id.toString());
    user.status = parseInt(user.status.toString());
    return user;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
