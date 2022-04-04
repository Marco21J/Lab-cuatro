import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUbicacionRead } from '../../models/interface';
import { UbicacionService } from '../../services/ubicacion.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';

@Component({
  selector: 'app-ubicacion-main',
  templateUrl: './ubicacion-main.component.html',
  styleUrls: ['./ubicacion-main.component.scss']
})
export class UbicacionMainComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public ubicaciones: IUbicacionRead[] = [];
  public dtOptions!: DataTables.Settings;
  public isEditing = false;
  public isLoading = false;
  private subscription = new Subscription();
  private ubcacionId!: string;
  @ViewChild(DataTableDirective, { static: false })
  private dtElement!: DataTableDirective;

  constructor(
    private ubicacionService: UbicacionService,
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
        that.subscription.add(that.ubicacionService.getAllPaginated(start, length, value).subscribe(data => {
          this.ubicaciones = data.data;
          callback({
            recordsTotal: data.count,
            recordsFiltered: data.filteredCount,
            data: data.data
          });
        }));
      },
      columns: [
        { data: `anaquel` },
        { data: 'nivel' },
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
    let { anaquel, nivel } = this.form.value;
    anaquel = parseInt(anaquel);
    nivel = parseInt(nivel);
    this.subscription.add(this.ubicacionService.createOne({ anaquel, nivel }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.reloadAjaxDataTable();
      this.form.reset();
      this.swas.showAlertGeneric('Ok', 'Se registró correctamente la ubicación', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo registrar la ubicación', 'error');
    }));
  }

  onEdit(ubicacion: IUbicacionRead): void {
    this.isEditing = true;
    this.setValues(ubicacion);
  }

  private editOne(): void {
    this.isLoading = true;
    this.swas.showLoading('Espere', 'Guardando...');
    let { anaquel, nivel } = this.form.value;
    anaquel = parseInt(anaquel);
    nivel = parseInt(nivel);
    this.subscription.add(this.ubicacionService.updateOne(this.ubcacionId, { anaquel, nivel }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.ubicaciones.forEach(u => {
        if (u.id === this.ubcacionId) {
          u.anaquel = anaquel;
          u.nivel = nivel;
          return;
        }
      });
      this.swas.showAlertGeneric('Ok', 'Se guardaron los cambios', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo editar la ubicación', 'error');
    }));
  }

  public async delete(id: string): Promise<void> {
    const sure = await this.swas.showConfirmDialog('¿Está seguro?', 'Esta acción no se puede deshacer', 'question', 'Eliminar');
    if (sure.isConfirmed) {
      this.swas.showLoading('Espere', 'Eliminando...');
      this.subscription.add(this.ubicacionService.deleteOne(id).subscribe(data => {
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

  public get isAnaquelValid(): boolean {
    const field = this.form.get('anaquel');
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    }
    return false;
  }

  public get isNivelValid(): boolean {
    const field = this.form.get('nivel');
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
      anaquel: ['', [
        Validators.required,
      ]],
      nivel: ['', [
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

  private setValues(ubicacion: IUbicacionRead): void {
    this.form.get('anaquel')?.setValue(ubicacion.anaquel);
    this.form.get('nivel')?.setValue(ubicacion.nivel);
    this.ubcacionId = ubicacion.id;
  }

}
