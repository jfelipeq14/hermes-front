/* eslint-disable @angular-eslint/component-class-suffix */
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
import {
  FeaturesWidget,
  FooterWidget,
  HeroWidget,
  HighlightsWidget,
  PricingWidget,
  TopbarWidget,
} from '../../shared/components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    TopbarWidget,
    HeroWidget,
    FeaturesWidget,
    HighlightsWidget,
    PricingWidget,
    FooterWidget,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    LoginComponent,
  ],
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
