import { Component, OnInit, Input } from '@angular/core';
import { IMaterialRead } from '../../models/interface';

@Component({
  selector: 'app-material-card',
  templateUrl: './material-card.component.html',
  styleUrls: ['./material-card.component.scss']
})
export class MaterialCardComponent {

  @Input() material!: IMaterialRead;

  constructor() { }

  public get cardSuccess(): boolean {
    return this.material.cantidad >= 20;
  }

  public get cardWarning(): boolean {
    return this.material.cantidad < 20 && this.material.cantidad >=10;
  }

  public get cardDanger(): boolean {
    return this.material.cantidad < 10;
  }

  /* ngOnInit(): void {
  } */

}
