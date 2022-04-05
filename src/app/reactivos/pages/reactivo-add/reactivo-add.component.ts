import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMarcaRead } from 'src/app/marcas/models/interface';
import { ITipoEnvaseRead } from 'src/app/tipo-envase/models/interface';
import { IUbicacionRead } from 'src/app/ubicaciones/models/interface';
import { IUnidadMedidaRead } from 'src/app/unidades-medida/models/interface';
import { Subscription } from 'rxjs';
import { ReactivoService } from '../../services/reactivo.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { UnidadMedidaService } from 'src/app/unidades-medida/services/unidad-medida.service';
import { MarcaService } from 'src/app/marcas/services/marca.service';
import { UbicacionService } from 'src/app/ubicaciones/services/ubicacion.service';
import { TipoEnvaseService } from 'src/app/tipo-envase/services/tipo-envase.service';
import { ClasificacionEnum, EstadoFisicoEnum } from 'src/app/common/enums';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';
import { IReactivoCreate } from '../../models/interface';
import { ISkuSmCreate } from 'src/app/skus/models/interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reactivo-add',
  templateUrl: './reactivo-add.component.html',
  styleUrls: ['./reactivo-add.component.scss']
})
export class ReactivoAddComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public unidadesMedida: IUnidadMedidaRead[] = [];
  public marcas: IMarcaRead[] = [];
  public ubicaciones: IUbicacionRead[] = [];
  public tiposEnvase: ITipoEnvaseRead[] = [];
  public clasificaciones: { valor: string, text: string }[] = [];
  public estadosFisicos: { valor: string, text: string }[] = [];
  public isLoading = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private reactivoService: ReactivoService,
    private swas: SweetAlertService,
    private unidadMedidaService: UnidadMedidaService,
    private marcaService: MarcaService,
    private ubicacionService: UbicacionService,
    private tipoEnvaseService: TipoEnvaseService,
  ) {
    this.createForm();
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
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.swas.showLoading('Espere', 'Registrando....');
      const body = this.getRequestObject();
      this.subscription.add(this.reactivoService.createOne(body).subscribe(data => {
        this.isLoading = false;
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Ok', 'Se registró correctamente el reactivo', 'success');
        this.form.reset();
      }, (e: HttpErrorResponse) => {
        this.isLoading = false;
        this.swas.hideLoading();
        if (e && e.status === 400) {
          this.swas.showAlertGeneric('Error', 'Bad request', 'error');
          return;
        }
        if (e && e.status === 500) {
          this.swas.showAlertGeneric('Error', 'Algo salió mal, no se pudo registrar', 'error');
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

  public get skus(): FormArray {
    return this.form.get('skus') as FormArray;
  }

  public isSkuValorValid(i: number): boolean {
    const groupdAtIndex = this.skus.at(i) as FormGroup;
    const urlField = groupdAtIndex.get('valor');
    if (urlField) {
      return urlField.invalid && (urlField.touched || urlField.dirty);
    }
    return false;
  }

  public isSkuDescripcionValid(i: number): boolean {
    const groupdAtIndex = this.skus.at(i) as FormGroup;
    const urlField = groupdAtIndex.get('descripcion');
    if (urlField) {
      return urlField.invalid && (urlField.touched || urlField.dirty);
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

  public getErrorMessageFromArray(formControlName: string, i: number): string {
    const formGroup = this.skus.at(i);
    const formControl = formGroup.get(formControlName);
    if (formControl && formControl.errors) {
      const error = Object.keys(formControl.errors);
      return getErrorMessage(error[0], formControl.errors);
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
      skus: this.fb.array([]),
    }); 
    const skuItem = this.fb.group({
      valor: ['', [
        Validators.required
      ]],
      descripcion: ['', [
        Validators.required
      ]]
    });
    this.skus.push(skuItem);
  }

  addSkuItem(): void {
    const skuItem = this.fb.group({
      valor: ['', [
        Validators.required
      ]],
      descripcion: ['', [
        Validators.required
      ]]
    });
    this.skus.push(skuItem);
  }

  deleteSkuItem(index: number): void {
    this.skus.removeAt(index);
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getRequestObject(): IReactivoCreate {
    const skus = this.skus.controls.map(group => {
      const formGroup = group as FormGroup;
      const skuItem: ISkuSmCreate = {
        valor: formGroup.value.valor,
        desripcion: formGroup.value.descripcion
      };
      return skuItem;
    });
    const mat: IReactivoCreate = {
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
      skus
    }
    return mat;
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

}
