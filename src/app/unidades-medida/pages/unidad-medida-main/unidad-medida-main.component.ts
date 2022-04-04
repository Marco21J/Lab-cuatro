import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { IUnidadMedidaRead } from '../../models/interface';
import { DataTableDirective } from 'angular-datatables';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';

@Component({
  selector: 'app-unidad-medida-main',
  templateUrl: './unidad-medida-main.component.html',
  styleUrls: ['./unidad-medida-main.component.scss']
})
export class UnidadMedidaMainComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public unidadesMedida: IUnidadMedidaRead[] = [];
  public dtOptions!: DataTables.Settings;
  public isEditing = false;
  public isLoading = false;
  private subscription = new Subscription();
  private unidadMedidaId!: string;
  @ViewChild(DataTableDirective, { static: false })
  private dtElement!: DataTableDirective;

  constructor(
    private unidadMedidaService: UnidadMedidaService,
    private swas: SweetAlertService,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      lengthMenu: [5, 10, 20, 50, 100],
      searchDelay: 1500,
      ajax: (dataTablesParameters: any, callback) => {
        const { length, start, search } = dataTablesParameters;
        const { value } = search;
        that.subscription.add(that.unidadMedidaService.getAllPaginated(start, length, value).subscribe(data => {
          this.unidadesMedida = data.data;
          callback({
            recordsTotal: data.count,
            recordsFiltered: data.filteredCount,
            data: data.data
          });
        }));
      },
      columns: [
        { data: `nombre` },
        { data: 'descripcion' },
      ],
      responsive: true,
      ordering: false,
      language: {
        emptyTable: 'No hay datos',
        infoFiltered: '(filtrado de un total de _MAX_ registros)',
        search: 'Buscar por nombre',
        lengthMenu: 'Mostrar _MENU_ datos por página',
        loadingRecords: 'Cargando...',
        info: 'Página _PAGE_ de _PAGES_',
        paginate: {
          first: 'Inicio',
          last: 'Fin',
          next: 'Siguiente',
          previous: 'Atrás'
        }
      }
    };
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
    const { nombre, descripcion } = this.form.value;
    this.subscription.add(this.unidadMedidaService.createOne({ nombre, descripcion }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.reloadAjaxDataTable();
      this.form.reset();
      this.swas.showAlertGeneric('Ok', 'Se registró correctamente la unidad de medida', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo registrar la unidad de medida', 'error');
    }));
  }

  onEdit(unidadMedida: IUnidadMedidaRead): void {
    this.isEditing = true;
    this.setValues(unidadMedida);
  }

  private editOne(): void {
    this.isLoading = true;
    this.swas.showLoading('Espere', 'Guardando...');
    const { nombre, descripcion } = this.form.value;
    this.subscription.add(this.unidadMedidaService.updateOne(this.unidadMedidaId, { nombre, descripcion }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.unidadesMedida.forEach(um => {
        if (um.id === this.unidadMedidaId) {
          um.nombre = nombre;
          um.descripcion = descripcion;
          return;
        }
      });
      this.swas.showAlertGeneric('Ok', 'Se guardaron los cambios', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo editar la unidad de medida', 'error');
    }));
  }

  public async delete(id: string): Promise<void> {
    const sure = await this.swas.showConfirmDialog('¿Está seguro?', 'Esta acción no se puede deshacer', 'question', 'Eliminar');
    if (sure.isConfirmed) {
      this.swas.showLoading('Espere', 'Eliminando...');
      this.subscription.add(this.unidadMedidaService.deleteOne(id).subscribe(data => {
        this.swas.hideLoading();
        this.reloadAjaxDataTable();
        this.swas.showAlertGeneric('Ok', 'Se eliminó correctamente', 'success');
      }, (e) => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Error', 'Algo salío mal al intentar eliminar, intenta más tarde', 'error');
      }));
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

  public getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
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
      descripcion: ['', [
        Validators.required
      ]]
    });
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private reloadAjaxDataTable(): void {
    this.dtElement.dtInstance.then(d => {
      d.ajax.reload();
    });
  }

  private setValues(unidadMedida: IUnidadMedidaRead): void {
    this.form.get('nombre')?.setValue(unidadMedida.nombre);
    this.form.get('descripcion')?.setValue(unidadMedida.descripcion ? unidadMedida.descripcion : '');
    this.unidadMedidaId = unidadMedida.id;
  }

}
