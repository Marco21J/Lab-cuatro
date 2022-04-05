import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMarcaRead } from 'src/app/marcas/models/interface';
import { ITipoEnvaseRead } from 'src/app/tipo-envase/models/interface';
import { IUbicacionRead } from 'src/app/ubicaciones/models/interface';
import { IUnidadMedidaRead } from 'src/app/unidades-medida/models/interface';
import { Subscription } from 'rxjs';
import { IReactivoEdit, IReactivoRead } from '../../models/interface';
import { ReactivoService } from '../../services/reactivo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { UnidadMedidaService } from '../../../unidades-medida/services/unidad-medida.service';
import { TipoEnvaseService } from '../../../tipo-envase/services/tipo-envase.service';
import { UbicacionService } from '../../../ubicaciones/services/ubicacion.service';
import { MarcaService } from '../../../marcas/services/marca.service';
import { ClasificacionEnum, EstadoFisicoEnum } from 'src/app/common/enums';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reactivo-edit',
  templateUrl: './reactivo-edit.component.html',
  styleUrls: ['./reactivo-edit.component.scss']
})
export class ReactivoEditComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public unidadesMedida: IUnidadMedidaRead[] = [];
  public marcas: IMarcaRead[] = [];
  public ubicaciones: IUbicacionRead[] = [];
  public tiposEnvase: ITipoEnvaseRead[] = [];
  public clasificaciones: { valor: string, text: string }[] = [];
  public estadosFisicos: { valor: string, text: string }[] = [];
  public reactivo!: IReactivoRead;
  public isLoading = false;
  private subscription = new Subscription();
  private id: string;

  constructor(
    private reactivoService: ReactivoService,
    private route: ActivatedRoute,
    private swas: SweetAlertService,
    private fb: FormBuilder,
    private unidadMedidaService: UnidadMedidaService,
    private marcaService: MarcaService,
    private ubicacionService: UbicacionService,
    private tipoEnvaseService: TipoEnvaseService,
    private router: Router,
  ) {
    this.createForm();
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id ? id : '';
    this.clasificaciones = [
      {
        valor: ClasificacionEnum.A,
        text: 'A' 
      },
      {
        valor: ClasificacionEnum.B,
        text: 'B' 
      },
      {
        valor: ClasificacionEnum.C,
        text: 'C' 
      },
    ];
    this.estadosFisicos = [
      { valor: EstadoFisicoEnum.LIQUIDO, text: 'Líquido' },
      { valor: EstadoFisicoEnum.SOLIDO, text: 'Sólido' }
    ];
  }

  ngOnInit(): void {
    this.getUnidadesMedida();
    this.getMarcas();
    this.getUbicaciones();
    this.getTiposEnvase();
    this.getMaterialById();
  }

  private getMaterialById(): void {
    this.subscription.add(this.reactivoService.getOneById(this.id).subscribe(data => {
      this.reactivo = data;
      this.ubicaciones.push(data.ubicacion);
      this.setValues(data);
    }, (e) => {
      this.router.navigateByUrl('/dashboard/reactivos');
    }));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.swas.showLoading('Espere', 'Registrando....');
      const body = this.getRequestObject();
      this.subscription.add(this.reactivoService.updateOne(this.id, body).subscribe(data => {
        this.isLoading = false;
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Ok', 'Se guardaron los cambios', 'success');
      }, (e: HttpErrorResponse) => {
        this.isLoading = false;
        this.swas.hideLoading();
        if (e && e.status === 400) {
          this.swas.showAlertGeneric('Error', 'Bad request', 'error');
          return;
        }
        if (e && e.status === 500) {
          this.swas.showAlertGeneric('Error', 'Algo salió mal, no se pudo guardar', 'error');
          return;
        }
      }));
    } else {
      this.swas.showAlertGeneric('Error', 'El formulario no es válido', 'error');
    }
  }

  //#region Form Region

  public get isNombreValid(): boolean {
    const field = this.form.get('nombre');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isDescripcionValid(): boolean {
    const field = this.form.get('descripcion');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isStockValid(): boolean {
    const field = this.form.get('stock');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isCantidadValid(): boolean {
    const field = this.form.get('cantidad');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isEstadoFisicoValid(): boolean {
    const field = this.form.get('estadoFisico');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isClasificacionValid(): boolean {
    const field = this.form.get('clasificacion');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isFechaIngresoValid(): boolean {
    const field = this.form.get('fechaIngreso');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isHojaSeguridadValid(): boolean {
    const field = this.form.get('fechaIngreso');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isUnidadMedidaValid(): boolean {
    const field = this.form.get('unidadMedida');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isMarcaValid(): boolean {
    const field = this.form.get('marca');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isTipoEnvaseValid(): boolean {
    const field = this.form.get('tipoEnvase');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isUbicacionValid(): boolean {
    const field = this.form.get('ubicacion');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
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
        Validators.required
      ]],
      descripcion: ['', [
        Validators.required
      ]],
      stock: ['', [
        Validators.required
      ]],
      cantidad: ['', [
        Validators.required
      ]],
      estadoFisico: ['', [
        Validators.required
      ]],
      clasificacion: ['', [
        Validators.required
      ]],
      fechaIngreso: ['', [
        Validators.required
      ]],
      hojaSeguridad: [false, [
        Validators.required
      ]],
      unidadMedida: ['', [
        Validators.required
      ]],
      marca: ['', [
        Validators.required
      ]],
      tipoEnvase: ['', [
        Validators.required
      ]],
      ubicacion: ['', [
        Validators.required
      ]],
    }); 
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //#region Get Foreign Keys

  private getUnidadesMedida(): void {
    this.subscription.add(this.unidadMedidaService.getAll().subscribe(data => {
      this.unidadesMedida = data;
    }));
  }

  private getMarcas(): void {
    this.subscription.add(this.marcaService.getAll().subscribe(data => {
      this.marcas = data;
    }));
  }

  private getUbicaciones(): void {
    this.subscription.add(this.ubicacionService.getAll().subscribe(data => {
      this.ubicaciones = data;
    }));
  }

  private getTiposEnvase(): void {
    this.subscription.add(this.tipoEnvaseService.getAll().subscribe(data => {
      this.tiposEnvase = data;
    }));
  }

  //#endregion

  private setValues(material: IReactivoRead): void {
    this.form.get('nombre')?.setValue(material.nombre);
    this.form.get('descripcion')?.setValue(material.desripcion);
    this.form.get('stock')?.setValue(material.stock);
    this.form.get('cantidad')?.setValue(material.cantidad);
    this.form.get('estadoFisico')?.setValue(material.estadoFisico);
    this.form.get('clasificacion')?.setValue(material.clasificacion);
    this.form.get('fechaIngreso')?.setValue(material.fechaIngreso);
    this.form.get('hojaSeguridad')?.setValue(material.hojaSeguridad);
    this.form.get('unidadMedida')?.setValue(material.unidadMedida.id);
    this.form.get('marca')?.setValue(material.marca.id);
    this.form.get('tipoEnvase')?.setValue(material.tipoEnvase.id);
    this.form.get('ubicacion')?.setValue(material.ubicacion.id);
  }

  private getRequestObject(): IReactivoEdit {
    const mat: IReactivoEdit = {
      nombre: this.form.value.nombre,
      desripcion: this.form.value.descripcion,
      stock: parseInt(this.form.value.stock),
      cantidad: parseInt(this.form.value.cantidad),
      estadoFisico: this.form.value.estadoFisico,
      clasificacion: this.form.value.clasificacion,
      fechaIngreso: this.form.value.fechaIngreso,
      hojaSeguridad: this.form.value.hojaSeguridad,
      status: 1,
      unidadMedida: {
        id: this.form.value.unidadMedida,
      },
      marca: {
        id: this.form.value.marca,
      },
      tipoEnvase: {
        id: parseInt(this.form.value.tipoEnvase)
      },
      ubicacion: {
        id: this.form.value.ubicacion,
      },
    }
    return mat;
  }

}
