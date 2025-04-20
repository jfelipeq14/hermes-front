import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services';
import { map, Subscription } from 'rxjs';

@Directive({
  selector: '[appShowRoles]',
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
  @Input('appShowRoles') allowedRoles?: number[];
  private sub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$
      .pipe(
        map((user) => Boolean(user && this.allowedRoles?.includes(user.idRole)))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
