import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISkuCreate, ISkuRead } from 'src/app/skus/models/interface';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SkuService } from '../../../skus/services/sku.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';

@Component({
  selector: 'app-material-skus',
  templateUrl: './material-skus.component.html',
  styleUrls: ['./material-skus.component.scss']
})
export class MaterialSkusComponent implements OnDestroy {

  public form!: FormGroup;
  public isEditing = false;
  public isLoading = false;
  public skuId!: number;
  private currentSkuIndex!: number;
  @Input() skus: ISkuRead[] = [];
  @Input() idMaterial!: string;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private skuService: SkuService,
    private swas: SweetAlertService,
  ) {
    this.createForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditing) {
        this.editOne();
      } else {
        this.createOne();
      }
    } else {
      this.swas.showAlertGeneric('Error', 'El formulario no es válido', 'error');
    }
  }

  onRegister(): void {
    this.isEditing = false;
    this.form.reset();
  }

  private createOne(): void {
    this.isLoading = true;
    this.swas.showLoading('Espere', 'Registrando...');
    const { valor, descripcion } = this.form.value;
    const body: ISkuCreate = {
      valor,
      desripcion: descripcion,
      material: {
        id: this.idMaterial,
      }
    };
    this.subscription.add(this.skuService.createOne(body).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.form.reset();
      this.skus.push(data);
      this.swas.showAlertGeneric('Ok', 'Se registró correctamente el sku', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo registrar el sku', 'error');
    }));
  }

  onEdit(sku: ISkuRead, index: number): void {
    this.isEditing = true;
    this.currentSkuIndex = index;
    this.setValues(sku);
  }

  private editOne(): void {
    this.isLoading = true;
    this.swas.showLoading('Espere', 'Guardando...');
    const { valor, descripcion } = this.form.value;
    this.subscription.add(this.skuService.updateOne(this.skuId, { valor, desripcion: descripcion }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.skus[this.currentSkuIndex].desripcion = data.desripcion;
      this.skus[this.currentSkuIndex].valor = data.valor;
      this.swas.showAlertGeneric('Ok', 'Se guardaron los cambios', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo editar el sku', 'error');
    }));
  }

  public async delete(id: number): Promise<void> {
    const sure = await this.swas.showConfirmDialog('¿Está seguro?', 'Esta acción no se puede deshacer', 'question', 'Eliminar');
    if (sure.isConfirmed) {
      this.swas.showLoading('Espere', 'Eliminando...');
      this.subscription.add(this.skuService.deleteOne(id).subscribe(data => {
        this.swas.hideLoading();
        this.skus = this.skus.filter(s => s.id != id);
        this.swas.showAlertGeneric('Ok', 'Se eliminó correctamente', 'success');
      }, (e) => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Error', 'Algo salío mal al intentar eliminar, intenta más tarde', 'error');
      }));
    }
  }

  //#region Form region

  public get isValorValid(): boolean {
    const field = this.form.get('valor');
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
      valor: ['', [
        Validators.required
      ]],
      descripcion: ['', [
        Validators.required
      ]]
    });
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setValues(sku: ISkuRead): void {
    this.form.get('valor')?.setValue(sku.valor);
    this.form.get('descripcion')?.setValue(sku.desripcion);
    this.skuId = sku.id;
  }

}
