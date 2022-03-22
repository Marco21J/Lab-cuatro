import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IUsuarioRead } from '../../models/interface';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DataTableDirective } from 'angular-datatables';
import { StatusEnum } from 'src/app/common/enums';

@Component({
  selector: 'app-usuario-main',
  templateUrl: './usuario-main.component.html',
  styleUrls: ['./usuario-main.component.scss']
})
export class UsuarioMainComponent implements OnInit, OnDestroy {

  public usuarios: IUsuarioRead[] = [];
  public dtOptions!: DataTables.Settings;
  private subscription = new Subscription();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement!: DataTableDirective;

  constructor(
    private usuarioService: UsuarioService,
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
        that.subscription.add(that.usuarioService.getUsuarios(start, length, value).subscribe(data => {
          this.usuarios = data.data;
          callback({
            recordsTotal: data.count,
            recordsFiltered: data.filteredCount,
            data: data.data
          });
        }));
      },
      columns: [
        { data: `nombre` },
        { data: 'email' },
        { data: 'status' },
        { data: 'rol.nombre' },
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

public toggleStatus(id: string): void {
  /* const user = this.usuarios.find(u => u.id === id); */
  let user!: IUsuarioRead;
  this.swas.showLoading('Espere', 'Cambiando status...');
  this.usuarios.forEach(u => {
    if (u.id === id) {
      u.status = u.status === StatusEnum.ACTIVO ? StatusEnum.INACTIVO : StatusEnum.ACTIVO;
      user = u;
    }
  });
  this.subscription.add(this.usuarioService.statusToggle(id, { status: user.status }).subscribe(data => {
    this.swas.hideLoading();
    this.swas.showAlertGeneric('Ok', `Se ${ user.status === StatusEnum.ACTIVO ? 'activó' : 'desactivó' } el usuario`, 'success');
  }, (e) => {
    this.swas.hideLoading();
    this.swas.showAlertGeneric('Error', 'No se pudo cambiar el status', 'error');
    this.usuarios.forEach(u => {
      if (u.id === id) {
        u.status = u.status === StatusEnum.ACTIVO ? StatusEnum.INACTIVO : StatusEnum.ACTIVO;
        user = u;
      }
    });
  }));
}

  public async delete(id: string): Promise<void> {
    const sure = await this.swas.showConfirmDialog('¿Estás seguro?', 'Esta acción no se puede deshacer', 'question', 'Eliminar');
    if (sure.isConfirmed) {
      this.swas.showLoading('Espere', 'Eliminando...');
      this.subscription.add(this.usuarioService.deleteOne(id).subscribe(data => {
        this.swas.hideLoading();
        this.dtElement.dtInstance.then(d => {
          d.ajax.reload();
        });
        this.swas.showAlertGeneric('Ok', 'Se eliminó comrrectamente', 'success');
      }, (e) => {
        this.swas.hideLoading();
        this.swas.showAlertGeneric('Error', 'Algo salío mal al intentar eliminar, intenta más tarde', 'error');
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
