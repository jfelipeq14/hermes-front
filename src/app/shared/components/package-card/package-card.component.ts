import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateModel, PackageModel, ServiceModel } from '../../../models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PackageService, ProgrammingService, ServiceService } from '../../../services';

@Component({
    selector: 'app-package-card',
    templateUrl: './package-card.component.html',
    styleUrl: './package-card.component.scss',
    imports: [CommonModule, ButtonModule],
    providers: [ProgrammingService, PackageService, ServiceService]
})
export class PackageCardComponent implements OnInit {
    constructor(
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private serviceService: ServiceService
    ) {}

    ngOnInit() {
        this.getAllDates();
        this.getAllPackages();
        this.getAllServices();
    }

    @Input() idDate = 0;
    @Input() disabled = true;
    @Output() clickReservation = new EventEmitter<number>();

    dates: DateModel[] = [];
    packages: PackageModel[] = [];
    services: ServiceModel[] = [];

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates;
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getAllPackages() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages;
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getAllServices() {
        this.serviceService.getAll().subscribe({
            next: (services) => {
                this.services = services;
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getDateInfo(idDate: number) {
        if (!idDate) return;
        const dateInfo = this.dates.find((date) => date.id === idDate);
        return dateInfo || new DateModel();
    }

    getPackageInfo(id: number) {
        const packageInfo = this.packages.find((pack) => pack.id === id);
        if (!packageInfo) return;

        return packageInfo;
    }

    getServiceInfo(id: number) {
        const serviceInfo = this.services.find((service) => service.id === id);
        if (!serviceInfo) return;
        return serviceInfo;
    }

    onClickReservation(idDate: number) {
        if (!idDate) return;
        this.clickReservation.emit(idDate);
    }
}
