import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ReservationTravelerModel, UserModel } from '../../../models';
import { TagModule } from 'primeng/tag';
import { getSeverity } from '../../helpers';

@Component({
    selector: 'app-table-clients',
    templateUrl: './table-clients.component.html',
    styleUrl: './table-clients.component.scss',
    imports: [CommonModule, TableModule, ButtonModule, InputIconModule, IconFieldModule, TagModule]
})
export class TableClientsComponent {
    @Input() travelers: ReservationTravelerModel[] = [];

    clients: UserModel[] = [];
    getSeverity = getSeverity;

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getClientInfo(idTraveler: number) {
        const client = this.clients.find((client) => client.id === idTraveler);
        if (!client) return;
        return client;
    }
}
