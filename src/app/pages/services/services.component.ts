/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CategoryModel, ServiceModel } from '../../models';
import { CategoryService, ServiceService } from '../../services';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PATTERNS } from '../../shared/helpers';

@Component({
    standalone: true,
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, DialogModule, DropdownModule, InputTextModule, InputNumberModule, InputIconModule, IconFieldModule, ConfirmDialogModule, TagModule],
    providers: [ServiceService, CategoryService, MessageService, ConfirmationService]
})
export class ServicesPage implements OnInit {
    service: ServiceModel = new ServiceModel();
    services: ServiceModel[] = [];
    categories: CategoryModel[] = [];
    serviceDialog = false;
    submitted = false;
    statuses = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];
    patterns = PATTERNS;

    constructor(
        private serviceService: ServiceService,
        private categoryService: CategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getAllServices();
        this.getAllCategories();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getAllCategories() {
        this.categoryService.getAll().subscribe({
            next: (categories) => {
                this.categories = categories;
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

    saveService() {
        this.submitted = true;

        if (!this.service.id) {
            this.serviceService.create(this.service).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Servicio creado correctamente`,
                        life: 3000
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
            this.refresh();
        } else {
            this.serviceService.update(this.service).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Servicio actualizado correctamente`,
                        life: 3000
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
            this.refresh();
        }
        this.refresh();
    }

    editService(service: ServiceModel) {
        this.service = { ...service };
        this.serviceDialog = true;
    }

    changeStatusService(service: ServiceModel) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea cambiar el estado de ' + service.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.serviceService.changeStatus(service.id).subscribe({
                    next: (s) => {
                        this.messageService.add({
                            severity: this.getSeverity(s.status),
                            summary: 'Éxito',
                            detail: `Servicio ${s.status ? 'activado' : 'desactivado'}`,
                            life: 3000
                        });
                        this.refresh();
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Error',
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    showPopup() {
        this.service = new ServiceModel();
        this.serviceDialog = true;
        this.submitted = false;
    }

    closePopup() {
        this.serviceDialog = false;
        this.service = new ServiceModel();
    }

    refresh() {
        this.service = new ServiceModel();
        this.services = [];
        this.categories = [];
        this.serviceDialog = false;
        this.submitted = false;

        this.getAllServices();
        this.getAllCategories();
    }

    getSeverity(status: boolean): 'success' | 'danger' {
        return status ? 'success' : 'danger';
    }
}
