/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ServiceModel } from '../../models';
import { ServiceService } from '../../services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [MessageService, ConfirmationService, ServiceService],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DialogModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
  ],
})
export class ServicesPage implements OnInit {
  serviceDialog = false;
  submitted = false;
  service: ServiceModel = new ServiceModel();
  services: ServiceModel[] = [];
  loading = false;

  @ViewChild('dt') dt!: Table;

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

  openNew() {
    this.service = new ServiceModel();
    this.submitted = false;
    this.serviceDialog = true;
  }

  editService(service: ServiceModel) {
    this.service = { ...service };
    this.serviceDialog = true;
  }

  deleteService(service: ServiceModel) {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea cambiar el estado de ' + service.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        service.status = !service.status;
        this.serviceService.update(service).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Estado del servicio actualizado',
            });
            this.getAllServices();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el estado del servicio',
            });
          },
        });
      },
    });
  }

  getAllServices() {
    this.loading = true;
    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los servicios',
        });
      },
    });
  }

  saveService() {
    this.submitted = true;

    if (this.service.name.trim()) {
      if (this.service.id) {
        this.serviceService.update(this.service).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Servicio actualizado',
            });
            this.getAllServices();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el servicio',
            });
          },
        });
      } else {
        this.serviceService.create(this.service).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Servicio creado',
            });
            this.getAllServices();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el servicio',
            });
          },
        });
      }

      this.serviceDialog = false;
      this.service = new ServiceModel();
    }
  }
}
