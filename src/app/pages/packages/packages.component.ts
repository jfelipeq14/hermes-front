/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PackageModel } from '../../models/package';
import { PackageService } from '../../services/package.service';
import { PackageServiceModel } from '../../models';

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
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    TagModule,
    ConfirmDialogModule,
  ],
  providers: [PackageService, MessageService, ConfirmationService],
})
export class PackagesPage implements OnInit {
  package: PackageModel = new PackageModel();
  packages: PackageModel[] = [];
  packageServices: PackageServiceModel[] = [];
  packageDialog = false;
  submitted = false;
  expandedRows: Record<string, boolean> = {};

  constructor(
    private packageService: PackageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllPackages();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAllPackages() {
    this.packageService.getAll().subscribe({
      next: (packages) => {
        this.packages = packages;
        // Load package services for each package
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

  onRowCollapse(event: any) {
    console.log(event);
  }
  expandAll() {
    this.packages.forEach((pkg) => {
      this.expandedRows[pkg.id] = true;
    });
  }

  collapseAll() {
    this.expandedRows = {};
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }

  savePackage() {
    this.submitted = true;

    if (!this.package.id) {
      this.packageService.create(this.package).subscribe({
        next: (pkg) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${pkg.name} creado`,
            life: 3000,
          });
          this.getAllPackages();
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
      this.packageService.update(this.package).subscribe({
        next: (pkg) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${pkg.name} actualizado`,
            life: 3000,
          });
          this.getAllPackages();
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
    this.closePopup();
  }

  editPackage(pkg: PackageModel) {
    this.package = { ...pkg };
    this.packageDialog = true;
  }

  changeStatusPackage(pkg: PackageModel) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cambiar el estado de ${pkg.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.packageService.changeStatus(pkg.id).subscribe({
          next: (updatedPkg) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `${updatedPkg.name} ${
                updatedPkg.status ? 'activado' : 'desactivado'
              }`,
              life: 3000,
            });
            this.getAllPackages();
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
    this.package = new PackageModel();
    this.packageDialog = true;
    this.submitted = false;
  }

  closePopup() {
    this.packageDialog = false;
    this.package = new PackageModel();
  }
}
