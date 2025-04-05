/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
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
    ToolbarModule,
    InputTextModule,
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

  constructor(
    private roleService: RolesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.roleService.getAll().subscribe({
      next: (r) => {
        this.roles = r;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.role = new RoleModel();
    this.submitted = false;
    this.roleDialog = true;
  }

  editRole(role: RoleModel) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  hideDialog() {
    this.roleDialog = !this.roleDialog;
    this.submitted = !this.submitted;
  }

  changeStatusRole(role: RoleModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.changeStatus(role.id).subscribe({
          next: (r) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: `${r.name} cambio su estado`,
              life: 3000,
            });
            this.loadData();
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.message,
              life: 3000,
            });
          },
        });
      },
    });
  }

  saveRole() {
    this.submitted = true;
    if (!this.role.id) {
      this.roleService.create(this.role).subscribe({
        next: (r) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `${r.name} created`,
            life: 3000,
          });
        },
        error: (e) => {
          console.error(e);
        },
      });
    } else {
      this.roleService.update(this.role).subscribe({
        next: (r) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `${r.name} updated`,
            life: 3000,
          });
        },
        error: (e) => {
          console.error(e);
        },
      });
    }
  }
}
