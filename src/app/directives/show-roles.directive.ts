import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[akoShowForRoles]',
  standalone: true, // Aseguramos que la directiva sea standalone
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
  @Input('akoShowForRoles') allowedRoleIds?: number[];
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}
  
  ngOnInit(): void {
    this.sub = this.authService.currentUser$
      .pipe(
        map((user) => Boolean(user && this.allowedRoleIds?.includes(user.idRole))),
        distinctUntilChanged(),
        tap((hasRole) =>
          hasRole
            ? this.viewContainerRef.createEmbeddedView(this.templateRef)
            : this.viewContainerRef.clear()
        )
      )
      .subscribe();
  }
  
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}