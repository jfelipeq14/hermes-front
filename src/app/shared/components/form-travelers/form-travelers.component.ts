/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormClientsComponent } from '../form-clients/form-clients.component';
import { ReservationModel, ReservationTravelerModel, UserModel } from '../../../models';
import { ClientsService, MunicipalityService } from '../../../services';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-form-travelers',
    templateUrl: './form-travelers.component.html',
    styleUrl: './form-travelers.component.scss',
    imports: [TableModule, ButtonModule, CommonModule, FormClientsComponent],
    providers: [ClientsService, MunicipalityService, MessageService]
})
export class FormTravelersComponent {
    @Input() reservation: ReservationModel = new ReservationModel();
    @Input() travel = false;
    @Input() traveler: UserModel = new UserModel();
    @Input() travelers: ReservationTravelerModel[] = [];
    @Input() clients: UserModel[] = [];
    @Input() submitted = false;
    @Input() isFormDisabled = false;

    @Output() searchClient = new EventEmitter<any>();
    @Output() createClient = new EventEmitter<any>();
    @Output() addTraveler = new EventEmitter<any>();
    @Output() deleteTraveler = new EventEmitter<any>();
    @Output() clearClient = new EventEmitter<any>();

    getInfoUser(idUser: number): UserModel {
        const traveler = this.clients.find((c) => c.id === idUser);

        if (!traveler) return new UserModel();

        return traveler;
    }

    onSearchClient(document: string) {
        this.searchClient.emit(document);
    }

    onCreateClient(traveler: UserModel) {
        this.createClient.emit(traveler);
    }

    onAddTraveler() {
        this.addTraveler.emit();
    }

    onDeleteTraveler(traveler: ReservationTravelerModel) {
        this.deleteTraveler.emit(traveler);
    }

    onClearClient() {
        this.clearClient.emit();
    }
}
