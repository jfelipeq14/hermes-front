import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateModel, PackageModel, ServiceModel } from '../../../models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-package-card',
    templateUrl: './package-card.component.html',
    styleUrl: './package-card.component.scss',
    imports: [CommonModule, ButtonModule]
})
export class PackageCardComponent {
    @Input() date: DateModel = new DateModel();
    @Input() packages: PackageModel[] = [];
    @Input() services: ServiceModel[] = [];
    @Output() clickReservation = new EventEmitter<number>();

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
