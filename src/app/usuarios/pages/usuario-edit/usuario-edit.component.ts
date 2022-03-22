import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuarioEdit, IUsuarioRead } from '../../models/interface';
import { RolService } from '../../../roles/services/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';
import { StatusEnum } from '../../../common/enums/status.enum';
import { IRolRead } from '../../../roles/models/interface/rol-read.interface';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.scss']
})
export class UsuarioEditComponent implements OnDestroy, OnInit {

  public id: string;
  public user!: IUsuarioRead;
  public form!: FormGroup;
  public isLoading = false;
  public status = [
    { value: StatusEnum.ACTIVO, text: 'Activo' },
    { value: StatusEnum.INACTIVO, text: 'Inactivo' }
  ];
  public roles: IRolRead[] = [];
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private userService: UsuarioService,
    private router: Router,
    private rolService: RolService,
    private fb: FormBuilder,
    private swas: SweetAlertService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id ? id : '';
    this.createForm();
  }

  ngOnInit(): void {
    this.subscription.add(this.userService.getUserById(this.id).subscribe(data => {
      this.user = data;
      this.setValues();
    }, () => {
      this.router.navigateByUrl('/dashboard/usuarios');
    }));
    this.subscription.add(this.rolService.getRoles().subscribe(data => {
      this.roles = data;
   }));
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.editOne();
    } else {
      this.swas.showAlertGeneric('Error', 'El formulario no es válido', 'error');
    }
  }

  private editOne(): void {
    this.isLoading = true;
      this.swas.showLoading('Espere', 'Actualizando...');
      const body = this.getRequestObject();
      this.subscription.add(this.userService.editOne(this.id, body).subscribe(data => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Ok', 'El usuario se actualizó correctamente', 'success');
        this.isLoading = false;
      }, (e) => {
        this.swas.hideLoading();
        this.isLoading = false;
        this.swas.showAlertGeneric('Error', 'Algo salió mal, intenta más tarde', 'error');
      }));
  }


  //#region Form
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
      status: ['', [
        Validators.required
      ]],
      rol: ['', [
        Validators.required
      ]]
    });
  }

  private setValues(): void {
    this.form.get('nombre')?.setValue(this.user.nombre);
    this.form.get('apellidoPaterno')?.setValue(this.user.apellidoPaterno);
    this.form.get('apellidoMaterno')?.setValue(this.user.apellidoMaterno);
    this.form.get('email')?.setValue(this.user.email);
    this.form.get('status')?.setValue(this.user.status);
    this.form.get('rol')?.setValue(this.user.rol.id);
  }
  //#endregion

  private getRequestObject(): IUsuarioEdit {
    const user: IUsuarioEdit = {
      nombre: this.form.value.nombre,
      apellidoPaterno: this.form.value.apellidoPaterno,
      apellidoMaterno: this.form.value.apellidoMaterno,
      email: this.form.value.email,
      rol: {
        id: parseInt(this.form.value.rol),
      },
      status: parseInt(this.form.value.status),
    };
    return user;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
