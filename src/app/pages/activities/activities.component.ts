import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActivityModel } from '../../models';
import { ActivityService } from '../../services';

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
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
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
  providers: [ActivityService, MessageService, ConfirmationService],
})
export class ActivitiesPage implements OnInit {
  activityDialog: boolean = false;
  activities: ActivityModel[] = [];
  activity: ActivityModel = new ActivityModel();
  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];

  constructor(
    private activityService: ActivityService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'status', header: 'Estado' },
    ];
  }

  loadData() {
    this.activityService.getAll().subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.activity = new ActivityModel();
    this.submitted = false;
    this.activityDialog = true;
  }

  editActivity(activity: ActivityModel) {
    this.activity = { ...activity };
    this.activityDialog = true;
  }

  deleteActivity(activity: ActivityModel) {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea cambiar el estado de ' + activity.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.activityService.changeStatus(activity.id).subscribe({
          next: (a) => {
            if (!a) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cambiar el estado',
                life: 3000,
              });
              return;
            }
            this.loadData();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: `${a.name} cambio su estado`,
              life: 3000,
            });
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo cambiar el estado',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.activityDialog = false;
    this.submitted = false;
  }

  saveActivity() {
    this.submitted = true;

    if (this.activity.name.trim()) {
      if (!this.activity.id) {
        this.activityService.create(this.activity).subscribe({
          next: () => {
            this.loadData();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: `${this.activity.name} creado`,
              life: 3000,
            });
          },
          error: (e) => {
            console.error(e);
          },
        });
      } else {
        this.activityService.update(this.activity).subscribe({
          next: () => {
            this.loadData();
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: `${this.activity.name} actualizado`,
              life: 3000,
            });
          },
          error: (e) => {
            console.error(e);
          },
        });
      }

      this.activityDialog = false;
      this.activity = new ActivityModel();
    }
  }

  getStatusSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
}
