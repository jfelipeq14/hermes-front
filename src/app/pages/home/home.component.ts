/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';

// Componentes propios
import { ActivateModel, DateModel, MunicipalityModel, PackageModel, ResetModel, ServiceModel, UserModel } from '../../models';

import { FormReservationComponent, LoginComponent, PackageCardComponent, RegisterComponent, ResetPasswordComponent, RestorePasswordComponent } from '../../shared/components';

import { MunicipalityService, PackageService, ProgrammingService, ServiceService } from '../../services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [
        CommonModule,
        RippleModule,
        StyleClassModule,
        ButtonModule,
        DividerModule,
        DialogModule,
        CardModule,
        AccordionModule,
        CarouselModule,
        LoginComponent,
        RegisterComponent,
        RestorePasswordComponent,
        ResetPasswordComponent,
        FormReservationComponent,
        PackageCardComponent
    ],
    providers: [ProgrammingService, PackageService, ServiceService, MunicipalityService, MessageService]
})
export class HomePage implements OnInit {
    submitted = false;
    dialogVisible = false;
    dialogType: 'login' | 'register' | 'restore' | 'reset' | 'reservation' = 'login';

    user: UserModel = new UserModel();
    activateModel: ActivateModel = new ActivateModel();
    resetModel: ResetModel = new ResetModel();
    idDate = 0;
    municipalities: MunicipalityModel[] = [];

    dates: DateModel[] = [];
    packages: PackageModel[] = [];
    services: ServiceModel[] = [];

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
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private serviceService: ServiceService,
        private municipalityService: MunicipalityService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getAllDates();
        this.getAllPackage();
        this.getAllServices();
        this.getAllMunicipalities();
    }

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates.map((date) => {
                    if (!date.status) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'No hay fechas disponibles',
                            life: 3000
                        });
                    }
                    return date;
                });
            },
            error: () => {
                return;
            }
        });
    }

    getAllPackage() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages.map((pack) => {
                    if (!pack.status) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'No hay paquetes disponibles',
                            life: 3000
                        });
                    }
                    return pack;
                });
            },
            error: () => {
                return;
            }
        });
    }

    getAllServices() {
        this.serviceService.getAll().subscribe({
            next: (services) => {
                this.services = services.map((service) => {
                    if (!service.status) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'No hay servicios disponibles',
                            life: 3000
                        });
                    }
                    return service;
                });
            },
            error: () => {
                return;
            }
        });
    }

    getAllMunicipalities() {
        this.municipalityService.getAll().subscribe({
            next: (municipalities) => {
                this.municipalities = municipalities;
            },
            error: () => {
                return;
            }
        });
    }

    clickReservation(idDate: number) {
        this.idDate = idDate;
        this.dialogType = 'reservation';
        this.dialogVisible = true;
    }

    showPopupLogin(): void {
        this.dialogType = 'login';
        this.dialogVisible = true;
    }

    showPopupRegister(): void {
        this.dialogType = 'register';
        this.dialogVisible = true;
    }

    showPopupRestore(): void {
        this.dialogType = 'restore';
        this.dialogVisible = true;
    }

    showPopupReset(): void {
        this.dialogType = 'reset';
        this.dialogVisible = true;
    }

    closePopup() {
        this.submitted = false;
        this.dialogVisible = false;
        this.user = new UserModel();
        this.activateModel = new ActivateModel();
        this.resetModel = new ResetModel();
    }
}
