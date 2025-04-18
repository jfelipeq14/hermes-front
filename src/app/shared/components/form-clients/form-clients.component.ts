/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

import { bloodTypes, sexlist, typesDocument } from '../../constants';
import { MunicipalityModel, UserModel } from '../../../models';
import { MunicipalityService } from '../../../services';

@Component({
  selector: 'app-form-clients',
  templateUrl: './form-clients.component.html',
  styleUrls: ['./form-clients.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
  ],
  providers: [MunicipalityService, MessageService],
})
export class FormClientsComponent implements OnInit {
  @Input() user: UserModel = new UserModel(); // Recibe el modelo de usuario
  @Input() submitted = false; // Indica si el formulario fue enviado

  @Output() save = new EventEmitter<UserModel>(); // Emite el usuario al guardar
  @Output() clientCreated = new EventEmitter<any>(); // Emite el cliente creado al componente padre

  typesDocument = typesDocument; // Lista de tipos de documento para el dropdown
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

  ngOnInit(): void {
    this.getAllMunicipalities(); // Obtiene todas las municipalidades al iniciar el componente
  }

  onSave() {
    this.save.emit(this.user); // Emite el usuario al guardar
  }

  createClientHandler(documentValue: string): void {
    this.clientCreated.emit(documentValue); // Emite el cliente creado al componente padre
  }
}
