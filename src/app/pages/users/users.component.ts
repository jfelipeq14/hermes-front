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
import { MunicipalityModel, UserModel } from '../../models';
import { UserService } from '../../services';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MunicipalityService } from '../../services/municipality.service';
import { typesDocument } from '../../shared/constants/document-types';
import { sexlist } from '../../shared/constants/sex';
import { bloodTypes } from '../../shared/constants/blood-types';
import { epslist } from '../../shared/constants/eps';
import { RoleModel } from '../../models/role.model';
import { RoleService } from '../../services/role.service';

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
    DropdownModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    CalendarModule,
    TagModule,
  ],
  providers: [
    UserService,
    MunicipalityService,
    RoleService,
    MessageService,
    ConfirmationService,
  ],
})
export class UsersPage implements OnInit {
  users: UserModel[] = [];
  user: UserModel = new UserModel();
  userDialog = false;
  submitted = false;
  loading = false;

  // Dropdown options
  municipalities: MunicipalityModel[] = [];
  documentTypes = typesDocument;
  sexOptions = sexlist;
  bloodTypes = bloodTypes;
  epsList = epslist;
  roles: RoleModel[] = [];

  loggedInUserId = 1; // Example logged-in user ID

  constructor(
    private userService: UserService,
    private municipalityService: MunicipalityService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllRoles();
    this.getAllMunicipalities();
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

  getAllMunicipalities() {
    this.municipalityService.getAll().subscribe({
      next: (municipalities) => {
        this.municipalities = municipalities;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message || 'No se pudieron cargar los municipios',
          life: 3000,
        });
      },
    });
  }

  getAllRoles() {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message || 'No se pudieron cargar los roles',
          life: 3000,
        });
      },
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find((r) => r.id === roleId);
    return role ? role.name : 'No asignado';
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
    if (user.id === this.loggedInUserId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No puedes cambiar tu propio estado',
        life: 3000,
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cambiar el estado de ${user.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.changeStatus(user.id).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex((u) => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
            this.messageService.add({
              severity: this.getSeverity(updatedUser.status),
              summary: 'Éxito',
              detail: `${updatedUser.name} ${
                updatedUser.status ? 'activado' : 'desactivado'
              }`,
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
      },
    });
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
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
}
