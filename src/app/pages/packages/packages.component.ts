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
import {
  ActivityModel,
  DateModel,
  MunicipalityModel,
  PackageModel,
  PackageServiceModel,
  ServiceModel,
} from '../../models';
import {
  ActivityService,
  MunicipalityService,
  PackageService,
  ProgrammingService,
  ServiceService,
} from '../../services';
import { levels } from '../../shared/constants';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'],
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
  ],
  providers: [
    PackageService,
    ServiceService,
    ActivityService,
    MunicipalityService,
    ProgrammingService,
    MessageService,
    ConfirmationService,
  ],
})
export class PackagesPage implements OnInit {
  package: PackageModel = new PackageModel();
  packages: PackageModel[] = [];
  packageServices: PackageServiceModel[] = [];

  services: ServiceModel[] = [];
  activities: ActivityModel[] = [];
  municipalities: MunicipalityModel[] = [];
  dates: DateModel[] = [];

  levels = levels;

  selectedServices: PackageServiceModel[] = [];
  currentService: PackageServiceModel = new PackageServiceModel();

  packageDialog = false;
  submitted = false;
  expandedRows: Record<string, boolean> = {};

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
              this.packageServices = services;
            },
          });
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
          life: 3000,
        });
      },
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
          life: 3000,
        });
      },
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
          life: 3000,
        });
      },
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
        },
      });
    }
  }

  getPackageServices(idPackage: number): PackageServiceModel[] {
    return this.packageServices.filter(
      (service) => service.idPackage === idPackage
    );
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }

  savePackage() {
    this.submitted = true;

    if (this.selectedServices.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un servicio al paquete',
        life: 3000,
      });
      return;
    }

    if (!this.package.id) {
      this.packageService.create(this.package).subscribe({
        next: (pkg) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${pkg.name} creado`,
            life: 3000,
          });

          this.addServicesToPackage(pkg.id);
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
      this.package.price = parseInt(this.package.price.toString());
      this.package.reserve = parseInt(this.package.reserve.toString());

      this.packageService.update(this.package).subscribe({
        next: (pkg) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${pkg.name} actualizado`,
            life: 3000,
          });

          this.addServicesToPackage(pkg.id);
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
  }

  addServicesToPackage(idPackage: number) {
    this.selectedServices.forEach((service) => {
      service.id = 0;
      service.idPackage = idPackage;
    });

    if (this.selectedServices.length <= 0) return;

    this.packageService.createServicePackage(this.selectedServices).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Servicios agregados correctamente',
          life: 3000,
        });
        this.refresh();
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

  // modifyServicePackage(packageService: PackageServiceModel) {}

  editPackage(pkg: PackageModel): void {
    // Create a deep copy of the package to avoid direct reference modification
    this.package = { ...pkg };

    // Load the services associated with this package
    this.packageService.getServicePackages(pkg.id).subscribe({
      next: (services) => {
        this.selectedServices = services;
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

    // Show the dialog
    this.packageDialog = true;
    this.submitted = false;
  }

  changeStatusPackage(pkg: PackageModel): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea ${
        pkg.status ? 'desactivar' : 'activar'
      } el paquete ${pkg.name}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.packageService.changeStatus(pkg.id).subscribe({
          next: (updatedPackage) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Paquete ${updatedPackage.name} ${
                updatedPackage.status ? 'activado' : 'desactivado'
              }`,
              life: 3000,
            });
            this.refresh();
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
        life: 3000,
      });
      return;
    }

    const serviceExists = this.selectedServices.find(
      (s) => s.idService === serviceFound.id
    );

    if (serviceExists) {
      serviceExists.quantity++;
      return;
    }

    this.selectedServices.push({
      id: 0,
      idPackage: 0,
      idService: serviceFound.id,
      quantity: 1,
      price: serviceFound.price,
    });
  }

  removeServiceFromSelection(index: number) {
    this.packageService
      .deleteServicePackage(this.selectedServices[index].id)
      .subscribe({
        next: (deleted) => {
          if (!deleted) this.selectedServices.splice(index, 1);

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Servicio eliminado correctamente',
            life: 3000,
          });
        },
        error: () => {
          this.selectedServices.splice(index, 1);
        },
      });
  }

  showPopup() {
    this.package = new PackageModel();
    this.currentService = new PackageServiceModel();
    this.selectedServices = [];
    this.packageDialog = true;
    this.submitted = false;
  }

  closePopup() {
    this.packageDialog = false;
    this.package = new PackageModel();
    this.selectedServices = [];
  }

  refresh() {
    this.getAllPackages();
    this.closePopup();
    this.submitted = false;
  }
}
