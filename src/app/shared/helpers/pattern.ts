export const PATTERNS = {
    NAME: '^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ\\s]{3,60}$',
    EMAIL: '^\[a\-z0\-9\.\!\#</span>%&*+/=?^_`{|}~-]+@[a-z0-9-]+\.[a-z0-9.]{2,}$',
    PASSWORD: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$',
    LEVEL: '^[0-5]$',
    ZONE: '^(N|S)$',
    HOUR: '^([01]\\d|2[0-3]):[0-5]\\d$',
    PHONE: '^\\+?[0-9]{1,3}[-\\s\\.]?[0-9]{6,}$',
    BLOOD: '^(A|B|AB|O)+[+|-]$',
    SEX: '^(M|F)$',
    DOCUMENT_TYPE: '^(CC|CE|PA|SC|CD|TE|PEP|AS|DU|CCEX|CEEX|PAEX|SCEX|CDEX|TEX|RNEX|PEPEX|ASEX)$',
    RESERVATION_STATUS: '^(N|C|P|M|R|E|F)$',
    PAYMENT_STATUS: '^(R|P|N|A|)$',
    IMAGE: /\.(jpg|jpeg|png)$/i,
    ID: '^[1-9]{1,999}$'
};
