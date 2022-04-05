import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MarcaService } from '../../services/marca.service';
import { IMarcaRead } from '../../models/interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getErrorMessage } from 'src/app/common/security/validation-message/validation-message';

@Component({
  selector: 'app-marca-main',
  templateUrl: './marca-main.component.html',
  styleUrls: ['./marca-main.component.scss']
})
export class MarcaMainComponent implements OnInit, OnDestroy {

  public marcas: IMarcaRead[] = [];
  public dtOptions!: DataTables.Settings;
  public form!: FormGroup;
  public isEditing = false;
  public isLoading = false;
  private marcaId!: string;
  private subscription = new Subscription();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement!: DataTableDirective;

  constructor(
    private swas: SweetAlertService,
    private marcaService: MarcaService,
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
        that.subscription.add(that.marcaService.getAllPaginated(start, length, value).subscribe(data => {
          this.marcas = data.data;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSubmit(): void {
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

  public async delete(id: string): Promise<void> {
    const sure = await this.swas.showConfirmDialog('¿Está seguro?', 'Esta acción no se puede deshacer', 'question', 'Eliminar');
    if (sure.isConfirmed) {
      this.swas.showLoading('Espere', 'Eliminando...');
      this.subscription.add(this.marcaService.deleteOne(id).subscribe(data => {
        this.swas.hideLoading();
        this.reloadAjaxDataTable();
        this.swas.showAlertGeneric('Ok', 'Se eliminó correctamente', 'success');
      }, (e) => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Error', 'Algo salío mal al intentar eliminar, intenta más tarde', 'error');
      }));
    }
  }

  public onRegister(): void {
    this.isEditing = false;
    this.form.reset();
  }

  public onEdit(marca: IMarcaRead): void {
    this.isEditing = true;
    this.setValues(marca);
  }

  private createOne(): void {
    this.isLoading = true;
    this.swas.showLoading('Espere', 'Registrando...');
    const { nombre, descripcion } = this.form.value;
    this.subscription.add(this.marcaService.createOne({ nombre, descripcion }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.reloadAjaxDataTable();
      this.form.reset();
      this.swas.showAlertGeneric('Ok', 'Se registró correctamente la marca', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo registrar la marca', 'error');
    }));
  }

  private editOne(): void {
    this.isLoading = true;
    this.swas.showLoading('Espere', 'Guardando...');
    const { nombre, descripcion } = this.form.value;
    this.subscription.add(this.marcaService.updateOne(this.marcaId, { nombre, descripcion }).subscribe(data => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.marcas.forEach(m => {
        if (m.id === this.marcaId) {
          m.nombre = nombre;
          m.descripcion = descripcion;
        }
      });
      this.swas.showAlertGeneric('Ok', 'Se guardaron los cambios', 'success');
    }, e => {
      this.isLoading = false;
      this.swas.hideLoading();
      this.swas.showAlertGeneric('Error', 'No se pudo editar la marca', 'error');
    }));
  }

  public get isNombreValid(): boolean {
    const field = this.form.get('nombre');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
    }
    return false;
  }

  public get isDescripcionValid(): boolean {
    const field = this.form.get('descripcion');
    if (field) {
      return field.invalid && (field.dirty || field.touched);
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
        Validators.required
      ]],
      descripcion: ['', [
        Validators.maxLength(200),
      ]]
    });
  }

  private reloadAjaxDataTable(): void {
    this.dtElement.dtInstance.then(d => {
      d.ajax.reload();
    });
  }

  private setValues(marca: IMarcaRead): void {
    this.form.get('nombre')?.setValue(marca.nombre);
    this.form.get('descripcion')?.setValue(marca.descripcion ? marca.descripcion : '');
    this.marcaId = marca.id;
  }
}
