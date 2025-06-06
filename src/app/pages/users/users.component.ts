/* eslint-disable @angular-eslint/component-class-suffix */
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivateModel, MunicipalityModel, RoleModel, UserModel } from '../../models';
import { AuthService, MunicipalityService, RolesService, UserService } from '../../services';
import { bloodTypes, epslist, sexlist, typesDocument } from '../../shared/constants';
import { PATTERNS } from '../../shared/helpers';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [CommonModule, TableModule, TagModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, FormsModule, InputTextModule, InputIconModule, IconFieldModule, DropdownModule, DatePickerModule],
    providers: [UserService, MunicipalityService, RolesService, MessageService, ConfirmationService, AuthService]
})
export class UsersPage implements OnInit {
    users: UserModel[] = [];
    user: UserModel = new UserModel();
    userDialog = false;
    submitted = false;
    loading = false;

    isFieldInvalid(field: any, pattern?: string): boolean {
        if (!this.submitted) return false;
        if (pattern) {
            return !field || !field.toString().match(pattern);
        }
        return !field;
    }

    // Dropdown options
    municipalities: MunicipalityModel[] = [];
    typesDocument = typesDocument;
    sexOptions = sexlist;
    bloodTypes = bloodTypes;
    epsList = epslist;
    roles: RoleModel[] = [];

    patterns = PATTERNS;

    maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
    activateModel: ActivateModel = new ActivateModel();
    isFormDisabled = false;

    constructor(
        private userService: UserService,
        private municipalityService: MunicipalityService,
        private rolesService: RolesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
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

    validateForm(): boolean {
        this.submitted = true;

        if (!this.user.idRole || !this.user.typeDocument || !this.user.document || !this.user.name || !this.user.surName || !this.user.idMunicipality || !this.user.phone || !this.user.dateBirth || !this.user.email) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'Por favor complete todos los campos obligatorios',
                life: 3000
            });
            return false;
        }

        if (!this.user.email.match(this.patterns.EMAIL)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'El correo electrónico no es válido',
                life: 3000
            });
            return false;
        }

        if (!this.user.phone.match(this.patterns.PHONE)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'El número de teléfono no es válido',
                life: 3000
            });
            return false;
        }

        if (!this.isFormDisabled && !this.user.password?.match(this.patterns.PASSWORD)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
                life: 3000
            });
            return false;
        }

        return true;
    }

    createUser() {
        if (!this.validateForm()) return;

        if (!this.user.id) {
            this.authService.register(this.user).subscribe({
                next: (response) => {
                    if (!response) return;

                    this.activateModel.email = response.email;
                    this.activateModel.activationUserToken = response.activationToken;

                    this.authService.activateAccount(this.activateModel).subscribe({
                        next: (response) => {
                            if (!response) return;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Usuario ha sido creado y activado correctamente',
                                life: 3000
                            });
                            this.refresh();
                        },
                        error: (e) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al activar la cuenta: ' + (e.error.message || 'Error desconocido'),
                                life: 3000
                            });
                        }
                    });
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message === 'User already exists' ? 'El correo electrónico ya existe, ingrese otro correo por favor' : 'Error al crear el usuario: ' + (e.error.message || 'Error desconocido'),
                        life: 3000
                    });
                }
            });
        } else {
            this.userService.update(this.user).subscribe({
                next: (response) => {
                    if (!response) return;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario actualizado correctamente',
                        life: 3000
                    });
                    this.refresh();
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar el usuario: ' + (e.error.message || 'Error desconocido'),
                        life: 3000
                    });
                }
            });
        }
    }

    editUser(user: UserModel) {
        this.user = { ...user };
        const date = new Date(this.user.dateBirth);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajustar desfase de zona horaria
        this.user.dateBirth = date;
        this.userDialog = true;

        this.isFormDisabled = true;
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
                        this.refresh();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `${updatedUser.name} ${updatedUser.status ? 'ha sido activado' : 'ha sido desactivado'}`,
                            life: 3000
                        });
                        this.refresh();
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
        this.refresh();
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
        this.isFormDisabled = false;
        this.user = new UserModel();
    }

    refresh() {
        this.userDialog = false;
        this.submitted = false;
        this.getAllUsers();
    }
}
