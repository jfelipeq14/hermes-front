/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormClientsComponent } from '../form-clients/form-clients.component';
import {
  ReservationModel,
  ReservationTravelerModel,
  UserModel,
} from '../../../models';
import { MunicipalityService } from '../../../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-travelers',
  templateUrl: './form-travelers.component.html',
  styleUrl: './form-travelers.component.scss',
  imports: [TableModule, ButtonModule, CommonModule, FormClientsComponent],
  providers: [MunicipalityService, MessageService],
})
export class FormTravelersComponent {
  constructor(
    private readonly municipalityService: MunicipalityService,
    private readonly messageService: MessageService
  ) {}
  @Input() reservation: ReservationModel = new ReservationModel();
  @Input() travel = false;
  @Input() traveler: UserModel = new UserModel();
  @Input() travelers: ReservationTravelerModel[] = [];
  @Input() clients: UserModel[] = [];
  @Input() submitted = false;

  @Output() searchClient = new EventEmitter<any>();
  @Output() createClient = new EventEmitter<any>();
  @Output() addTraveler = new EventEmitter<any>();

  onSearchClient(document: string) {
    this.searchClient.emit(document);
  }

  onCreateClient(traveler: UserModel) {
    this.createClient.emit(traveler);
  }

  onAddTraveler() {
    this.addTraveler.emit();
  }
}
