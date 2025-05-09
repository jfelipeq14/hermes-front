// --ESTADO DE RESERVA: Pendiente(no pago `N`), Confirmada(pago 50% `C`), Pagada(pago completo `P`), Modificada (M), Cancelada(No pago, no va `R`), En ejecución y Finalizada
export const reservationStatus = [
    { name: 'Pendiente', value: 'N' },
    { name: 'Confirmada', value: 'C' },
    { name: 'Pagada', value: 'P' },
    { name: 'Modificada', value: 'M' },
    { name: 'Cancelada', value: 'R' },
    { name: 'En ejecución', value: 'E' },
    { name: 'Finalizada', value: 'F' }
];
