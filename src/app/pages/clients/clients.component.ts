/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ClientsService } from '../../services';
import { UserModel } from '../../models';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss',
    imports: [CommonModule, TableModule, TagModule, ButtonModule, ToastModule, InputTextModule, InputIconModule, IconFieldModule, ConfirmDialogModule],
    providers: [ClientsService, MessageService, ConfirmationService]
})
export class ClientsPage implements OnInit {
    constructor(
        private clientsService: ClientsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    clients: UserModel[] = [];

    ngOnInit(): void {
        this.getAllClients();
    }

    getAllClients() {
        this.clientsService.getAll().subscribe({
            next: (clients) => {
                this.clients = clients;
            },
            error: (e) => console.error(e)
        });
    }

    getReservationsByClient(id: number) {
        return [id];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
