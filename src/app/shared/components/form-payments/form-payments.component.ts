import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentModel } from '../../../models/payment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-form-payments',
  templateUrl: './form-payments.component.html',
  styleUrls: ['./form-payments.component.css'],
  imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, CalendarModule],
})
export class FormPaymentsComponent {
  @Input() payment: PaymentModel = new PaymentModel(); // Recibe el modelo de pago
  @Input() submitted = false; // Indica si el formulario fue enviado
  @Input() statuses: { name: string; value: boolean }[] = []; // Opciones de estado

  @Output() save = new EventEmitter<PaymentModel>(); // Emite el modelo de pago al guardar
  // @Output() cancel = new EventEmitter<void>(); // Emite un evento al cancelar

  onSave() {
    this.save.emit(this.payment); // Emite el modelo de pago al guardar
  }

  // onCancel() {
  //   this.cancel.emit(); // Emite el evento al cancelar
  // }

  }

