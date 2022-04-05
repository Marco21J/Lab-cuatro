import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMaterialRead } from 'src/app/materiales/models/interface';
import { IReactivoRead } from 'src/app/reactivos/models/interface';
import { Subscription } from 'rxjs';
import { ReactivoService } from 'src/app/reactivos/services/reactivo.service';
import { MaterialService } from 'src/app/materiales/services/material.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent implements OnInit, OnDestroy {

  public reactivos: IReactivoRead[] = [];
  public materiales: IMaterialRead[] = [];
  private subscription = new Subscription();

  constructor(
    private reactivoService: ReactivoService,
    private materialService: MaterialService,
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.materialService.getAllByCantidad().subscribe(data => {
      this.materiales = data;
    }));
    this.subscription.add(this.reactivoService.getAllByStockAndCantidad().subscribe(data => {
      this.reactivos = data;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
