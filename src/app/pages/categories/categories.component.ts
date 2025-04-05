/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
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
import { CategoryService } from '../../services';
import { CategoryModel } from '../../models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [MessageService, ConfirmationService, CategoryService],
  standalone: true, // Si estás usando standalone components
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
})
export class CategoriesPage implements OnInit {
  // Variables
  popupVisible = false;
  submitted = false;
  category: CategoryModel = new CategoryModel();
  categories: CategoryModel[] = [];
  loading = false;
  // Agregar estas propiedades
  dt: Table | undefined;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV() {
    if (this.dt) {
      this.dt.exportCSV();
    }
  }

  getAllCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías',
        });
      },
    });
  }

  saveCategoryService(category: CategoryModel) {
    this.loading = true;
    this.submitted = true;
    if (category.id) {
      this.categoryService.update(category).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría actualizada',
          });
          this.getAllCategories();
          this.closePopup();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la categoría',
          });
        },
      });
    } else {
      this.categoryService.create(category).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría creada',
          });
          this.getAllCategories();
          this.closePopup();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la categoría',
          });
        },
      });
    }
  }

  showPopup() {
    this.category = new CategoryModel();
    this.popupVisible = true;
    this.submitted = false;
  }

  closePopup() {
    this.popupVisible = false;
    this.category = new CategoryModel();
  }

  editCategoryService(category: CategoryModel) {
    this.category = { ...category };
    this.popupVisible = true;
  }

  changeStatusCategoryService(category: CategoryModel) {
    category.status = !category.status;
    this.categoryService.update(category).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Estado de la categoría ${
            category.status ? 'activado' : 'desactivado'
          }`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cambiar el estado de la categoría',
        });
      },
    });
  }

  refresh() {
    this.getAllCategories();
  }
}
