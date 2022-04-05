import { Component, OnInit, OnDestroy } from '@angular/core';
import { SkuService } from '../../../skus/services/sku.service';
import { MaterialService } from '../../services/material.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMaterialRead } from '../../models/interface';

@Component({
  selector: 'app-material-detail',
  templateUrl: './material-detail.component.html',
  styleUrls: ['./material-detail.component.scss']
})
export class MaterialDetailComponent implements OnInit, OnDestroy {

  public material!: IMaterialRead;
  public id: string;
  private subscription = new Subscription();

  constructor(
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id ? id : '';
  }

  ngOnInit(): void {
    this.subscription.add(this.materialService.getOneById(this.id).subscribe(data => {
      this.material = data;
    }, (e) => {
      this.router.navigateByUrl('/dashboard/materiales');
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
