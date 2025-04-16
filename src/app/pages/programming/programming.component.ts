/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { ProgrammingService } from '../../services';
import { DateModel } from '../../models';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrl: './programming.component.css',
  imports: [CalendarComponent],
  providers: [ProgrammingService, MessageService, ConfirmationService],
})
export class ProgrammingPage implements OnInit {
  constructor(
    private programmingService: ProgrammingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  date: DateModel = new DateModel();
  dates: DateModel[] = [];
  dateDialog = false;
  submitted = false;

  ngOnInit(): void {
    this.getAllDates();
  }

  getAllDates() {
    this.programmingService.getAll().subscribe({
      next: (dates) => {
        this.dates = dates;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message,
        });
      },
    });
  }

  handleDatesChanged(updatedDates: DateModel[]) {
    this.dates = updatedDates;
    this.programmingService.update(updatedDates).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Programación actualizada',
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
  }

  // createDate() {}

  editDate(date: DateModel): void {
    this.date = { ...date };

    // Show the dialog
    this.dateDialog = true;
    this.submitted = false;
  }

  changeStatusDate(date: DateModel): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea ${
        date.status ? 'desactivar' : 'activar'
      } la programación ${date.id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.programmingService.changeStatus(date.id).subscribe({
          next: (updatedDate) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Programación ${updatedDate.id} ${
                updatedDate.status ? 'activada' : 'desactivada'
              }`,
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
    this.date = new DateModel();
    this.dateDialog = true;
    this.submitted = false;
  }

  closePopup() {
    this.dateDialog = false;
    this.date = new DateModel();
  }

  refresh() {
    this.getAllDates();
    this.closePopup();
    this.submitted = false;
  }
}
