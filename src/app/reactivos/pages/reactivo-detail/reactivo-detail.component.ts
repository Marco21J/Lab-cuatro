import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IReactivoRead } from '../../models/interface';
import { ReactivoService } from '../../services/reactivo.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reactivo-detail',
  templateUrl: './reactivo-detail.component.html',
  styleUrls: ['./reactivo-detail.component.scss']
})
export class ReactivoDetailComponent implements OnInit, OnDestroy {

  public reactivo!: IReactivoRead;
  public id: string;
  private subscription = new Subscription();

  constructor(
    private reactivoService: ReactivoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id ? id : '';
  }

  ngOnInit(): void {
    this.subscription.add(this.reactivoService.getOneById(this.id).subscribe(data => {
      this.reactivo = data;
    }, (e) => {
      this.router.navigateByUrl('/dashboard/reactivos');
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
