import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../shared/components/login/login.component';
import { UserModel } from '../../models';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    CommonModule,
    LoginComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomePage {
  activity: UserModel = new UserModel();
  loginDialog = false;

  openLoginDialog() {
    this.loginDialog = true;
  }

  login() {
    this.loginDialog = true;
  }
  // Aquí puedes implementar la lógica necesaria para la página de inicio
  // Por ejemplo, un método para obtener información inicial o estadísticas
  constructor() {
    // Inicialización si es necesario
  }
}
