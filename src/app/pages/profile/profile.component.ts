import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserModel, MunicipalityModel } from '../../models';
import { ProfileService, MunicipalityService } from '../../services';
import {
  bloodTypes,
  typesDocument,
  sexlist,
  epslist,
} from '../../shared/constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
  ],
  providers: [
    ProfileService,
    MunicipalityService,
    MessageService,
    ConfirmationService,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: UserModel = new UserModel();
  originalUser: UserModel = new UserModel();

  // Estado para la UI
  loading = true;
  editMode = false;

  // Listas desplegables
  municipalities: MunicipalityModel[] = [];
  bloodTypes = bloodTypes;
  typesDocument = typesDocument;
  sexlist = sexlist;
  epslist = epslist;

  constructor(
    private profileService: ProfileService,
    private municipalityService: MunicipalityService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadMunicipalities();
  }

  /**
   * Carga los datos del perfil del usuario actual
   */
  loadUserProfile(): void {
    this.loading = true;
    this.profileService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user = userData;

        // Convertir la fecha de string a Date para el componente Calendar
        if (this.user.dateBirth) {
          this.user.dateBirth = new Date(this.user.dateBirth);
        }

        // Guardar una copia para poder cancelar los cambios
        this.originalUser = JSON.parse(JSON.stringify(this.user));
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error al cargar el perfil',
          life: 3000,
        });
        this.loading = false;
      },
    });
  }

  /**
   * Carga la lista de municipios para el dropdown
   */
  loadMunicipalities(): void {
    this.municipalityService.getAll().subscribe({
      next: (municipalities) => {
        this.municipalities = municipalities;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error al cargar los municipios',
          life: 3000,
        });
      },
    });
  }

  /**
   * Habilita el modo de edición del perfil
   */
  enableEditMode(): void {
    this.editMode = true;
  }

  /**
   * Cancela la edición y restaura los valores originales
   */
  cancelEdit(): void {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea cancelar la edición? Se perderán los cambios no guardados.',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        // Restaurar datos originales mediante deep clone para evitar referencias
        this.user = JSON.parse(JSON.stringify(this.originalUser));

        // Si la fecha es string, convertirla a Date para el componente Calendar
        if (this.user.dateBirth && typeof this.user.dateBirth === 'string') {
          this.user.dateBirth = new Date(this.user.dateBirth);
        }

        this.editMode = false;
      },
    });
  }

  /**
   * Guarda los cambios del perfil
   */
  saveChanges(): void {
    this.loading = true;

    // Crear una copia para enviar al servicio
    const userToUpdate = { ...this.user };

    this.profileService.updateProfile(userToUpdate).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;

        // Convertir la fecha de string a Date para el componente Calendar
        if (this.user.dateBirth && typeof this.user.dateBirth === 'string') {
          const date = new Date(this.user.dateBirth);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajustar desfase de zona horaria
          this.user.dateBirth = date;
        }

        // Actualizar la copia original
        this.originalUser = JSON.parse(JSON.stringify(this.user));

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado correctamente',
          life: 3000,
        });

        this.editMode = false;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error al actualizar el perfil',
          life: 3000,
        });
        this.loading = false;
      },
    });
  }
}
