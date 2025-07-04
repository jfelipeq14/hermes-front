import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PaymentModel } from '../../../models';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

import { PaymentMethodsComponent } from '../payment-methods/payment-methods.component';
import { UploadImageComponent } from '../upload-image/upload-image.component';

@Component({
    selector: 'app-form-payments',
    templateUrl: './form-payments.component.html',
    styleUrls: ['./form-payments.component.scss'],
    imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, InputIconModule, IconFieldModule, ButtonModule, DropdownModule, CalendarModule, PaymentMethodsComponent, UploadImageComponent]
})
export class FormPaymentsComponent {
    @Input() payment: PaymentModel = new PaymentModel();
    @Input() submitted = false;
    @Input() visible = true;
    @Input() isPayFixed: boolean = false;

    @Output() toCancel = new EventEmitter<void>();
    @Output() toSave = new EventEmitter<PaymentModel>();

    uploadImage(filePath: string) {
        this.payment.voucher = filePath;
        console.log('Imagen subida:', this.payment.voucher);
    }

    onCancel() {
        this.toCancel.emit();
    }

    onSave() {
        this.payment.pay = Math.round(this.payment.pay);
        this.payment.total = Math.round(this.payment.total);
        this.toSave.emit(this.payment);
    }
}
