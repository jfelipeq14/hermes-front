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
    @Input() payment: PaymentModel = new PaymentModel(); // Recibe el modelo de pago
    @Input() submitted = false; // Indica si el formulario fue enviado

    @Output() save = new EventEmitter<PaymentModel>(); // Emite el modelo de pago al guardar
    // @Output() cancel = new EventEmitter<void>(); // Emite un evento al cancelar

    onSave() {
        this.save.emit(this.payment); // Emite el modelo de pago al guardar
    }

    // onCancel() {
    //   this.cancel.emit(); // Emite el evento al cancelar
    // }
}
