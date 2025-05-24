/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PermitModel, PrivilegeModel, RoleModel, RolePrivilegeModel } from '../../models';
import { PermitsService, PrivilegeService, RolesService } from '../../services';
import { PATTERNS } from '../../shared/helpers';

type PermitPrivilegeMatrix = Record<
    string,
    {
        id: number;
        privileges: Record<
            string,
            {
                id: number;
                selected: boolean;
            }
        >;
        privilegeCount: number;
    }
>;

const ADMIN_ROLE_ID = 1;

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, DialogModule, InputTextModule, InputIconModule, IconFieldModule, ConfirmDialogModule, TagModule, CheckboxModule, TooltipModule],
    providers: [RolesService, PermitsService, PrivilegeService, MessageService, ConfirmationService]
})
export class RolesPage implements OnInit {
    roleDialog = false;
    roles: RoleModel[] = [];
    role: RoleModel = new RoleModel();
    submitted = false;
    loading = false;

    permits: PermitModel[] = [];
    privileges: PrivilegeModel[] = [];
    permitPrivilegeMatrix: PermitPrivilegeMatrix = {};
    privilegeNames: string[] = [];

    patterns = PATTERNS;

    constructor(
        private roleService: RolesService,
        private privilegeService: PrivilegeService,
        private permitsService: PermitsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getAllRoles();
        this.getAllPermits();
        this.getAllPrivileges();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getAllPermits() {
        this.permitsService.getAll().subscribe({
            next: (permits) => {
                this.permits = permits;
            },
            error: (error: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'No se pudieron cargar los permisos',
                    life: 3000
                });
            }
        });
    }

    getAllPrivileges() {
        this.privilegeService.getAll().subscribe({
            next: (privileges) => {
                this.privileges = privileges;
                this.initPermitPrivilegeMatrix();
            },
            error: (error: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'No se pudieron cargar los permisos',
                    life: 3000
                });
            }
        });
    }

    initPermitPrivilegeMatrix() {
        // Initialize matrix with permits
        this.permits.forEach((permit) => {
            this.permitPrivilegeMatrix[permit.name] = {
                id: permit.id,
                privileges: {},
                privilegeCount: 0
            };
        });

        // Add privileges to their corresponding permits and collect all privilege names
        this.privileges.forEach((privilege) => {
            const permitName = this.permits.find((p) => p.id === privilege.idPermit)?.name;
            if (permitName && this.permitPrivilegeMatrix[permitName]) {
                this.permitPrivilegeMatrix[permitName].privileges[privilege.name] = {
                    id: privilege.id,
                    selected: false
                };
                // Add to privilegeNames if not already present
                if (!this.privilegeNames.includes(privilege.name)) {
                    this.privilegeNames.push(privilege.name);
                }
            }
        });

        // Sort privilege names alphabetically
        this.privilegeNames.sort();
    }

    getAllRoles() {
        this.loading = true;
        this.roleService.getAll().subscribe({
            next: (roles) => {
                this.roles = roles;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'No se pudieron cargar los roles',
                    life: 3000
                });
            }
        });
    }

    getPermitName(idPermit: number) {
        const permitFound = this.permits.find((p) => p.id === idPermit);
        return permitFound?.name || 'Unknown';
    }

    openNew() {
        this.role = new RoleModel();
        this.submitted = false;
        this.roleDialog = true;
    }

    editRole(role: RoleModel) {
        if (role.id === ADMIN_ROLE_ID) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El rol Administrador no puede ser modificado',
                life: 3000
            });
            return;
        }

        this.role = { ...role };
        this.submitted = false;
        this.roleDialog = true;

        // Initialize the matrix with the role's privileges
        this.initPermitPrivilegeMatrix();
        role.rolePrivileges.forEach((rp: { idPrivilege: number }) => {
            const privilege = this.privileges.find((p) => p.id === rp.idPrivilege);
            if (privilege) {
                const permitName = this.permits.find((p) => p.id === privilege.idPermit)?.name;
                if (permitName && this.permitPrivilegeMatrix[permitName]) {
                    this.permitPrivilegeMatrix[permitName].privileges[privilege.name].selected = true;
                }
            }
        });

        // Update privilege counts for all permits
        for (const permitName in this.permitPrivilegeMatrix) {
            this.updatePermitPrivilegeCount(permitName);
        }
    }

    hideDialog() {
        this.roleDialog = false;
        this.submitted = false;
        this.role = new RoleModel();
        this.initPermitPrivilegeMatrix();
    }

    hasSelectedPrivileges(): boolean {
        // Check if any privilege is selected in the matrix
        for (const permitName in this.permitPrivilegeMatrix) {
            const permit = this.permitPrivilegeMatrix[permitName];
            for (const privilegeName in permit.privileges) {
                if (permit.privileges[privilegeName].selected) {
                    return true;
                }
            }
        }
        return false;
    }

    getSelectedPrivileges(): RolePrivilegeModel[] {
        const selectedPrivileges: RolePrivilegeModel[] = [];

        for (const permitName in this.permitPrivilegeMatrix) {
            const privileges = this.permitPrivilegeMatrix[permitName].privileges;
            for (const privilegeName in privileges) {
                const privilege = privileges[privilegeName];
                if (privilege.selected) {
                    selectedPrivileges.push({
                        idPrivilege: privilege.id
                    });
                }
            }
        }

        return selectedPrivileges;
    }

    getPrivilegeSelected(permitName: string, privilegeName: string): boolean {
        const permit = this.permitPrivilegeMatrix[permitName];
        if (!permit) return false;

        const privilege = permit.privileges[privilegeName];
        if (!privilege) return false;

        return privilege.selected;
    }

    togglePrivilege(permitName: string, privilegeName: string) {
        const permit = this.permitPrivilegeMatrix[permitName];
        if (!permit) return;

        const privilege = permit.privileges[privilegeName];
        if (!privilege) return;

        const selected = !privilege.selected;
        privilege.selected = selected;

        // Update rolePrivileges array
        if (selected) {
            // Add privilege if not already exists
            const existingPrivilege = this.role.rolePrivileges.find((rp) => rp.idPrivilege === privilege.id);

            if (!existingPrivilege) {
                this.role.rolePrivileges.push({
                    idPrivilege: privilege.id
                });
            }
        } else {
            // Remove privilege if it exists
            this.role.rolePrivileges = this.role.rolePrivileges.filter((rp) => rp.idPrivilege !== privilege.id);
        }

        // Update the permit's privilege count
        this.updatePermitPrivilegeCount(permitName);
    }

    updatePermitPrivilegeCount(permitName: string) {
        const permit = this.permitPrivilegeMatrix[permitName];
        if (!permit) return;

        // Count how many privileges are selected for this permit
        const selectedCount = Object.values(permit.privileges).filter((privilege) => privilege.selected).length;

        // Store the count in the permit object
        permit.privilegeCount = selectedCount;
    }

    saveRole() {
        this.submitted = true;

        if (!this.role.name?.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El nombre del rol es requerido',
                life: 3000
            });
            return;
        }

        if (!this.hasSelectedPrivileges()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar al menos un privilegio',
                life: 3000
            });
            return;
        }

        const saveRole$ = this.role.id ? this.roleService.update(this.role) : this.roleService.create(this.role);

        saveRole$.subscribe({
            next: (r) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `${r.name} ${this.role.id ? 'actualizado' : 'creado'} correctamente`,
                    life: 3000
                });
                this.getAllRoles();
                this.hideDialog();
            },
            error: (error: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'No se pudo guardar el rol',
                    life: 3000
                });
            }
        });
    }

    changeRoleStatus(role: RoleModel) {
        if (role.id === ADMIN_ROLE_ID) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El estado del rol Administrador no puede ser modificado',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            message: `¿Está seguro que desea ${role.status ? 'desactivar' : 'activar'} el rol "${role.name}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.roleService.changeStatus(role.id).subscribe({
                    next: (updatedRole) => {
                        role.status = updatedRole.status;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Rol ${role.status ? 'activado' : 'desactivado'} correctamente`,
                            life: 3000
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Error al cambiar el estado del rol',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    hasPrivilegesForPermit(permit: PermitModel): boolean {
        return this.privileges.some((privilege) => privilege.idPermit === permit.id);
    }
}
