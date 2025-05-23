/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivityModel, DateModel, MunicipalityModel, PackageModel, PackageServiceModel, ServiceModel } from '../../models';
import { ActivityService, MunicipalityService, PackageService, ProgrammingService, ServiceService } from '../../services';
import { levels } from '../../shared/constants';
import { PATTERNS } from '../../shared/helpers';
import { UploadImageComponent } from '../../shared/components/upload-image/upload-image.component';

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss'],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        InputNumberModule,
        TextareaModule,
        TagModule,
        ConfirmDialogModule,
        UploadImageComponent
    ],
    providers: [PackageService, ServiceService, ActivityService, MunicipalityService, ProgrammingService, MessageService, ConfirmationService]
})
export class PackagesPage implements OnInit {
    package: PackageModel = new PackageModel();
    packages: PackageModel[] = [];
    packageServices: PackageServiceModel[] = [];

    services: ServiceModel[] = [];
    activities: ActivityModel[] = [];
    municipalities: MunicipalityModel[] = [];
    dates: DateModel[] = [];
    currentService: PackageServiceModel = new PackageServiceModel();

    packageDialog = false;
    submitted = false;
    expandedRows: Record<string, boolean> = {};
    levels = levels;
    patterns = PATTERNS;

    constructor(
        private packageService: PackageService,
        private serviceService: ServiceService,
        private activityService: ActivityService,
        private municipalityService: MunicipalityService,
        private programmingService: ProgrammingService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getAllPackages();
        this.getAllServices();
        this.getAllActivities();
        this.getAllMunicipalities();
        this.getAllDates();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getAllPackages() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages.map((pkg) => {
                    return {
                        ...pkg,
                        price: +pkg.price,
                        reserve: +pkg.reserve
                    };
                });
                this.packages.forEach((pkg) => {
                    this.packageServices = pkg.detailPackagesServices;
                });
            },
            error: (e) => console.error(e)
        });
    }

    getAllServices() {
        this.serviceService.getAll().subscribe({
            next: (services) => {
                this.services = services;
            },
            error: (e) => console.error(e)
        });
    }

    getAllActivities() {
        this.activityService.getAll().subscribe({
            next: (activities) => {
                this.activities = activities;
            },
            error: (e) => console.error(e)
        });
    }

    getAllMunicipalities() {
        this.municipalityService.getAll().subscribe({
            next: (municipalities) => {
                this.municipalities = municipalities;
            },
            error: (e) => console.error(e)
        });
    }

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates;
            },
            error: (e) => console.error(e)
        });
    }

    getServiceName(id: number) {
        return this.services.find((s) => s.id === id)?.name;
    }

    getMunicipalityName(id: number) {
        return this.municipalities.find((m) => m.id === id)?.name;
    }

    getDate(id: number) {
        const dateObj = this.dates.find((d) => d.idPackage === id)?.start;
        if (!dateObj) return '';

        // Parse the ISO string to a Date object
        const date = new Date(dateObj);

        // Format as yyyy/MM/dd
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`;
    }

    onRowExpand(event: any) {
        if (!event.data.detailPackagesServices) {
            return;
        }

        this.packageServices = event.data.detailPackagesServices;
    }

    getSeverity(status: boolean): 'success' | 'danger' {
        return status ? 'success' : 'danger';
    }

    uploadImage(filePath: string) {
        this.package.image = filePath;
        console.log('Imagen subida:', this.package.image);
    }

    savePackage() {
        this.submitted = true;

        // Convertir los precios y valores de precio como reserve a int
        this.package.price = Math.max(1, Math.floor(Number(this.package.price)));
        this.package.reserve = Math.max(1, Math.floor(Number(this.package.reserve)));
        this.package.detailPackagesServices = this.package.detailPackagesServices.map((service) => ({
            idService: service.idService,
            quantity: Math.max(1, Math.floor(Number(service.quantity))),
            price: Math.max(1, Math.floor(Number(service.price)))
        }));
        this.package.level = this.package.level ? this.package.level : 0;

        if (!this.package.image) {
            console.log('No se ha seleccionado una imagen');

            return;
        }

        if (this.package.id) {
            this.packageService.update(this.package).subscribe({
                next: (updatedPackage) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Paquete ${updatedPackage.name} actualizado`,
                        life: 3000
                    });
                    this.refresh();
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message,
                        life: 3000
                    });
                }
            });
        } else {
            this.packageService.create(this.package).subscribe({
                next: (createdPackage) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Paquete ${createdPackage.name} creado`,
                        life: 3000
                    });
                    this.refresh();
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message,
                        life: 3000
                    });
                }
            });
        }
    }

    changeStatusPackage(pkg: PackageModel): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de que desea ${pkg.status ? 'desactivar' : 'activar'} el paquete ${pkg.name}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.packageService.changeStatus(pkg.id).subscribe({
                    next: (updatedPackage) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Paquete ${updatedPackage.name} ${updatedPackage.status ? 'activado' : 'desactivado'}`,
                            life: 3000
                        });
                        this.refresh();
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
                this.refresh();
            }
        });
    }

    editPackage(pkg: PackageModel): void {
        this.package = { ...pkg };

        this.package.detailPackagesServices = pkg.detailPackagesServices.map((service) => ({
            idService: service.idService,
            quantity: service.quantity,
            price: service.price
        }));

        const selectedLevel = this.levels.find((level) => level.value === pkg.level);
        this.package.level = selectedLevel ? selectedLevel.value : 0;

        this.packageDialog = true;
        this.submitted = false;
    }

    addServiceToSelection(event: any) {
        if (!event.value) {
            return;
        }

        const serviceFound = this.services.find((s) => s.id === event.value);

        if (!serviceFound) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Servicio no encontrado',
                life: 3000
            });
            return;
        }

        const existingService = this.package.detailPackagesServices.find((s) => s.idService === serviceFound.id);

        if (existingService) {
            existingService.quantity++;
        } else {
            this.package.detailPackagesServices.push({
                idService: serviceFound.id,
                quantity: 1,
                price: Math.max(1, Math.floor(Number(serviceFound.price))) // Asegura entero positivo
            });
        }
    }

    removeServiceFromSelection(serviceId: number) {
        const serviceIndex = this.package.detailPackagesServices.findIndex((s) => s.idService === serviceId);

        if (serviceIndex !== -1) {
            this.package.detailPackagesServices.splice(serviceIndex, 1);
        }
    }

    showPopup() {
        this.package = new PackageModel();
        this.packageDialog = true;
        this.submitted = false;
    }

    closePopup() {
        this.packageDialog = false;
        this.package = new PackageModel();
    }

    refresh() {
        this.package = new PackageModel();
        this.packages = [];
        this.packageServices = [];

        this.services = [];
        this.activities = [];
        this.municipalities = [];
        this.dates = [];

        this.currentService = new PackageServiceModel();

        this.getAllPackages();
        this.getAllServices();
        this.getAllActivities();
        this.getAllMunicipalities();
        this.getAllDates();

        this.packageDialog = false;
        this.submitted = false;
        this.closePopup();
    }
}
