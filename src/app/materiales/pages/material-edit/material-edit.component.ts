import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUnidadMedidaRead } from 'src/app/unidades-medida/models/interface';
import { IMarcaRead } from 'src/app/marcas/models/interface';
import { ITipoMaterialRead } from 'src/app/tipo-material/models/interface';
import { IUbicacionRead } from 'src/app/ubicaciones/models/interface';
import { ClasificacionEnum } from 'src/app/common/enums';
import { UnidadMedidaService } from 'src/app/unidades-medida/services/unidad-medida.service';
import { MarcaService } from 'src/app/marcas/services/marca.service';
import { UbicacionService } from 'src/app/ubicaciones/services/ubicacion.service';
import { TipoMaterialService } from 'src/app/tipo-material/services/tipo-material.service';
import { IMaterialEdit, IMaterialRead } from '../../models/interface';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public unidadesMedida: IUnidadMedidaRead[] = [];
  public marcas: IMarcaRead[] = [];
  public ubicaciones: IUbicacionRead[] = [];
  public tiposMaterial: ITipoMaterialRead[] = [];
  public clasificaciones: { valor: string, text: string }[] = [];
  public material!: IMaterialRead;
  public isLoading = false;
  private subscription = new Subscription();
  private id: string;

  constructor(
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private swas: SweetAlertService,
    private fb: FormBuilder,
    private unidadMedidaService: UnidadMedidaService,
    private marcaService: MarcaService,
    private ubicacionService: UbicacionService,
    private tipoMaterialService: TipoMaterialService,
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
  }

  ngOnInit(): void {
    this.getUnidadesMedida();
    this.getMarcas();
    this.getUbicaciones();
    this.getTiposMaterial();
    this.getMaterialById();
  }

  private getMaterialById(): void {
    this.subscription.add(this.materialService.getOneById(this.id).subscribe(data => {
      this.material = data;
      this.ubicaciones.push(data.ubicacion);
      this.setValues(data);
    }, (e) => {
      this.router.navigateByUrl('/dashboard/materiales');
    }));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.swas.showLoading('Espere', 'Registrando....');
      const body = this.getRequestObject();
      this.subscription.add(this.materialService.updateOne(this.id, body).subscribe(data => {
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

  //#region Form region

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

  public get isCapacidadTamanioValid(): boolean {
    const field = this.form.get('capacidadTamanio');
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

  public get isTipoMaterialValid(): boolean {
    const field = this.form.get('tipoMaterial');
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
      capacidadTamanio: ['', [
        Validators.required
      ]],
      cantidad: ['', [
        Validators.required
      ]],
      clasificacion: ['', [
        Validators.required
      ]],
      fechaIngreso: ['', [
        Validators.required
      ]],
      unidadMedida: ['', [
        Validators.required
      ]],
      marca: ['', [
        Validators.required
      ]],
      tipoMaterial: ['', [
        Validators.required
      ]],
      ubicacion: ['', [
        Validators.required
      ]],
    }); 
  }

  private setValues(material: IMaterialRead): void {
    this.form.get('nombre')?.setValue(material.nombre);
    this.form.get('descripcion')?.setValue(material.desripcion);
    this.form.get('capacidadTamanio')?.setValue(material.capacidadTamanio);
    this.form.get('cantidad')?.setValue(material.cantidad);
    this.form.get('clasificacion')?.setValue(material.clasificacion);
    this.form.get('fechaIngreso')?.setValue(material.fechaIngreso);
    this.form.get('unidadMedida')?.setValue(material.unidadMedida.id);
    this.form.get('marca')?.setValue(material.marca.id);
    this.form.get('tipoMaterial')?.setValue(material.tipoMaterial.id);
    this.form.get('ubicacion')?.setValue(material.ubicacion.id);
  }

  //#endregion

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

  private getTiposMaterial(): void {
    this.subscription.add(this.tipoMaterialService.getAll().subscribe(data => {
      this.tiposMaterial = data;
    }));
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getRequestObject(): IMaterialEdit {
    const mat: IMaterialEdit = {
      nombre: this.form.value.nombre,
      desripcion: this.form.value.descripcion,
      capacidadTamanio: this.form.value.capacidadTamanio,
      cantidad: parseInt(this.form.value.cantidad),
      clasificacion: this.form.value.clasificacion,
      fechaIngreso: this.form.value.fechaIngreso,
      status: 1,
      unidadMedida: {
        id: this.form.value.unidadMedida,
      },
      marca: {
        id: this.form.value.marca,
      },
      tipoMaterial: {
        id: parseInt(this.form.value.tipoMaterial)
      },
      ubicacion: {
        id: this.form.value.ubicacion,
      },
    }
    return mat;
  }

}
