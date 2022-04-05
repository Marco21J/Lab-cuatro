import { Component, Input, OnInit } from '@angular/core';
import { IReactivoRead } from '../../models/interface';

@Component({
  selector: 'app-reactivo-card',
  templateUrl: './reactivo-card.component.html',
  styleUrls: ['./reactivo-card.component.scss']
})
export class ReactivoCardComponent {

  @Input() reactivo!: IReactivoRead;

  constructor() { }

  public get cardSuccess(): boolean {
    return this.reactivo.cantidad >= 20 && this.reactivo.stock >= 20;
  }

  public get cardWarning(): boolean {
    return this.reactivo.cantidad < 20 && this.reactivo.cantidad >= 10 && this.reactivo.stock < 20 && this.reactivo.cantidad >= 10;
  }

  public get cardDanger(): boolean {
    return this.reactivo.cantidad < 10 && this.reactivo.stock < 10;
  }



  /* ngOnInit(): void {
  } */

}
