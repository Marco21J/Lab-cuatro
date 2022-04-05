import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IReactivoRead } from '../../models/interface';
import { Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ReactivoService } from '../../services/reactivo.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-reactivo-main',
  templateUrl: './reactivo-main.component.html',
  styleUrls: ['./reactivo-main.component.scss']
})
export class ReactivoMainComponent implements OnInit, OnDestroy {

  public reactivos: IReactivoRead[] = [];
  public dtOptions!: DataTables.Settings;
  private subscription = new Subscription();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement!: DataTableDirective;

  constructor(
    private reactivoService: ReactivoService,
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
        that.subscription.add(that.reactivoService.getAllPaginated(start, length, value).subscribe(data => {
          this.reactivos = data.data;
          callback({
            recordsTotal: data.count,
            recordsFiltered: data.filteredCount,
            data: data.data
          });
        }));
      },
      columns: [
        { data: `nombre` },
        { data: 'stock' },
        { data: 'cantidad' },
        { data: 'estadoFisico' },
        { data: 'clasificacion' },
        { data: 'fechaIngreso' },
        { data: 'hojaSeguridad' },
        { data: 'unidadMedida' },
        { data: 'marca' },
        { data: 'tipoEnvase' },
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
      this.subscription.add(this.reactivoService.deleteOne(id).subscribe(data => {
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
