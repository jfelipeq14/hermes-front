/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PackageModel, ReservationModel, UserModel } from '../../models';
import { ClientsService, PackageService, ReservationsService } from '../../services';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss',
    imports: [CommonModule, TableModule, TagModule, ButtonModule, ToastModule, InputTextModule, InputIconModule, IconFieldModule, ConfirmDialogModule],
    providers: [ClientsService, PackageService, ReservationsService]
})
export class ClientsPage implements OnInit {
    constructor(
        private clientsService: ClientsService,
        private reservationsService: ReservationsService,
        private packagesService: PackageService
    ) {}

    clients: UserModel[] = [];
    packages: PackageModel[] = [];
    reservations: ReservationModel[] = [];
    expandedRows: Record<string, boolean> = {};

    ngOnInit(): void {
        this.getAllClients();
        this.getAllPackages();
    }

    getAllClients() {
        this.clientsService.getAll().subscribe({
            next: (clients) => {
                this.clients = clients;
            },
            error: (e) => console.error(e)
        });
    }

    getAllPackages() {
        this.packagesService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages;
            },
            error: (e) => console.error(e)
        });
    }

    getReservationsByClient(id: number) {
        this.reservationsService.getAllByUser(id).subscribe({
            next: (reservations) => {
                this.reservations = reservations;
            },
            error: (e) => console.error(e)
        });
    }

    getPackageInfo(id: number) {
        const packageInfo = this.packages.find((pack) => pack.id === id);
        if (!packageInfo) return;

        return packageInfo;
    }

    onRowExpand(event: any) {
        if (!event.data) {
            return;
        }

        // Collapse all other rows
        this.expandedRows = {};
        this.expandedRows[event.data.id] = true;

        this.getReservationsByClient(event.data.id);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
