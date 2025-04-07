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
import { InputTextModule } from 'primeng/inputtext';
import { PackageModel } from '../../models/package';
import { PackageService } from '../../services/package.service';

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
    ConfirmDialogModule,
  ],
  providers: [PackageService, MessageService, ConfirmationService],
})
export class PackagesPage implements OnInit {
  package: PackageModel = new PackageModel();
  packages: PackageModel[] = [];
  packageDialog = false;
  submitted = false;

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
