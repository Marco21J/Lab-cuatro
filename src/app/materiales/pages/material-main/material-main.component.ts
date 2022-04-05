import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IMaterialRead } from '../../models/interface';
import { Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MaterialService } from '../../services/material.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-material-main',
  templateUrl: './material-main.component.html',
  styleUrls: ['./material-main.component.scss']
})
export class MaterialMainComponent implements OnInit, OnDestroy {

  public materiales: IMaterialRead[] = [];
  public dtOptions!: DataTables.Settings;
  private subscription = new Subscription();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement!: DataTableDirective;

  constructor(
    private materialService: MaterialService,
    private swas: SweetAlertService,
  ) { }

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
        that.subscription.add(that.materialService.getAllPaginated(start, length, value).subscribe(data => {
          this.materiales = data.data;
          callback({
            recordsTotal: data.count,
            recordsFiltered: data.filteredCount,
            data: data.data
          });
        }));
      },
      columns: [
        { data: `nombre` },
        { data: 'capacidadTamanio' },
        { data: 'cantidad' },
        { data: 'clasificacion' },
        { data: 'fechaIngreso' },
        { data: 'unidadMedida' },
        { data: 'marca' },
        { data: 'tipoMaterial' },
        { data: 'ubicacion' },
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

  public async delete(id: string): Promise<void> {
    const sure = await this.swas.showConfirmDialog('¿Está seguro?', 'Esta acción no se puede deshacer', 'question', 'Eliminar');
    if (sure.isConfirmed) {
      this.swas.showLoading('Espere', 'Eliminando...');
      this.subscription.add(this.materialService.deleteOne(id).subscribe(data => {
        this.swas.hideLoading();
        this.reloadAjaxDataTable();
        this.swas.showAlertGeneric('Ok', 'Se eliminó correctamente', 'success');
      }, (e) => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Error', 'Algo salío mal al intentar eliminar, intenta más tarde', 'error');
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private reloadAjaxDataTable(): void {
    this.dtElement.dtInstance.then(d => {
      d.ajax.reload();
    });
  }

}
