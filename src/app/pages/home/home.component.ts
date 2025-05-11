/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';

// Componentes propios
import { MunicipalityModel, UserModel } from '../../models';
import { FormReservationComponent, LoginComponent, RegisterComponent } from '../../shared/components';
import { MunicipalityService } from '../../services';
import { MessageService } from 'primeng/api';

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
    styleUrls: ['./home.component.scss'],
    imports: [CommonModule, RouterModule, RippleModule, StyleClassModule, ButtonModule, DividerModule, DialogModule, CardModule, AccordionModule, CarouselModule, LoginComponent, RegisterComponent, FormReservationComponent],
    providers: [MunicipalityService, MessageService]
})
export class HomePage implements OnInit {
    submitted = false;
    dialogVisible = false;
    dialogType: 'login' | 'register' | 'reservation' = 'login';

    user: UserModel = new UserModel();
    idDate = 0;
    municipalities: MunicipalityModel[] = [];

    packages: TravelPackage[] = [
        {
            id: 1,
            image: 'assets/images/cartagena.jpg',
            location: 'Cartagena, Colombia',
            details: ['Recorrido por la ciudad', 'Tour al centro y playa blanca', 'Hotel 4 estrellas todo incluido', 'Alimentación: 4 desayunos y 3 cenas'],
            price: 85000,
            date: '01/05/2024'
        },
        {
            id: 2,
            image: 'assets/images/cartagena.jpg',
            location: 'Cartagena, Colombia',
            details: ['Recorrido por la ciudad', 'Tour al centro y playa blanca', 'Hotel 4 estrellas todo incluido', 'Alimentación: 4 desayunos y 3 cenas'],
            price: 85000,
            date: '01/06/2024'
        },
        {
            id: 3,
            image: 'assets/images/cartagena.jpg',
            location: 'Cartagena, Colombia',
            details: ['Recorrido por la ciudad', 'Tour al centro y playa blanca', 'Hotel 4 estrellas todo incluido', 'Alimentación: 4 desayunos y 3 cenas'],
            price: 85000,
            date: '01/07/2024'
        },
        {
            id: 4,
            image: 'assets/images/cartagena.jpg',
            location: 'Cartagena, Colombia',
            details: ['Recorrido por la ciudad', 'Tour al centro y playa blanca', 'Hotel 4 estrellas todo incluido', 'Alimentación: 4 desayunos y 3 cenas'],
            price: 85000,
            date: '01/08/2024'
        }
    ];

    features = [
        {
            icon: 'pi pi-globe',
            title: 'Destinos turísticos',
            description: 'Tenemos mucha variedad de destinos nacionales, incluyendo e internacionales'
        },
        {
            icon: 'pi pi-phone',
            title: 'Excelente asesoría',
            description: 'Nuestros asesores están siempre a tu guía en todo el proceso'
        },
        {
            icon: 'pi pi-dollar',
            title: 'Planes asequibles',
            description: 'Tenemos varios planes turísticos que son asequibles para el bolsillo de todos'
        },
        {
            icon: 'pi pi-check-circle',
            title: 'Reconocimiento',
            description: 'Llevamos más de 1 mes en el mercado ofreciendo paquetes a nivel nacional e internacional'
        }
    ];

    constructor(
        private municipalityService: MunicipalityService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getAllMunicipalities();
    }

    getAllMunicipalities() {
        this.municipalityService.getAll().subscribe({
            next: (municipalities) => {
                this.municipalities = municipalities;
            },
            error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error.message || 'No se pudieron cargar los municipios',
                    life: 3000
                });
            }
        });
    }

    showPopupLogin(): void {
        this.dialogType = 'login';
        this.dialogVisible = true;
    }

    showPopupRegister(): void {
        this.dialogType = 'register';
        this.dialogVisible = true;
    }

    showPopupReservation(): void {
        this.dialogType = 'reservation';
        this.dialogVisible = true;
    }

    closePopup() {
        this.dialogVisible = false;
        this.user = new UserModel();
    }
}
