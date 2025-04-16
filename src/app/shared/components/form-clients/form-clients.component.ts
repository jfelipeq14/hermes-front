import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserModel } from '../../../models/user';
import { bloodTypes, sexlist } from '../../constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MunicipalityModel } from '../../../models';
import { MunicipalityService } from '../../../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-clients',
  templateUrl: './form-clients.component.html',
  styleUrls: ['./form-clients.component.css'],
  imports: [CommonModule,FormsModule,ButtonModule,DropdownModule],
  providers: [
      MunicipalityService,
      MessageService,
    ],
})

export class FormClientsComponent implements OnInit {
  @Input() user: UserModel = new UserModel(); // Recibe el modelo de usuario
  @Input() submitted = false; // Indica si el formulario fue enviado

  @Output() save = new EventEmitter<UserModel>(); // Emite el usuario al guardar
  // @Output() cancel = new EventEmitter<void>(); // Emite un evento al cancelar

  sexlist = sexlist; // Lista de sexos para el dropdown
  bloodTypes = bloodTypes; // Lista de tipos de sangre para el dropdown
  municipalities: MunicipalityModel[] = [];

  getAllMunicipalities() {
    this.municipalityService.getAll().subscribe({
      next: (municipalities) => {
        this.municipalities = municipalities;
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

  constructor(
    private municipalityService: MunicipalityService,
    private messageService: MessageService
  ) {}
  ngOnInit(
    ): void {
    this.getAllMunicipalities(); // Obtiene todas las municipalidades al iniciar el componente
  }

  onSave() {
    this.save.emit(this.user); // Emite el usuario al guardar
  }

  // onCancel() {
  //   this.cancel.emit(); // Emite el evento al cancelar
  // }
}
