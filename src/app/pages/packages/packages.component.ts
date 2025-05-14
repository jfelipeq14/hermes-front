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

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss'],
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, DialogModule, DropdownModule, InputTextModule, InputIconModule, IconFieldModule, InputNumberModule, TextareaModule, TagModule, ConfirmDialogModule],
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
                this.packages = packages;
                this.packages.forEach((pkg) => {
                    this.packageService.getServicePackages(pkg.id).subscribe({
                        next: (services) => {
                            this.packageServices = [...this.packageServices, ...services];
                        }
                    });
                });
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

    getAllServices() {
        this.serviceService.getAll().subscribe({
            next: (services) => {
                this.services = services;
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

    getAllActivities() {
        this.activityService.getAll().subscribe({
            next: (activities) => {
                this.activities = activities;
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

    getAllMunicipalities() {
        this.municipalityService.getAll().subscribe({
            next: (municipalities) => {
                this.municipalities = municipalities;
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

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates;
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
        const packageId = event.data.id;
        if (!event.data.services) {
            this.packageService.getServicePackages(packageId).subscribe({
                next: (services) => {
                    event.data.services = services;
                }
            });
        }
    }

    getSeverity(status: boolean): 'success' | 'danger' {
        return status ? 'success' : 'danger';
    }

    savePackage() {
        this.submitted = true;

        if (!this.package.name?.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El nombre del paquete es requerido',
                life: 3000
            });
            return;
        }

        if (!this.package.detailPackagesServices.some((service) => service.quantity > 0)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe agregar al menos un servicio al paquete',
                life: 3000
            });
            return;
        }

        // Convert prices to integers
        this.package.price = Math.round(this.package.price);
        this.package.reserve = Math.round(this.package.reserve);
        this.package.detailPackagesServices.forEach((service) => {
            service.price = Math.round(service.price);
        });

        const savePackage$ = this.package.id ? this.packageService.update(this.package) : this.packageService.create(this.package);

        savePackage$.subscribe({
            next: (pkg) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `${pkg.name} ${this.package.id ? 'actualizado' : 'creado'} correctamente`,
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

        // Asegúrate de que detailPackagesServices esté inicializado
        this.package.detailPackagesServices = pkg.detailPackagesServices.map((service) => ({
            idService: service.idService,
            quantity: service.quantity,
            price: Math.round(service.price) // Asegúrate de que el precio sea un entero
        }));

        // Asigna el nivel correspondiente al valor del dropdown
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
                price: serviceFound.price
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
