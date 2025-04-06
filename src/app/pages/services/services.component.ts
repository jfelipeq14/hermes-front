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
import { ServiceModel } from '../../models';
import { ServiceService } from '../../services';

@Component({
  standalone: true,
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [MessageService, ConfirmationService, ServiceService],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
  ],
})
export class ServicesPage implements OnInit {
  service: ServiceModel = new ServiceModel();
  services: ServiceModel[] = [];
  serviceDialog = false;
  submitted = false;
  statuses = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  constructor(
    private serviceService: ServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllServices();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
          life: 3000,
        });
      },
    });
  }

  saveService() {
    this.submitted = true;

    if (!this.service.id) {
      this.serviceService.create(this.service).subscribe({
        next: (s) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${s.name} creado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message,
            life: 3000,
          });
        },
      });
    } else {
      this.serviceService.update(this.service).subscribe({
        next: (s) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${s.name} actualizado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message,
            life: 3000,
          });
        },
      });
    }
    this.getAllServices();
    this.closePopup();
  }

  editService(service: ServiceModel) {
    this.service = { ...service };
    this.serviceDialog = true;
  }

  changeStatusService(service: ServiceModel) {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea cambiar el estado de ' + service.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.serviceService.changeStatus(service.id).subscribe({
          next: (s) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `${s.name} ${s.status ? 'activado' : 'desactivado'}`,
              life: 3000,
            });
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.error.message,
              life: 3000,
            });
          },
        });
      },
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
}
