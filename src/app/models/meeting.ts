import { ResponsibleModel } from './responsible';

export class MeetingModel {
  id = 0;
  idDate = 0;
  zone: 'N' | 'S' = 'N';
  hour = '';
  description = '';
  status = true;
  responsibles: ResponsibleModel[] = [];
}
