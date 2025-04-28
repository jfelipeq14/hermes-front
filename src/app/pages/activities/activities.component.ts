/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ActivityModel } from '../../models';
import { ActivityService } from '../../services';

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
    DialogModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    TagModule,
  ],
  providers: [ActivityService, MessageService, ConfirmationService],
})
export class ActivitiesPage implements OnInit {
  //#region Variables
  activities: ActivityModel[] = [];
  activity: ActivityModel = new ActivityModel();
  activityDialog = false;
  submitted = false;
  statuses = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  //#endregion

  //#region constructor
  constructor(
    private activityService: ActivityService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  //#endregion

  ngOnInit() {
    this.getAllActivities();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAllActivities() {
    this.activityService.getAll().subscribe({
      next: (activities) => {
        this.activities = activities;
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

  saveActivity() {
    this.submitted = true;
    if (!this.activity.id) {
      this.activityService.create(this.activity).subscribe({
        next: (a) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${a.name} creado`,
            life: 3000,
          });
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
      this.refresh();
    } else {
      this.activityService.update(this.activity).subscribe({
        next: (a) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${a.name} atualizado`,
            life: 3000,
          });
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
      this.refresh();
    }
    this.refresh();
  }

  editActivity(activity: ActivityModel) {
    this.activity = { ...activity };
    this.activityDialog = true;
  }

  changeStatusActivity(activity: ActivityModel) {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea cambiar el estado de ' + activity.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.activityService.changeStatus(activity.id).subscribe({
          next: (a) => {
            this.messageService.add({
              severity: this.getSeverity(a.status),
              summary: 'Éxito',
              detail: `${a.name} ${a.status ? 'activado' : 'desactivado'}`,
              life: 3000,
            });
            this.refresh();
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
    this.activity = new ActivityModel();
    this.submitted = false;
    this.activityDialog = true;
  }

  closePopup() {
    this.activityDialog = false;
    this.submitted = false;
  }

  refresh() {
    this.getAllActivities();
    this.closePopup();
    this.submitted = false;
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }
}
