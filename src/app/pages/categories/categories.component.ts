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
import { CategoryService } from '../../services';
import { CategoryModel } from '../../models';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
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
  ],
  providers: [CategoryService, MessageService, ConfirmationService],
})
export class CategoriesPage implements OnInit {
  category: CategoryModel = new CategoryModel();
  categories: CategoryModel[] = [];
  categoryDialog = false;
  submitted = false;
  statuses = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
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

  saveCategory() {
    this.submitted = true;
    if (!this.category.id) {
      this.categoryService.create(this.category).subscribe({
        next: (c) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${c.name} creado`,
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
      this.categoryService.update(this.category).subscribe({
        next: (c) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${c.name} actualizado`,
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
    this.closePopup();
  }

  editCategory(category: CategoryModel) {
    this.category = { ...category };
    this.categoryDialog = true;
  }

  changeStatusCategory(category: CategoryModel) {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea cambiar el estado de ' + category.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.changeStatus(category.id).subscribe({
          next: (c) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `${c.name} ${c.status ? 'activado' : 'desactivado'}`,
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
      },
    });
  }

  showPopup() {
    this.category = new CategoryModel();
    this.categoryDialog = true;
    this.submitted = false;
  }

  closePopup() {
    this.categoryDialog = false;
    this.category = new CategoryModel();
  }

  refresh() {
    this.getAllCategories();
  }
}
