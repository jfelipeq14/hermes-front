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
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { UserModel } from '../../models';
import { UserService } from '../../services';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
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
    CalendarModule,
    TagModule,
  ],
  providers: [UserService, MessageService, ConfirmationService],
})
export class UsersPage implements OnInit {
  users: UserModel[] = [];
  user: UserModel = new UserModel();
  userDialog = false;
  submitted = false;
  loading = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAllUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message || 'No se pudieron cargar los usuarios',
          life: 3000,
        });
      },
    });
  }

  showPopup() {
    this.user = new UserModel();
    this.submitted = false;
    this.userDialog = true;
  }

  closePopup() {
    this.userDialog = false;
    this.submitted = false;
  }

  refresh() {
    this.getAllUsers();
  }

  saveUser() {
    this.submitted = true;

    if (this.user.id) {
      this.userService.update(this.user).subscribe({
        next: (u) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${u.name} actualizado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message || 'No se pudo actualizar el usuario',
            life: 3000,
          });
        },
      });
    } else {
      this.userService.create(this.user).subscribe({
        next: (u) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${u.name} creado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message || 'No se pudo crear el usuario',
            life: 3000,
          });
        },
      });
    }
    this.refresh();
    this.closePopup();
  }

  editUser(user: UserModel) {
    this.user = { ...user };
    this.userDialog = true;
  }

  changeStatusUser(user: UserModel) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cambiar el estado de ${user.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.changeStatus(user.id).subscribe({
          next: (u) => {
            this.messageService.add({
              severity: this.getSeverity(u.status),
              summary: 'Éxito',
              detail: `${u.name} ${u.status ? 'activado' : 'desactivado'}`,
              life: 3000,
            });
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                e.error.message || 'No se pudo cambiar el estado del usuario',
              life: 3000,
            });
          },
        });
        this.refresh();
      },
    });
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }
}
