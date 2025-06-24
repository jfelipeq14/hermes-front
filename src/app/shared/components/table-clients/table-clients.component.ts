import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ReservationTravelerModel, UserModel } from '../../../models';
import { TagModule } from 'primeng/tag';
import { getSeverity } from '../../helpers';
import { ClientsService } from '../../../services';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-table-clients',
    templateUrl: './table-clients.component.html',
    styleUrl: './table-clients.component.scss',
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, InputIconModule, IconFieldModule, TagModule],
    providers: [ClientsService]
})
export class TableClientsComponent implements OnInit {
    constructor(private clientsService: ClientsService) {}

    ngOnInit() {
        this.getAllClients();
    }

    @Input() travelers: ReservationTravelerModel[] = [];

    clients: UserModel[] = [];
    getSeverity = getSeverity;

    getAllClients() {
        this.clientsService.getAll().subscribe({
            next: (clients) => {
                this.clients = clients;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getClientInfo(idTraveler: number) {
        const client = this.clients.find((client) => client.id === idTraveler);
        if (!client) return;
        return client;
    }
}
