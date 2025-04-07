/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';

// Componentes propios
import { LoginComponent } from '../../shared/components/login/login.component';

interface TravelPackage {
  id: number;
  image: string;
  location: string;
  details: string[];
  price: number;
  date: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    CardModule,
    MessageModule,
    AccordionModule,
    LoginComponent,
  ],
})
export class HomePage {
  loginDialog = false;
  packages: TravelPackage[] = [
    {
      id: 1,
      image: 'assets/images/cartagena.jpg',
      location: 'Cartagena, Colombia',
      details: [
        'Recorrido por la ciudad',
        'Tour al centro y playa blanca',
        'Hotel 4 estrellas todo incluido',
        'Alimentación: 4 desayunos y 3 cenas',
      ],
      price: 85000,
      date: '01/05/2024',
    },
    {
      id: 2,
      image: 'assets/images/cartagena.jpg',
      location: 'Cartagena, Colombia',
      details: [
        'Recorrido por la ciudad',
        'Tour al centro y playa blanca',
        'Hotel 4 estrellas todo incluido',
        'Alimentación: 4 desayunos y 3 cenas',
      ],
      price: 85000,
      date: '01/06/2024',
    },
    {
      id: 3,
      image: 'assets/images/cartagena.jpg',
      location: 'Cartagena, Colombia',
      details: [
        'Recorrido por la ciudad',
        'Tour al centro y playa blanca',
        'Hotel 4 estrellas todo incluido',
        'Alimentación: 4 desayunos y 3 cenas',
      ],
      price: 85000,
      date: '01/07/2024',
    },
    {
      id: 4,
      image: 'assets/images/cartagena.jpg',
      location: 'Cartagena, Colombia',
      details: [
        'Recorrido por la ciudad',
        'Tour al centro y playa blanca',
        'Hotel 4 estrellas todo incluido',
        'Alimentación: 4 desayunos y 3 cenas',
      ],
      price: 85000,
      date: '01/08/2024',
    },
  ];

  features = [
    {
      icon: 'pi pi-globe',
      title: 'Destinos turísticos',
      description:
        'Tenemos mucha variedad de destinos nacionales, incluyendo e internacionales',
    },
    {
      icon: 'pi pi-phone',
      title: 'Excelente asesoría',
      description:
        'Nuestros asesores están siempre a tu guía en todo el proceso',
    },
    {
      icon: 'pi pi-dollar',
      title: 'Planes asequibles',
      description:
        'Tenemos varios planes turísticos que son asequibles para el bolsillo de todos',
    },
    {
      icon: 'pi pi-check-circle',
      title: 'Reconocimiento',
      description:
        'Llevamos más de 1 mes en el mercado ofreciendo paquetes a nivel nacional e internacional',
    },
  ];

  openLoginDialog() {
    const router = inject(Router);
    return router.navigate(['/app']);
  }

  login() {
    this.loginDialog = true;
  }
}
