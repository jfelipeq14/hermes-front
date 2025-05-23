/* eslint-disable @angular-eslint/component-class-suffix */
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MunicipalityModel, RoleModel, UserModel } from '../../models';
import { MunicipalityService, RolesService, UserService } from '../../services';
import { bloodTypes, epslist, sexlist, typesDocument } from '../../shared/constants';
import { PATTERNS } from '../../shared/helpers';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [CommonModule, TableModule, TagModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, FormsModule, InputTextModule, InputIconModule, IconFieldModule, DropdownModule, CalendarModule],
    providers: [UserService, MunicipalityService, RolesService, MessageService, ConfirmationService]
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

    patterns = PATTERNS;

    constructor(
        private userService: UserService,
        private municipalityService: MunicipalityService,
        private rolesService: RolesService,
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
                    life: 3000
                });
            }
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
                    life: 3000
                });
            }
        });
    }

    getAllRoles() {
        this.rolesService.getAll().subscribe({
            next: (roles) => {
                this.roles = roles;
            },
            error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error.message || 'No se pudieron cargar los roles',
                    life: 3000
                });
            }
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
                        life: 3000
                    });
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message || 'No se pudo actualizar el usuario',
                        life: 3000
                    });
                }
            });
        } else {
            this.userService.create(this.user).subscribe({
                next: (u) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `${u.name} creado`,
                        life: 3000
                    });
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message || 'No se pudo crear el usuario',
                        life: 3000
                    });
                }
            });
        }
        this.refresh();
        this.closePopup();
    }

    editUser(user: UserModel) {
        this.user = { ...user };
        const date = new Date(this.user.dateBirth);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajustar desfase de zona horaria
        this.user.dateBirth = date;
        this.userDialog = true;
    }

    changeStatusUser(user: UserModel) {
        this.confirmationService.confirm({
            message: `¿Está seguro de que desea cambiar el estado de ${user.name}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.userService.changeStatus(user.id).subscribe({
                    next: (updatedUser) => {
                        if (!updatedUser) {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo cambiar el estado del usuario',
                                life: 3000
                            });
                        }
                        // const index = this.users.findIndex((u) => u.id === updatedUser.id);
                        // if (index !== -1) {
                        //   this.users[index] = updatedUser;
                        // }
                        this.messageService.add({
                            severity: this.getSeverity(updatedUser.status),
                            summary: 'Éxito',
                            detail: `${updatedUser.name} ${updatedUser.status ? 'activado' : 'desactivado'}`,
                            life: 3000
                        });
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: e.error.message || 'No se pudo cambiar el estado del usuario',
                            life: 3000
                        });
                    }
                });
            }
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
