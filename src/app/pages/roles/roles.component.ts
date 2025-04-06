/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RoleModel } from '../../models';
import { RolesService } from '../../services';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
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
  providers: [RolesService, MessageService, ConfirmationService],
})
export class RolesPage implements OnInit {
  roleDialog = false;
  roles: RoleModel[] = [];
  role: RoleModel = new RoleModel();
  submitted = false;
  loading = false;

  constructor(
    private roleService: RolesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getAllRoles();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAllRoles() {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message || 'No se pudieron cargar los roles',
          life: 3000,
        });
      },
    });
  }

  saveRole() {
    this.submitted = true;

    if (this.role.id) {
      this.roleService.update(this.role).subscribe({
        next: (r) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${r.name} actualizado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message || 'No se pudo actualizar el rol',
            life: 3000,
          });
        },
      });
    } else {
      this.roleService.create(this.role).subscribe({
        next: (r) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${r.name} creado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message || 'No se pudo crear el rol',
            life: 3000,
          });
        },
      });
    }
    this.refresh();
    this.closePopup();
  }

  editRole(role: RoleModel) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  changeStatusRole(role: RoleModel) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cambiar el estado de ${role.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.changeStatus(role.id).subscribe({
          next: (r) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `${r.name} ${r.status ? 'activado' : 'desactivado'}`,
              life: 3000,
            });
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.error.message || 'No se pudo cambiar el estado del rol',
              life: 3000,
            });
          },
        });
        this.refresh();
      },
    });
  }

  showPopup() {
    this.role = new RoleModel();
    this.submitted = false;
    this.roleDialog = true;
  }

  closePopup() {
    this.roleDialog = false;
    this.submitted = false;
  }

  refresh() {
    this.getAllRoles();
  }
}
