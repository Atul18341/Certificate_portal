import Dexie, { Table } from 'dexie';

export interface StudentRecord {
  id?: number;
  trackingId: string;
  name: string;
  course: string;
  email: string;
  status: 'pending' | 'success';
}

export interface SettingsRecord {
  key: string;
  value: any;
}

export class CertibanaoDatabase extends Dexie {
  students!: Table<StudentRecord>;
  settings!: Table<SettingsRecord>;

  constructor() {
    super('Certibanao');
    this.version(1).stores({
      students: '++id, trackingId, name, course, status',
      settings: '&key'
    });
  }
}

export const db = new CertibanaoDatabase();