import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Directive({
  selector: '[appUserHasRole]'
})
export class RoleDirective implements OnInit {

  @Input('appUserHasRole') roles!: number[];
  private isVisible = false;
 /*  private roles!: number[]; */

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.roles) {
      this.viewContainerRef.clear();
    }
    const userRol = this.authService.sessionObject.rol;
    if (this.roles.includes(userRol.id)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }

}
