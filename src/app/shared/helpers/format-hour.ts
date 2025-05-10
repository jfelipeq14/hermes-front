export const formatTime = (date: string): string => {
    const parsedDate = new Date(date);
    const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
    const minutes = String(parsedDate.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};
