// --ESTADO DE RESERVA: Pendiente(no pago `N`), Confirmada(pago 50% `C`), Pagada(pago completo `P`), Modificada (M), Cancelada(No pago, no va `R`), En ejecución y Finalizada

import { ReservationTravelerModel } from './reservation-traveler';

export class ReservationModel {
    id = 0;
    idDate = 0;
    idUser = 0;
    price = 0;
    status: 'N' | 'C' | 'P' | 'M' | 'R' | 'E' | 'F' = 'N';
    detailReservationTravelers: ReservationTravelerModel[] = [];
}
