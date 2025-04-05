/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RoleModel } from '../../models';
import { RolesService } from '../../services';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
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

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private roleService: RolesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  exportCSV() {
    this.dt.exportCSV();
  }

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

  deleteRole(role: RoleModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.delete(role.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `${role.name} Deleted`,
              life: 3000,
            });
          },
          error: (e) => {
            console.error(e);
          },
        });
        this.role = new RoleModel();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'role Deleted',
          life: 3000,
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
